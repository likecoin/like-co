import { Router } from 'express';

import {
  GETTING_STARTED_TASKS,
  // PUBSUB_TOPIC_MISC,
} from '../../constant';

import Validate from '../../util/ValidationHelper';
// import publisher from '../util/gcloudPub';

const {
  userCollection: dbRef,
  missionCollection: missionsRef,
  payoutCollection: bonusRef,
} = require('../util/firebase');

const router = Router();

function getIfReferralMissionDone(m, { u }) {
  const { id } = m;
  const user = u.data();
  switch (id) {
    case 'verifyEmail': {
      if (user.isEmailVerified) return true;
      break;
    }
    default: return false;
  }
  return false;
}

async function checkAlreadyDone(m, { u, doneList }) {
  const { id } = m;
  const mission = m.data();
  const username = u.id;
  const user = u.data();
  let isDone = false;
  switch (id) {
    case 'verifyEmail': {
      if (user.isEmailVerified) isDone = true;
      break;
    }
    default: return false;
  }
  if (!isDone) return false;
  const payload = { done: true };
  doneList.push(id);
  if (!mission.reward) payload.bonusId = 'none';
  await dbRef.doc(username).collection('mission').doc(id).set(payload, { merge: true });
  return (mission.staying || !mission.reward);
}

router.get('/mission/list/:id', async (req, res) => {
  try {
    const username = req.params.id;
    const [missionCol, userDoc] = await Promise.all([
      missionsRef.orderBy('priority').get(),
      dbRef.doc(username).get(),
    ]);
    if (!userDoc.exists) throw new Error('user not exist');
    const userMissionCol = await dbRef.doc(username).collection('mission').get();
    const userMisionList = userMissionCol.docs.map(d => d.id);
    const missionDone = userMissionCol.docs.filter(d => d.data().done).map(d => d.id);

    const replyMissionList = userMissionCol.docs
      .filter(d => !d.data().bonusId).map(d => ({ id: d.id, ...d.data() }));
    for (let index = 0; index < missionCol.docs.length; index += 1) {
      const m = missionCol.docs[index];
      if (!userMisionList.includes(m.id)) {
        const requires = m.data().require;
        const fulfilled = requires.every(id => missionDone.includes(id));
        if (fulfilled
          && (!m.data().isRefereeOnly || userDoc.data().referrer)
          // eslint-disable-next-line no-await-in-loop
          && !(await checkAlreadyDone(m, { u: userDoc, doneList: missionDone }))) {
          replyMissionList.push({ id: m.id, ...m.data() });
        }
      } else {
        const targetIndex = replyMissionList.findIndex(d => d.id === m.id);
        if (targetIndex >= 0) {
          replyMissionList[targetIndex] = Object.assign(m.data(), replyMissionList[targetIndex]);
        } else if (m.data().staying) {
          replyMissionList.push({ id: m.id, ...m.data() });
        }
      }
    }
    const missions = replyMissionList.map(d => ({ ...Validate.filterMissionData(d) }));
    res.json(missions);
  } catch (err) {
    const msg = err.message || err;
    console.error(msg);
    res.status(400).send(msg);
  }
});

router.post('/mission/seen/:id', async (req, res) => {
  try {
    const missionId = req.params.id;
    const {
      user,
    } = req.body;
    const userMissionRef = dbRef.doc(user).collection('mission').doc(missionId);
    await userMissionRef.set({ seen: true }, { merge: true });
    res.sendStatus(200);
  } catch (err) {
    const msg = err.message || err;
    console.error(msg);
    res.status(400).send(msg);
  }
});

router.post('/mission/step/:id', async (req, res) => {
  try {
    const missionId = req.params.id;
    const {
      user,
      taskId,
    } = req.body;
    const userMissionRef = dbRef.doc(user).collection('mission').doc(missionId);
    const doc = await userMissionRef.get();
    let done = false;
    switch (missionId) {
      case 'gettingStart': {
        if (!GETTING_STARTED_TASKS.includes(taskId)) throw new Error('task unknown');
        const doneTasks = [taskId, ...Object.keys(doc.data())];
        done = GETTING_STARTED_TASKS.every(t => doneTasks.includes(t));
        break;
      }
      default: throw new Error('mission unknown');
    }
    const payload = { [taskId]: true };
    if (done) payload.done = true;
    await userMissionRef.set(payload, { merge: true });
    res.json(payload);
  } catch (err) {
    const msg = err.message || err;
    console.error(msg);
    res.status(400).send(msg);
  }
});

router.get('/mission/list/history/:id', async (req, res) => {
  try {
    const username = req.params.id;
    const userDoc = await dbRef.doc(username).get();
    if (!userDoc.exists) throw new Error('user not exist');
    const [userMissionCol, missionCol] = await Promise.all([
      dbRef.doc(username).collection('mission').get(),
      missionsRef.orderBy('priority').get(),
    ]);
    const doneList = userMissionCol.docs
      .filter(d => d.data().done).map(d => ({ id: d.id, ...d.data() }));

    for (let index = 0; index < doneList.length; index += 1) {
      const mission = missionCol.docs.find(m => (m.id === doneList[index].id));
      doneList[index] = Object.assign({}, { ...mission.data(), ...doneList[index] });
    }
    const missions = doneList.map(d => ({ ...Validate.filterMissionData(d) }));
    res.json(missions);
  } catch (err) {
    const msg = err.message || err;
    console.error(msg);
    res.status(400).send(msg);
  }
});

router.get('/referral/list/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = await dbRef.doc(id).collection('referrals').get();
    const missionCol = await missionsRef.where('isReferral', '==', true).orderBy('priority').get();

    const referees = query.docs.map((r) => {
      const missions = [];
      const missionDone = [];
      for (let index = 0; index < missionCol.docs.length; index += 1) {
        const m = missionCol.docs[index];
        const requires = m.data().require;
        const fulfilled = requires.every(mId => missionDone.includes(mId));
        if (fulfilled) {
          const done = getIfReferralMissionDone(m, { u: r });
          if (done) missionDone.push(m.id);
          missions.push({
            id: m.id,
            ...m.data(),
            done,
          });
        }
      }
      return {
        id: r.id,
        missions: missions.map(d => ({ ...Validate.filterMissionData(d) })),
      };
    });
    res.json(referees);
  } catch (err) {
    const msg = err.message || err;
    console.error(msg);
    res.status(400).send(msg);
  }
});

router.get('/referral/list/bonus/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [referrerDoc, refereeDoc] = await Promise.all([
      bonusRef
        .where('toId', '==', id)
        .where('referrer', '==', id)
        .where('waitForClaim', '==', true)
        .get(),
      bonusRef
        .where('toId', '==', id)
        .where('referee', '==', id)
        .where('waitForClaim', '==', true)
        .get(),
    ]);
    let results = [];
    results = results.concat(referrerDoc.docs
      .map(d => ({ id: d.id, ...Validate.filterPayoutData(d.data()) })));
    results = results.concat(refereeDoc.docs
      .map(d => ({ id: d.id, ...Validate.filterPayoutData(d.data()) })));
    res.json(results);
  } catch (err) {
    const msg = err.message || err;
    console.error(msg);
    res.status(400).send(msg);
  }
});

export default router;

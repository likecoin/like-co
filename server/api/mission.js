import { Router } from 'express';
import BigNumber from 'bignumber.js';

import {
  GETTING_STARTED_TASKS,
  ONE_LIKE,
  PUBSUB_TOPIC_MISC,
} from '../../constant';

import Validate from '../../util/ValidationHelper';
import publisher from '../util/gcloudPub';

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
    case 'inviteFriend': {
      const query = await u.ref.collection('referrals').where('isEmailVerified', '==', true).get();
      if (query.docs.length) isDone = true;
      break;
    }
    case 'refereeTokenSale': {
      if (!user.referrer) return false;
      const query = await u.ref.collection('referrals').where('isICO', '==', true).get();
      if (query.docs.length) isDone = true;
      break;
    }
    default: return false;
  }
  if (!isDone) return false;
  const payload = { done: true };
  doneList.push(id);
  if (!mission.reward || mission.staying) payload.bonusId = 'none';
  await dbRef.doc(username).collection('mission').doc(id).set(payload, { merge: true });
  return (!mission.staying && !mission.reward);
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
    const proxyMissions = missionCol.docs.reduce((accu, m) => {
      if (m.data().isProxy) accu[m.id] = true; // eslint-disable-line no-param-reassign
      return accu;
    }, {});
    const userMisionList = userMissionCol.docs.map(d => d.id);
    const missionDone = userMissionCol.docs.filter(d => d.data().done).map(d => d.id);

    const replyMissionList = userMissionCol.docs
      .filter(d => (!d.data().bonusId || proxyMissions[d.id]))
      .map(d => ({ id: d.id, ...d.data() }));
    for (let index = 0; index < missionCol.docs.length; index += 1) {
      const m = missionCol.docs[index];
      const missionData = m.data();

      if (missionData.startTs && Date.now() < missionData.startTs) {
        missionData.upcoming = missionData.startTs;
      }

      if (!userMisionList.includes(m.id)) {
        const requires = missionData.require;
        const fulfilled = requires.every(id => missionDone.includes(id));
        if (fulfilled
          && (!missionData.isRefereeOnly || userDoc.data().referrer)
          // eslint-disable-next-line no-await-in-loop
          && !(await checkAlreadyDone(m, { u: userDoc, doneList: missionDone }))) {
          replyMissionList.push({ id: m.id, ...missionData });
        }
      } else {
        const targetIndex = replyMissionList.findIndex(d => d.id === m.id);
        if (targetIndex >= 0) {
          replyMissionList[targetIndex] = Object.assign(missionData, replyMissionList[targetIndex]);
        } else if (missionData.staying) {
          replyMissionList.push({ id: m.id, ...missionData });
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
    const userDoc = await dbRef.doc(user).get();
    const {
      email,
      displayName,
      wallet,
      referrer,
      locale,
    } = userDoc.data();
    publisher.publish(PUBSUB_TOPIC_MISC, req, {
      logType: 'eventMissionSeen',
      user,
      email: email || undefined,
      displayName,
      wallet,
      referrer: referrer || undefined,
      locale,
      missionId,
    });
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
    const userDoc = await dbRef.doc(user).get();
    const {
      email,
      displayName,
      wallet,
      referrer,
      locale,
    } = userDoc.data();
    publisher.publish(PUBSUB_TOPIC_MISC, req, {
      logType: 'eventMissionStep',
      user,
      email: email || undefined,
      displayName,
      wallet,
      referrer: referrer || undefined,
      locale,
      missionId,
      taskId,
      missionDone: done,
    });
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

router.get('/mission/list/history/:id/bonus', async (req, res) => {
  try {
    const { id } = req.params;
    const query = await dbRef.doc(id).collection('bonus').get();
    const obj = query.docs
      .filter(t => t.data().txHash && t.data().value)
      .reduce((acc, t) => {
        const { value, type } = t.data();
        if (!acc[type]) acc[type] = new BigNumber(0);
        acc[type] = acc[type].plus(new BigNumber(value));
        return acc;
      }, {});
    Object.keys(obj).forEach((key) => {
      obj[key] = obj[key].dividedBy(ONE_LIKE).toFixed(4);
    });
    res.json(obj);
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

        /* Dont send upcoming to referee */
        const upcoming = m.data().startTs && Date.now() < m.data().startTs;
        if (fulfilled && !upcoming) {
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
        seen: !!r.data().seen,
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

router.post('/referral/seen/:id', async (req, res) => {
  try {
    const user = req.params.id;
    const {
      referralId,
    } = req.body;
    const userReferralRef = dbRef.doc(user).collection('referrals').doc(referralId);
    await userReferralRef.update({ seen: true });
    res.sendStatus(200);
  } catch (err) {
    const msg = err.message || err;
    console.error(msg);
    res.status(400).send(msg);
  }
});

export default router;

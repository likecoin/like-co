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
} = require('../util/firebase');

const router = Router();

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
    default: return true;
  }
  if (!isDone) return true;
  const payload = { done: true };
  doneList.push(id);
  if (!mission.reward) payload.bonusId = 'none';
  await dbRef.doc(username).collection('mission').doc(id).set(payload, { merge: true });
  return !!(mission.reward);
}

router.get('/mission/list/:id', async (req, res) => {
  try {
    const username = req.params.id;
    const missionCol = await missionsRef.orderBy('priority').get();
    const userDoc = await dbRef.doc(username).get();
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
        const fullfilled = requires.every(id => missionDone.includes(id));
        // eslint-disable-next-line no-await-in-loop
        if (fullfilled && (await checkAlreadyDone(m, { u: userDoc, doneList: missionDone }))) {
          replyMissionList.push({ id: m.id, ...m.data() });
        } else {
          let target = replyMissionList.find(d => d.id === m.id);
          target = Object.assign(m.data(), target);
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
    switch (missionId) {
      case 'gettingStart': {
        if (!GETTING_STARTED_TASKS.includes(taskId)) throw new Error('task unknown');
        break;
      }
      default: throw new Error('mission unknown');
    }
    const userMissionRef = dbRef.doc(user).collection('mission').doc(missionId);
    await userMissionRef.set({
      [taskId]: true,
    }, { merge: true });
    res.sendStatus(200);
  } catch (err) {
    const msg = err.message || err;
    console.error(msg);
    res.status(400).send(msg);
  }
});

export default router;

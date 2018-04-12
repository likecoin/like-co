import { Router } from 'express';

// import {
//   IS_TESTNET,
//   PUBSUB_TOPIC_MISC,
// } from '../../constant';

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

    const replyMissionList = userMissionCol.docs.filter(d => !d.data().bonusId);
    for (let index = 0; index < missionCol.docs.length; index += 1) {
      const m = missionCol.docs[index];
      if (!userMisionList.includes(m.id)) {
        const requires = m.data().require;
        const fullfilled = requires.every(id => missionDone.includes(id));
        // eslint-disable-next-line no-await-in-loop
        if (fullfilled && (await checkAlreadyDone(m, { u: userDoc, doneList: missionDone }))) {
          replyMissionList.push(m);
        }
      }
    }
    const missions = replyMissionList.map(d => ({
      id: d.id,
      ...Validate.filterMissionData(d.data()),
    }));
    res.json(missions);
  } catch (err) {
    const msg = err.message || err;
    console.error(msg);
    res.status(400).send(msg);
  }
});

router.post('/mission/seen/:id', async (req, res) => {
  try {
    const username = req.params.id;
    const {
      missionId,
    } = req.body;
    const userMissionRef = await dbRef.doc(username).collection('mission').doc(missionId);
    await userMissionRef.set({ seen: true }, { merge: true });
    res.sendStatus(200);
  } catch (err) {
    const msg = err.message || err;
    console.error(msg);
    res.status(400).send(msg);
  }
});

export default router;

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

router.get('/mission/list/:id', async (req, res) => {
  try {
    const username = req.params.id;
    const missionCol = await missionsRef.get();
    const userMissionCol = await dbRef.doc(username).collection('mission').get();
    const userMisionList = userMissionCol.docs.map(d => d.id);
    const missionDone = userMissionCol.docs.filter(d => d.data().done).map(d => d.id);

    const replyMissionList = userMissionCol.docs.filter(d => !d.data().payoutId);
    missionCol.forEach((m) => {
      if (userMisionList.includes(m.id)) return;
      let fullfilled = true;
      m.data().require.forEach((r) => {
        if (!missionDone.includes(r)) fullfilled = false;
      });
      if (fullfilled) replyMissionList.push(m);
    });
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

/* eslint import/no-unresolved: "off" */
/* eslint import/extensions: "off" */
import { INFURA_HOST } from '../../constant';

console.log('Using stub (firebase.js)'); /* eslint no-console: "off" */

const { FieldValue } = require('firebase-admin').firestore;
const Web3 = require('web3');
const cloneDeep = require('lodash.clonedeep');
const accounts = require('../config/accounts.js'); // eslint-disable-line import/no-extraneous-dependencies

const userData = require('../../test/data/user.json').users;
const txData = require('../../test/data/tx.json').tx;
const missionData = require('../../test/data/mission.json').missions;
const bonusData = require('../../test/data/bonus.json').bonus;

const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_HOST));

function docData(obj) {
  const res = {
    ...obj,
  };
  delete res.id;
  return res;
}

function docUpdate(obj, updateData) {
  if (Object.values(updateData).some(v => typeof v === 'undefined')) {
    throw new Error('Some value is undefined.');
  }
  Object.assign(obj, updateData);
  return global.Promise.resolve();
}

function docDelete(data, { id }) {
  const index = data.findIndex(obj => obj.id === id);
  data.splice(index, 1);
}

function docSet(data, id, setData, config) {
  if (Object.values(setData).some(v => typeof v === 'undefined')) {
    throw new Error('Some value is undefined.');
  }
  const obj = data.find(d => d.id === id);
  if (obj && config && config.merge) {
    return docUpdate(obj, setData);
  }
  const pushData = {
    ...setData,
    id,
  };
  data.push(pushData);
  return global.Promise.resolve();
}

function querySnapshotDocs(data) {
  return data.map((d) => {
    const docObj = {
      id: d.id,
      ref: {
        set: (setData, config) => docSet(data, d.id, setData, config),
        create: (setData, config) => docSet(data, d.id, setData, config),
        update: updateData => docUpdate(d, updateData),
      },
      data: () => docData(d),
    };
    return docObj;
  });
}

function collectionWhere(data, field, op, value) {
  let whereData = data;
  if (op === '==') {
    whereData = data.filter(d => d[field] === value);
  }
  const docs = querySnapshotDocs(whereData);
  const queryObj = {
    where: (sField, sOp, sValue) => collectionWhere(whereData, sField, sOp, sValue),
    orderBy: (sField, order = 'asc') => {
      if (sField in data[0] && (order === 'asc' || order === 'desc')) {
        return queryObj;
      }
      throw new Error('orderBy is incorrect.');
    },
    startAt: () => queryObj,
    limit: (limit) => {
      if (Number.isInteger(limit)) {
        return queryObj;
      }
      throw new Error('limit should be integer.');
    },
    get: () => global.Promise.resolve({
      docs,
      forEach: f => docs.forEach(f),
    }),
  };
  return queryObj;
}

function collectionDoc(data, id) {
  let docObj;
  const obj = data.find(d => d.id === id);
  if (obj) {
    // deep clone data object
    const cloneObj = cloneDeep(obj);
    docObj = {
      exists: true,
      id: obj.id,
      data: () => docData(cloneObj),
    };
    if (!obj.collection) {
      obj.collection = {};
    }
  } else {
    docObj = {
      data: () => undefined,
    };
  }

  return {
    get: function get() {
      return global.Promise.resolve({
        ...docObj,
        ref: this,
      });
    },
    set: (setData, config) => docSet(data, id, setData, config),
    create: (setData, config) => docSet(data, id, setData, config),
    update: (updateData) => {
      if (obj) {
        return docUpdate(obj, updateData);
      }
      return global.Promise.resolve();
    },
    delete: () => {
      if (obj) {
        return docDelete(data, obj);
      }
      throw new Error('Doc not exists for deletion.');
    },
    collection: (collectionId) => {
      if (!obj.collection[collectionId]) {
        obj.collection[collectionId] = [];
      }
      /* eslint no-use-before-define: "off" */
      return createCollection(obj.collection[collectionId]);
    },
  };
}

function createCollection(data) {
  return {
    where: (field, op, value) => collectionWhere(data, field, op, value),
    doc: id => collectionDoc(data, id),
    get: () => {
      const docs = querySnapshotDocs(data);
      return global.Promise.resolve({
        docs,
        forEach: f => docs.forEach(f),
      });
    },
    orderBy: () => collectionWhere(data),
  };
}

const userCollection = createCollection(userData);
const txCollection = createCollection(txData);
const iapCollection = createCollection([]);
const missionCollection = createCollection(missionData);
const payoutCollection = createCollection(bonusData);
const configCollection = createCollection([]);

function runTransaction(updateFunc) {
  return updateFunc({
    get: ref => ref.get(),
    create: (ref, data) => ref.create(data),
    set: (ref, data, config) => ref.create(data, config),
    update: (ref, data) => ref.update(data),
  });
}

async function initDb() {
  const delegatorAddress = accounts[0].address;
  const pendingCount = await web3.eth.getTransactionCount(delegatorAddress, 'pending');
  await txCollection.doc(`!counter_${delegatorAddress}`).set({ value: pendingCount });
  return true;
}

function createDb() {
  return {
    runTransaction: updateFunc => runTransaction(updateFunc),
  };
}

initDb();
const db = createDb();

module.exports = {
  db,
  userCollection,
  txCollection,
  iapCollection,
  missionCollection,
  payoutCollection,
  configCollection,
  bucket: {},
  FieldValue,
};

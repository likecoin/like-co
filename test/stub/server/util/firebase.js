console.log('Using stub (firebase.js)'); /* eslint no-console: "off" */

const { FieldValue } = require('firebase-admin').firestore;

/* eslint import/no-unresolved: "off" */
const userData = require('../../test/data/user.json').users;
const txData = require('../../test/data/tx.json').tx;
const missionData = require('../../test/data/mission.json').missions;
const bonusData = require('../../test/data/bonus.json').bonus;

function docData(obj) {
  const res = {
    ...obj,
  };
  delete res.id;
  return res;
}

function docUpdate(obj, updateData) {
  Object.assign(obj, updateData);
  return global.Promise.resolve();
}

function docSet(data, id, setData, config) {
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
    docObj = {
      exists: true,
      id: obj.id,
      data: () => docData(obj),
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
      throw new Error('Doc not exists for update.');
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

module.exports = {
  userCollection,
  txCollection,
  iapCollection,
  missionCollection,
  payoutCollection,
  configCollection,
  bucket: {},
  FieldValue,
};

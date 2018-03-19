console.log('Using stub (firebase.js)'); /* eslint no-console: "off" */

const { FieldValue } = require('firebase-admin').firestore;

/* eslint import/no-unresolved: "off" */
const userData = require('../../test/data/user.json').users;
const txData = require('../../test/data/tx.json').tx;

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

function collectionWhere(data, field, op, value) {
  if (op === '==') {
    const whereData = data.filter(d => d[field] === value);
    const docs = whereData.map((d) => {
      const docObj = {
        id: d.id,
        ref: {
          set: (setData, config) => docSet(data, d.id, setData, config),
          update: updateData => docUpdate(d, updateData),
        },
        data: () => docData(d),
      };
      return docObj;
    });
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
  throw new Error(`Do not support ${op} currently.`);
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
  } else {
    docObj = {};
  }
  return {
    get: () => global.Promise.resolve(docObj),
    set: (setData, config) => docSet(data, id, setData, config),
    update: (updateData) => {
      if (obj) {
        return docUpdate(obj, updateData);
      }
      throw new Error('Doc not exists for update.');
    },
  };
}

const userCollection = {
  where: (field, op, value) => collectionWhere(userData, field, op, value),
  doc: id => collectionDoc(userData, id),
};

const txCollection = {
  where: (field, op, value) => collectionWhere(txData, field, op, value),
  doc: id => collectionDoc(txData, id),
};

module.exports = {
  userCollection,
  txCollection,
  bucket: {},
  FieldValue,
};

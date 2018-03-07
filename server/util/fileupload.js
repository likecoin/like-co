const {
  bucket: fbBucket,
} = require('../util/firebase');

export function uploadFileAndGetLink(file, newFilename) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file'));
    }
    const filename = newFilename || file.originalname;
    const blob = fbBucket.file(filename);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });
    blobStream.on('error', (err) => {
      reject(new Error(`Something is wrong! ${err || err.msg}`));
    });
    blobStream.on('finish', () => {
      resolve(blob.getSignedUrl({
        action: 'read',
        expires: '01-07-2047',
      }));
    });
    blobStream.end(file.buffer);
  });
}

export function uploadFileAndGetMeta(file, newFilename) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file'));
    }
    const filename = newFilename || file.originalname;
    const blob = fbBucket.file(filename);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });
    blobStream.on('error', (err) => {
      reject(new Error(`Something is wrong! ${err || err.msg}`));
    });
    blobStream.on('finish', () => {
      resolve(blob.getMetadata());
    });
    blobStream.end(file.buffer);
  });
}

export default uploadFileAndGetLink;

const sharp = require('sharp');
const imageType = require('image-type');
const sha256 = require('js-sha256');

const {
  bucket: fbBucket,
} = require('./firebase');
const { ValidationError } = require('../../util/ValidationHelper');
const {
  IS_TESTNET,
  SUPPORTED_AVATER_TYPE,
} = require('../../constant');

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

export async function handleAvatarUploadAndGetURL(user, file, avatarSHA256) {
  const type = imageType(file.buffer);
  if (!SUPPORTED_AVATER_TYPE.has(type && type.ext)) throw new ValidationError('unsupported file format!');
  const hash256 = sha256(file.buffer);
  if (hash256 !== avatarSHA256) throw new ValidationError('avatar sha not match');
  const resizedBuffer = await sharp(file.buffer).resize(400, 400).toBuffer();
  file.buffer = resizedBuffer; // eslint-disable-line no-param-reassign
  const [avatarUrl] = await uploadFileAndGetLink(file, `likecoin_store_user_${user}_${IS_TESTNET ? 'test' : 'main'}`);
  return avatarUrl;
}

export default uploadFileAndGetLink;

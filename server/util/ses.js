/* eslint-disable no-underscore-dangle */

const aws = require('aws-sdk');

aws.config.loadFromPath('server/config/aws.json');

const ses = new aws.SES();

export async function sendVerificationEmail(res, user, ref) {
  const params = {
    Source: 'noreply@likecoin.store',
    Destination: {
      ToAddresses: [user.email],
    },
    Message: {
      Subject: {
        Charset: 'UTF-8',
        Data: res.__('Email.VerifiyEmail.subject'),
      },
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: res.__('Email.VerifiyEmail.body', {
            name: user.displayName,
            uuid: user.verificationUUID,
            ref,
          }),
        },
      },
    },
  };
  return ses.sendEmail(params).promise();
}

export async function sendVerificationWithCouponEmail(res, user, coupon, ref) {
  const params = {
    Source: 'noreply@likecoin.store',
    Destination: {
      ToAddresses: [user.email],
    },
    Message: {
      Subject: {
        Charset: 'UTF-8',
        Data: res.__('Email.VerifiyAndCouponEmail.subject'),
      },
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: res.__('Email.VerifiyAndCouponEmail.body', {
            name: user.displayName,
            uuid: user.verificationUUID,
            coupon,
            ref,
          }),
        },
      },
    },
  };
  return ses.sendEmail(params).promise();
}

export async function sendWelcomeEmail(user) {
  const params = {
    Source: 'noreply@likecoin.store',
    Destination: {
      ToAddresses: [user.email],
    },
    Message: {
      Subject: {
        Data: 'Welcome to Likecoin Store',
      },
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `Hi ${user.displayName}!

LikeCoin Foundation
https://likecoin.foundation

Thanks for joining the community.
`,
        },
      },
    },
  };
  return ses.sendEmail(params).promise();
}

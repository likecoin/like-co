/* eslint-disable no-underscore-dangle */
import EmailTemplate from '@likecoin/likecoin-email-templates';

const aws = require('aws-sdk');

aws.config.loadFromPath('server/config/aws.json');

const ses = new aws.SES();

export async function sendVerificationEmail(res, user, ref) {
  const params = {
    Source: '"LikeCoin Foundation" <noreply@like.co>',
    Destination: {
      ToAddresses: [user.email],
    },
    Message: {
      Subject: {
        Charset: 'UTF-8',
        Data: res.__('Email.VerifiyEmail.subject'),
      },
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: EmailTemplate.Basic({
            title: res.__('Email.VerifiyEmail.subject'),
            body: res.__('Email.VerifiyEmail.body', {
              name: user.displayName,
              uuid: user.verificationUUID,
              ref,
            }) + res.__('Email.signature'),
          }),
        },
      },
    },
  };
  return ses.sendEmail(params).promise();
}

export async function sendVerificationWithCouponEmail(res, user, coupon, ref) {
  const params = {
    Source: '"LikeCoin Foundation" <noreply@like.co>',
    Destination: {
      ToAddresses: [user.email],
    },
    Message: {
      Subject: {
        Charset: 'UTF-8',
        Data: res.__('Email.VerifiyAndCouponEmail.subject'),
      },
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: EmailTemplate.Basic({
            title: res.__('Email.VerifiyAndCouponEmail.subject'),
            body: res.__('Email.VerifiyAndCouponEmail.body', {
              name: user.displayName,
              uuid: user.verificationUUID,
              coupon,
              ref,
            }) + res.__('Email.signature'),
          }),
        },
      },
    },
  };
  return ses.sendEmail(params).promise();
}

export async function sendPendingSubscriptionEmail(res, email, subscriptionId) {
  const params = {
    Source: '"LikeCoin Foundation" <noreply@like.co>',
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: {
        Charset: 'UTF-8',
        Data: res.__('Email.PendingSubscriptionEmail.subject'),
      },
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: EmailTemplate.Basic({
            title: res.__('Email.PendingSubscriptionEmail.subject'),
            body: res.__(
              'Email.PendingSubscriptionEmail.body',
              { email, subscriptionId },
            ) + res.__('Email.signature'),
          }),
        },
      },
    },
  };
  return ses.sendEmail(params).promise();
}

export async function sendSubscriptionThankYouEmail(res, email, user) {
  const params = {
    Source: '"LikeCoin Foundation" <noreply@like.co>',
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: {
        Charset: 'UTF-8',
        Data: res.__('Email.SubscriptionThankYouEmail.subject'),
      },
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: EmailTemplate.Basic({
            title: res.__('Email.SubscriptionThankYouEmail.subject'),
            body: res.__(
              'Email.SubscriptionThankYouEmail.body',
              { name: user.displayName },
            ) + res.__('Email.signature'),
          }),
        },
      },
    },
  };
  return ses.sendEmail(params).promise();
}

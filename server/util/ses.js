const aws = require('aws-sdk');

aws.config.loadFromPath('server/config/aws.json');

const ses = new aws.SES();

export async function sendVerificationEmail(user) {
  const params = {
    Source: 'noreply@likecoin.store',
    Destination: {
      ToAddresses: [user.email],
    },
    Message: {
      Subject: {
        Data: 'Verify your Likecoin Store email',
      },
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `Hi ${user.displayName}!

Welcome to LikeCoin Store! To verify your email, click the following link:

https://likecoin.store/verify/${user.verificationUUID}

LikeCoin Foundation
https://likecoin.foundation`,
        },
      },
    },
  };
  return ses.sendEmail(params).promise();
}

export async function sendVerificationWithCouponEmail(user, coupon) {
  const params = {
    Source: 'noreply@likecoin.store',
    Destination: {
      ToAddresses: [user.email],
    },
    Message: {
      Subject: {
        Data: 'Verify your Likecoin Store email and Claim your LikeCoin',
      },
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `Hi ${user.displayName}!

Welcome to LikeCoin Store! To verify your email so that you can claim your LikeCoin, click the following link:

https://likecoin.store/verify/${user.verificationUUID}/${coupon}

Your coupon code: ${coupon}

LikeCoin Foundation
https://likecoin.foundation`,
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

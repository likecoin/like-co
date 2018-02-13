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

Welcome to LikeCoin Store! To verify your email so that you can publish packages, click the following link:

https://likecoin.store/verify/${user.verificationUUID}

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

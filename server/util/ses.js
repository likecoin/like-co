/* eslint-disable no-underscore-dangle */
import EmailTemplate from '@likecoin/likecoin-email-templates';

import {
  EXTERNAL_HOSTNAME,
  MEDIUM_REGEX,
} from '../../constant';

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
  const NUM_ARTICLES_DISPLAY = 3;

  const checkIsMedium = url => url && url.match(MEDIUM_REGEX);
  const getFeatureStoriesTable = (articles) => {
    const rows = [];
    for (let i = 0; i < articles.length; i += 1) {
      if (!articles[i].image || rows.length > NUM_ARTICLES_DISPLAY) break;
      rows.push(articles[i]);
    }

    return `
      <table
        style="margin: 0; padding: 0; border-collapse: collapse;"
        border="0"
        cellpadding="0"
        cellspacing="0"
        width="100%"
      >
        ${rows.map(article => (`
            <tr style="border-bottom: 2px solid #e6e6e6;">
              <td>
                <img src="${article.image}" style="width: 88px; height: 88px; object-fit: cover; padding: 8px 24px 0 12px;">
              </td>
              <td style="color: #4a4a4a;">
                <a
                  href="${article.url}"
                  style="font-weight: 600; font-size: 16px; text-decoration: none; color: #4a4a4a;"
                >
                  ${article.title}
                </a>
                <br>
                <span style="font-size: 12px;">
                  ${res.__('Email.SubscriptionThankYouEmail.articleAuthor', {
      url: `https://${EXTERNAL_HOSTNAME}/${article.user.id}`,
      name: article.user.displayName,
      siteName: checkIsMedium(article.url)
        ? 'Medium'
        : res.__('Email.SubscriptionThankYouEmail.individualSite'),
    })}
              </span>
              </td>
            </tr>
          `)).join('')}
      </table>
    `;
  };

  // TODO fetch featued stories with details
  const featuredStoriesContainer = getFeatureStoriesTable([
    {
      title: '再有交易所熱錢包被入侵！日本交易所 Zaif 被黑客攻擊，共損失67億日元 – Nicholas Yau – Medium',
      user: {
        id: 'nicholasyau',
        displayName: 'Nicholas Yau',
      },
      image: 'https://cdn-images-1.medium.com/max/1200/0*pCB5yzBQdYbJOSa4.jpg',
      url: 'https://medium.com/@nicholasyau/%E5%86%8D%E6%9C%89%E4%BA%A4%E6%98%93%E6%89%80%E7%86%B1%E9%8C%A2%E5%8C%85%E8%A2%AB%E5%85%A5%E4%BE%B5-%E6%97%A5%E6%9C%AC%E4%BA%A4%E6%98%93%E6%89%80-zaif-%E8%A2%AB%E9%BB%91%E5%AE%A2%E6%94%BB%E6%93%8A-%E5%85%B1%E6%90%8D%E5%A4%B167%E5%84%84%E6%97%A5%E5%85%83-ac03af1c458d',
    },
    {
      title: '「いいね」が収入になるWordPress(ワードプレス)プラグイン | 仮想通貨サテライト',
      user: {
        id: 'crypto-satellite2017',
        displayName: 'crypto-satellite2017',
      },
      image: 'https://cryptocurrency-sat.com/wp-content/uploads/2018/09/likecoin.png',
      url: 'https://cryptocurrency-sat.com/topic/press/wordpress-plugin/',
    },
    {
      title: '小教程：快速認識 oice 視覺小說 app - 柚上柚下的果園',
      user: {
        id: 'kuroneko19940318',
        displayName: 'kuroneko19940318',
      },
      image: 'https://kuroneko19940318.like.community/wp-content/uploads/sites/26/2018/09/42145999_2176788862393700_2247722055770308608_n.jpg',
      url: 'https://kuroneko19940318.like.community/2018/09/20/%E5%B0%8F%E6%95%99%E7%A8%8B%EF%BC%9A%E5%BF%AB%E9%80%9F%E8%AA%8D%E8%AD%98-oice-%E8%A6%96%E8%A6%BA%E5%B0%8F%E8%AA%AA-app/',
    },
  ]);

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
          // !! requires template update https://github.com/likecoin/likecoin-email-templates/pull/5
          Data: EmailTemplate.Personal({
            title: res.__('Email.SubscriptionThankYouEmail.subject'),
            body: res.__(
              'Email.SubscriptionThankYouEmail.body',
              { name: user.displayName },
            ) + featuredStoriesContainer,
            avatar: user.avatar,
            user: user.displayName,
            isSubscriber: true,
          }),
        },
      },
    },
  };
  return ses.sendEmail(params).promise();
}

import EmbedCreateWidgetButton from '~/components/embed/EmbedCreateWidgetButton';
import EmbedUserInfo from '~/components/embed/EmbedUserInfo';
import SocialMediaConnect from '~/components/SocialMediaConnect';

import {
  apiGetUserMinById,
  apiGetSocialListById,
} from '~/util/api/api';

export default {
  components: {
    EmbedCreateWidgetButton,
    EmbedUserInfo,
    SocialMediaConnect,
  },
  asyncData({
    params,
    error,
  }) {
    let amount = 8;
    try {
      const parse = parseInt(params.amount, 10);
      if (parse && !Number.isNaN(parse)) amount = parse;
    } catch (e) {
      // no op;
    }
    const { id } = params;
    return Promise.all([
      apiGetUserMinById(id),
      apiGetSocialListById(id).catch(() => {}),
    ]).then((res) => {
      const {
        displayName,
        avatar,
      } = res[0].data;
      return {
        id,
        displayName,
        avatar,
        amount,
        platforms: res[1].data,
      };
    }).catch(() => {
      error({ statusCode: 404, message: '' });
    });
  },
  computed: {
    getUserPath() {
      const amount = this.amount ? `/${this.amount}` : '';
      const referrer = this.urlReferrer ? `/?referrer=${this.urlReferrer}` : '';
      return `/${this.id}${amount}${referrer}`;
    },
    urlReferrer() {
      const { query } = this.$route;
      return query.referrer || '';
    },
    getReferralLink() {
      const referrer = this.urlReferrer ? `/?referrer=${this.urlReferrer}` : '';
      return `https://like.co/ref/${this.id}${referrer}`;
    },
  },
};

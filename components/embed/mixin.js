import EmbedCreateWidgetButton from '~/components/embed/EmbedCreateWidgetButton';
import EmbedUserInfo from '~/components/embed/EmbedUserInfo';

import {
  apiGetUserMinById,
  apiQueryLikeCoinFiatPrice,
} from '~/util/api/api';
import { MEDIUM_REGEX } from '~/constant';

import User from '@/util/User';

export default {
  components: {
    EmbedCreateWidgetButton,
    EmbedUserInfo,
  },
  asyncData({
    params,
    error,
    query,
  }) {
    let amount;
    try {
      const parse = parseInt(params.amount, 10);
      if (parse && !Number.isNaN(parse)) amount = parse;
    } catch (e) {
      // no op;
    }

    const { id } = params;
    let { type = '' } = query;
    const { referrer = '' } = query;
    if (!type && referrer.match(MEDIUM_REGEX)) {
      type = 'medium';
    }

    return Promise.all([
      apiGetUserMinById(id),
      !amount && apiQueryLikeCoinFiatPrice()
        .then(res => res.data.price)
        .catch(() => 0.0082625),
    ]).then((res) => {
      const {
        displayName,
        avatar,
      } = res[0].data;

      let amountInUSD;
      if (!amount) {
        amountInUSD = 0.25;
        const USD_TO_LIKE = res[1];
        amount = (amountInUSD / USD_TO_LIKE).toFixed(2);
      }

      return {
        id,
        displayName,
        avatar,
        avatarHalo: User.getAvatarHaloType(res[0].data),
        amount,
        amountInUSD,
      };
    }).catch(() => {
      error({ statusCode: 404, message: '' });
    });
  },
  computed: {
    rootClass() {
      return [
        'likecoin-embed',
        {
          'likecoin-embed--with-halo': this.avatarHalo !== 'none',
        },
      ];
    },
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

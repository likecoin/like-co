<template>
  <footer>
    <div class="lc-container-1">
      <div class="lc-container-2">
        <div class="lc-content-wrapper">

          <span class="contract-address lc-mobile-hide">
            {{ $t('Footer.label.contract') }}
            <a
              :href="getAddress"
              target="_blank"
              rel="noopener"
            >
              {{ contractAddress }}
            </a>
          </span>

          <div class="right footer-links">
            <nuxt-link :to="{ name: 'in-policies' }">{{ $t('PoliciesPage.title') }}</nuxt-link>
            <a href="https://help.like.co/">{{ $t('Footer.button.support') }}</a>
          </div>

        </div>
      </div>
    </div>
  </footer>
</template>
<script>
import BigNumber from 'bignumber.js';
import EthHelper from '@/util/EthHelper';

import { mapGetters } from 'vuex';
import { ETHERSCAN_HOST, ONE_LIKE } from '@/constant';
import { LIKE_COIN_ADDRESS } from '@/constant/contract/likecoin';

export default {
  data() {
    return {
      contractAddress: LIKE_COIN_ADDRESS,
    };
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getCurrentLocale',
      'getLocalWallet',
      'getInfoMsg',
      'getInfoIsError',
    ]),
    getAddress() {
      return `${ETHERSCAN_HOST}/address/${this.contractAddress}`;
    },
  },
  watch: {
    async getUserInfo(e) {
      const {
        user,
        displayName,
        email,
        wallet,
      } = e;
      if (this.$intercom) {
        const opt = { LikeCoin: true };
        if (user) opt.user_id = user;
        if (displayName) opt.name = displayName;
        if (email && email !== 'verified') opt.email = email;
        if (wallet) {
          opt.wallet = wallet;
          const amount = await EthHelper.queryEthBalance(wallet);
          opt.ETH = Number(new BigNumber(amount).dividedBy(ONE_LIKE).toFixed(4));
        }
        this.$intercom.update(opt);
      }
      if (this.$raven) {
        const opt = {
          id: user,
          username: displayName,
        };
        if (email && email !== 'verified') opt.email = email;
        this.$raven.setUserContext(opt);
      }
    },
    getCurrentLocale(language) {
      if (this.$intercom) {
        this.$intercom.update({ language });
      }
    },
    getInfoMsg(message) {
      if (this.getInfoIsError && this.$intercom) {
        this.$intercom.update({ lastError: message });
        this.$intercom.trackEvent('likecoin-store_error', { message });
      }
    },
  },
  mounted() {
    const {
      user,
      displayName,
      email,
    } = this.getUserInfo;
    const wallet = this.getLocalWallet;
    if (this.$intercom) {
      const language = this.getCurrentLocale;
      const opt = { LikeCoin: true };
      if (user) opt.user_id = user;
      if (displayName) opt.name = displayName;
      if (email && email !== 'verified') opt.email = email;
      if (language) opt.language = language;
      if (wallet) {
        opt.wallet = wallet;
        EthHelper.queryEthBalance(wallet)
          .then((amount) => {
            const ETH = new BigNumber(amount).dividedBy(ONE_LIKE).toFixed(4);
            this.$intercom.update({ ETH: Number(ETH) });
          });
      }
      this.$intercom.boot(opt);
    }
    if (this.$raven) {
      const opt = {
        id: user,
        username: displayName,
      };
      if (email && email !== 'verified') opt.email = email;
      this.$raven.setUserContext(opt);
    }
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

footer {
  position: relative;

  width: 100%;
  padding: 12px 0;

  border-top: 0;
  background-color: $like-white;

  // Gradient separator
  &::before {
    position: absolute;
    right: 0;
    bottom: 100%;
    left: 0;

    height: 2px;

    content: " ";

    background-image: linear-gradient(269deg, $like-light-blue, $like-gradient-1);
  }

  .lc-content-wrapper {
    display: flex;
    justify-content: space-between;
  }

  .contract-address {
    text-align: left;

    font-size: 10px;

    a {
      color: $like-green;
    }
  }

  .footer-links {
    display: flex;
    flex-wrap: wrap;

    margin-left: 24px;

    // Prevent overlapping with Intercom button
    @media (max-width: 1647px) {
      margin-right: 64px;
    }
    @media (max-width: 1024px) {
      margin-right: 108px;
    }
    @media (max-width: 768px) {
      flex-direction: column;
    }

    > a {
      display: block;

      text-align: left;

      color: #6B6B6B;

      font-size: 12px;
      font-weight: 400;

      &:not(:last-child) {
        margin-right: 24px;
      }
    }
  }
}
</style>

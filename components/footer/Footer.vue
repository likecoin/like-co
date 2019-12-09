<template>
  <footer>
    <div class="lc-container-1">
      <div class="lc-container-2">
        <div class="lc-content-wrapper">

          <span class="chain-address lc-mobile-hide">
            <a
              :href="BIGDIPPER_HOST"
              target="_blank"
              rel="noopener"
            >
              {{ $t('Footer.label.chain') }}
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
import { setTrackerUserId } from '@/util/EventLogger';

import { mapGetters } from 'vuex';
import {
  BIGDIPPER_HOST,
  ETHERSCAN_HOST,
} from '@/constant';

export default {
  data() {
    return {
      BIGDIPPER_HOST,
    };
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getCurrentLocale',
      'getInfoMsg',
      'getInfoIsError',
      'getAuthCoreOAuthFactors',
      'getUserLikeCoinAmountInBigNumber',
    ]),
    getAddress() {
      return `${ETHERSCAN_HOST}/address/${this.contractAddress}`;
    },
  },
  watch: {
    async getUserInfo(e) {
      const {
        user,
        intercomToken,
        displayName,
        email,
        wallet,
        cosmosWallet,
        isAuthCore,
      } = e;
      if (this.$intercom) {
        const opt = { LikeCoin: true };
        if (user) opt.user_id = user;
        if (intercomToken) opt.user_hash = intercomToken;
        if (displayName) opt.name = displayName;
        if (email) opt.email = email;
        if (wallet) {
          opt.wallet = wallet;
        }
        if (cosmosWallet) {
          opt.cosmos_wallet = cosmosWallet;
        }
        if (isAuthCore) {
          opt.binded_authcore = true;
        }
        this.$intercom.update(opt);
      }
      if (user) {
        if (this.$sentry) {
          const opt = {
            id: user,
            username: displayName,
          };
          this.$sentry.configureScope((scope) => {
            scope.setUser(opt);
          });
        }
        await setTrackerUserId(user);
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
    getAuthCoreOAuthFactors(factors) {
      if (this.$intercom) {
        const services = factors.map(f => f.service);
        const opt = services.reduce((accumOpt, service) => {
          // eslint-disable-next-line no-param-reassign
          if (service) accumOpt[`binded_${service.toLowerCase()}`] = true;
          return accumOpt;
        }, {});
        this.$intercom.update(opt);
      }
    },
    getUserLikeCoinAmountInBigNumber(amount) {
      if (this.$intercom && amount) {
        const opt = { LIKE: amount.toFixed(4) };
        this.$intercom.update(opt);
      }
    },
  },
  async mounted() {
    const {
      user,
      intercomToken,
      displayName,
      email,
      wallet,
      cosmosWallet,
      isAuthCore,
    } = this.getUserInfo;
    if (this.$intercom) {
      const language = this.getCurrentLocale;
      const opt = { LikeCoin: true };
      if (user) opt.user_id = user;
      if (intercomToken) opt.user_hash = intercomToken;
      if (displayName) opt.name = displayName;
      if (email) opt.email = email;
      if (language) opt.language = language;
      if (wallet) {
        opt.wallet = wallet;
      }
      if (cosmosWallet) {
        opt.cosmos_wallet = cosmosWallet;
      }
      if (isAuthCore) {
        opt.binded_authcore = true;
      }
      const factors = this.getAuthCoreOAuthFactors;
      const services = factors.map(f => f.service);
      const socialOpt = services.reduce((accumOpt, service) => {
        // eslint-disable-next-line no-param-reassign
        if (service) accumOpt[`binded_${service.toLowerCase()}`] = true;
        return accumOpt;
      }, {});
      this.$intercom.boot({ ...opt, ...socialOpt });
    }
    if (user) {
      if (this.$sentry) {
        const opt = {
          id: user,
          username: displayName,
        };
        this.$sentry.configureScope((scope) => {
          scope.setUser(opt);
        });
      }
      await setTrackerUserId(user);
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

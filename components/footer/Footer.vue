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
            <a href="https://docs.like.co/">{{ $t('Footer.button.developer') }}</a>
            <nuxt-link :to="{ name: 'in-policies' }">{{ $t('PoliciesPage.title') }}</nuxt-link>
            <a href="https://help.like.co/">{{ $t('Footer.button.support') }}</a>
          </div>

        </div>
      </div>
    </div>
  </footer>
</template>
<script>
import {
  setUserSupportData,
  setUserSupportErrorEvent,
  setUserSupportOAuthFactors,
} from '@/util/EventLogger';

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
      'getAuthCoreCurrentUser',
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
        displayName,
      } = e;
      setUserSupportData(this, e);
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
      }
    },
    async getAuthCoreCurrentUser(u) {
      const {
        primaryPhone,
      } = u;
      setUserSupportData(this, { primaryPhone });
    },
    getCurrentLocale(language) {
      setUserSupportData(this, { language });
    },
    getInfoMsg(message) {
      if (this.getInfoIsError) {
        setUserSupportErrorEvent(this, message);
      }
    },
    getAuthCoreOAuthFactors(factors) {
      setUserSupportOAuthFactors(this, factors);
    },
    getUserLikeCoinAmountInBigNumber(amount) {
      if (amount) {
        const LIKE = amount.toFixed(4);
        setUserSupportData(this, { LIKE });
      }
    },
  },
  async mounted() {
    const {
      user,
      displayName,
      email,
      wallet,
      cosmosWallet,
      isAuthCore,
    } = this.getUserInfo;
    const {
      primaryPhone,
    } = this.getAuthCoreCurrentUser;
    setUserSupportData(this, {
      user,
      displayName,
      email,
      wallet,
      cosmosWallet,
      isAuthCore,
      primaryPhone,
    });
    const factors = this.getAuthCoreOAuthFactors || [];
    setUserSupportOAuthFactors(this, factors);
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

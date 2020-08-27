<!-- eslint-disable max-len -->

<template>
  <footer
    v-if="version === 2"
    class="section section--light"
  >
    <div class="container container--fixed">
      <div class="footer__content">
        <div>
          <img
            src="~/assets/webflow/images/LikeCoin_PressKit_Logo_Mono_Dark.svg"
            alt="LikeCoin"
            class="footer-logo"
          >
          <ul
            role="list"
            class="social-media-icons social-media-icons--footer w-list-unstyled"
          >
            <li>
              <a
                href="https://discord.gg/B23rueS"
                target="_blank"
                class="icon-button-link icon-button-link--light w-inline-block"
              >
                <div class="icon-button w-embed">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 204 200"
                    fill="currentColor"
                    width="24px"
                  >
                    <path d="M84,83.9c-5.7,0-10.2,5-10.2,11.1s4.6,11.1,10.2,11.1c5.7,0,10.2-5,10.2-11.1C94.3,88.9,89.7,83.9,84,83.9zM120.5,83.9c-5.7,0-10.2,5-10.2,11.1s4.6,11.1,10.2,11.1c5.7,0,10.2-5,10.2-11.1S126.2,83.9,120.5,83.9z" />
                    <path d="M169.1,0h-134C23.8,0,14.6,9.2,14.6,20.6v135.2c0,11.4,9.2,20.6,20.5,20.6h113.4l-5.3-18.5l12.8,11.9l12.1,11.2l21.5,19V20.6C189.6,9.2,180.4,0,169.1,0z M130.5,130.6c0,0-3.6-4.3-6.6-8.1c13.1-3.7,18.1-11.9,18.1-11.9c-4.1,2.7-8,4.6-11.5,5.9c-5,2.1-9.8,3.5-14.5,4.3c-9.6,1.8-18.4,1.3-25.9-0.1c-5.7-1.1-10.6-2.7-14.7-4.3c-2.3-0.9-4.8-2-7.3-3.4c-0.3-0.2-0.6-0.3-0.9-0.5c-0.2-0.1-0.3-0.2-0.4-0.3c-1.8-1-2.8-1.7-2.8-1.7s4.8,8,17.5,11.8c-3,3.8-6.7,8.3-6.7,8.3c-22.1-0.7-30.5-15.2-30.5-15.2c0-32.2,14.4-58.3,14.4-58.3c14.4-10.8,28.1-10.5,28.1-10.5l1,1.2c-18,5.2-26.3,13.1-26.3,13.1s2.2-1.2,5.9-2.9c10.7-4.7,19.2-6,22.7-6.3c0.6-0.1,1.1-0.2,1.7-0.2c6.1-0.8,13-1,20.2-0.2c9.5,1.1,19.7,3.9,30.1,9.6c0,0-7.9-7.5-24.9-12.7l1.4-1.6c0,0,13.7-0.3,28.1,10.5c0,0,14.4,26.1,14.4,58.3C161.1,115.4,152.6,129.9,130.5,130.6z" />
                  </svg>
                </div>
              </a>
            </li>
            <li>
              <a
                href="http://github.com/likecoin"
                target="_blank"
                class="icon-button-link icon-button-link--light w-inline-block"
              >
                <div class="icon-button w-embed">
                  <svg
                    viewbox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                  >
                    <path d="m12 .5c-6.63 0-12 5.28-12 11.792 0 5.211 3.438 9.63 8.205 11.188.6.111.82-.254.82-.567 0-.28-.01-1.022-.015-2.005-3.338.711-4.042-1.582-4.042-1.582-.546-1.361-1.335-1.725-1.335-1.725-1.087-.731.084-.716.084-.716 1.205.082 1.838 1.215 1.838 1.215 1.07 1.803 2.809 1.282 3.495.981.108-.763.417-1.282.76-1.577-2.665-.295-5.466-1.309-5.466-5.827 0-1.287.465-2.339 1.235-3.164-.135-.298-.54-1.497.105-3.121 0 0 1.005-.316 3.3 1.209.96-.262 1.98-.392 3-.398 1.02.006 2.04.136 3 .398 2.28-1.525 3.285-1.209 3.285-1.209.645 1.624.24 2.823.12 3.121.765.825 1.23 1.877 1.23 3.164 0 4.53-2.805 5.527-5.475 5.817.42.354.81 1.077.81 2.182 0 1.578-.015 2.846-.015 3.229 0 .309.21.678.825.56 4.801-1.548 8.236-5.97 8.236-11.173 0-6.512-5.373-11.792-12-11.792z" />
                  </svg>
                </div>
              </a>
            </li>
            <li>
              <a
                href="http://telegram.me/likecoin"
                target="_blank"
                class="icon-button-link icon-button-link--light w-inline-block"
              >
                <div class="icon-button w-embed">
                  <svg
                    viewbox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                  >
                    <path d="m9.417 15.181-.397 5.584c.568 0 .814-.244 1.109-.537l2.663-2.545 5.518 4.041c1.012.564 1.725.267 1.998-.931l3.622-16.972.001-.001c.321-1.496-.541-2.081-1.527-1.714l-21.29 8.151c-1.453.564-1.431 1.374-.247 1.741l5.443 1.693 12.643-7.911c.595-.394 1.136-.176.691.218z" />
                  </svg>
                </div>
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/likecoin"
                target="_blank"
                class="icon-button-link icon-button-link--light w-inline-block"
              >
                <div class="icon-button w-embed">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewbox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M24,4.56a10.38,10.38,0,0,1-2.84.78,4.94,4.94,0,0,0,2.17-2.72,10.14,10.14,0,0,1-3.12,1.19A4.92,4.92,0,0,0,11.7,7.17a5.07,5.07,0,0,0,.11,1.12A13.94,13.94,0,0,1,1.67,3.15,5,5,0,0,0,1,5.63,4.91,4.91,0,0,0,3.18,9.72,4.81,4.81,0,0,1,1,9.12v.05A5,5,0,0,0,4.9,14a5.36,5.36,0,0,1-1.29.16,4.13,4.13,0,0,1-.93-.09,5,5,0,0,0,4.6,3.43,9.9,9.9,0,0,1-6.1,2.1A9.12,9.12,0,0,1,0,19.54a13.81,13.81,0,0,0,7.55,2.21,13.91,13.91,0,0,0,14-14c0-.22,0-.43,0-.64A9.82,9.82,0,0,0,24,4.56Z" />
                  </svg>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
  <footer v-else>
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
  props: {
    version: {
      type: Number,
      default: 1,
    },
  },
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

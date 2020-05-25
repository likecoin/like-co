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
                href="https://join.g0v.tw/"
                target="_blank"
                class="icon-button-link icon-button-link--light w-inline-block"
              >
                <div class="icon-button w-embed">
                  <svg
                    viewbox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                  >
                    <path d="m8.843 12.651c-1.392 0-2.521 1.129-2.521 2.521v6.306c0 1.392 1.129 2.521 2.521 2.521s2.521-1.129 2.521-2.521v-6.306c-.001-1.392-1.13-2.521-2.521-2.521z" />
                    <path d="m.019 15.172c0 1.393 1.13 2.523 2.523 2.523s2.523-1.13 2.523-2.523v-2.523h-2.521c-.001 0-.001 0-.002 0-1.393 0-2.523 1.13-2.523 2.523z" />
                    <path d="m8.846-.001c-.001 0-.002 0-.003 0-1.393 0-2.523 1.13-2.523 2.523s1.13 2.523 2.523 2.523h2.521c0-1.431 0-1.083 0-2.528-.001-1.391-1.128-2.518-2.518-2.518z" />
                    <path d="m2.525 11.37h6.318c1.393 0 2.523-1.13 2.523-2.523s-1.13-2.523-2.523-2.523h-6.318c-1.393 0-2.523 1.13-2.523 2.523s1.13 2.523 2.523 2.523z" />
                    <path d="m21.457 6.323c-1.391 0-2.518 1.127-2.518 2.518v.005 2.523h2.521c1.393 0 2.523-1.13 2.523-2.523s-1.13-2.523-2.523-2.523c-.001 0-.002 0-.003 0z" />
                    <path d="m12.641 2.522v6.325c0 1.392 1.129 2.521 2.521 2.521s2.521-1.129 2.521-2.521v-6.325c0-1.392-1.129-2.521-2.521-2.521-1.392 0-2.521 1.129-2.521 2.521z" />
                    <path d="m17.682 21.476c0-1.392-1.129-2.521-2.521-2.521h-2.521v2.523c.001 1.391 1.129 2.519 2.521 2.519s2.521-1.129 2.521-2.521z" />
                    <path d="m21.479 12.649h-6.318c-1.393 0-2.523 1.13-2.523 2.523s1.13 2.523 2.523 2.523h6.318c1.393 0 2.523-1.13 2.523-2.523s-1.13-2.523-2.523-2.523z" />
                  </svg>
                </div>
              </a>
            </li>
            <li>
              <a
                href="https://medium.com/likecoin/"
                target="_blank"
                class="icon-button-link icon-button-link--light w-inline-block"
              >
                <div class="icon-button w-embed">
                  <svg
                    viewbox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                  >
                    <path d="m22.085 4.733 1.915-1.832v-.401h-6.634l-4.728 11.768-5.379-11.768h-6.956v.401l2.237 2.693c.218.199.332.49.303.783v10.583c.069.381-.055.773-.323 1.05l-2.52 3.054v.396h7.145v-.401l-2.52-3.049c-.273-.278-.402-.663-.347-1.05v-9.154l6.272 13.659h.729l5.393-13.659v10.881c0 .287 0 .346-.188.534l-1.94 1.877v.402h9.412v-.401l-1.87-1.831c-.164-.124-.249-.332-.214-.534v-13.467c-.035-.203.049-.411.213-.534z" />
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
                href="https://www.facebook.com/Liker.Land/"
                target="_blank"
                class="icon-button-link icon-button-link--light w-inline-block"
              >
                <div class="icon-button w-embed">
                  <svg
                    viewbox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                  >
                    <path d="m15.997 3.985h2.191v-3.816c-.378-.052-1.678-.169-3.192-.169-3.159 0-5.323 1.987-5.323 5.639v3.361h-3.486v4.266h3.486v10.734h4.274v-10.733h3.345l.531-4.266h-3.877v-2.939c.001-1.233.333-2.077 2.051-2.077z" />
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

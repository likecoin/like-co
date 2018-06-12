<template>
  <section class="cta-section">
    <div class="lc-container-1">

      <div class="lc-container-2">
        <div class="underlay gradient" />
        <div class="lc-container-3 lc-container-no-padding-mobile">
          <div class="lc-container-4">

            <div class="cta-section-body">

              <div class="cta-section-body-content lc-text-align-center-mobile">
                <h1>
                  {{ $t('Home.Sale.title.publicTokenSale') }}
                  <span class="status">
                    {{ $t('Home.Sale.title.isOver') }}
                  </span>
                </h1>

                <div class="raised-eth">
                  <span class="lc-font-size-16 lc-font-weight-600">
                    {{ $t('TokenSale.label.raised') }}:
                  </span>
                  <br class="lc-mobile-show" />
                  <span class="amount lc-font-weight-300 lc-font-size-46 lc-mobile">
                    {{ tokenSaleAmount }} ETH
                  </span>
                </div>

                <div class="token-sale-progress-wrapper lc-margin-top-8">
                  <tokensale-progress
                    class="cta-section-token-sale-progress" />
                </div>
              </div>

              <div class="cta-section-body-buttons">
                <ul>
                  <li v-if="getUserIsRegistered">
                    <md-button
                      class="cta-btn md-likecoin shadow"
                      @click="onClickSupportLikeCoinButton">
                      {{ $t('Home.Sale.button.supportLikeCoin') }}
                    </md-button>
                  </li>
                  <li v-else-if="getUserNeedAuth">
                    <md-button
                      class="cta-btn md-likecoin shadow"
                      @click="onClickSignInButton">
                      {{ $t('Home.Header.button.signIn') }}
                    </md-button>
                  </li>
                  <li v-else>
                    <md-button
                      class="cta-btn md-likecoin shadow"
                      @click="onClickRegisterButton">
                      {{ $t('Home.Header.button.signUp') }}
                    </md-button>
                  </li>
                  <li>
                    <md-button
                      class="cta-btn support md-likecoin shadow lc-text-align-center"
                      :href="QRYPTOS_LIKEETH_URL"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                        {{ $t('Home.Sale.button.tradeAtQRYPTOS') }}
                    </md-button>
                  </li>
                </ul>
              </div>

            </div>

          </div>
        </div>
      </div>

      <div class="lc-container-2" v-if="isShowFooter">
        <div class="lc-container-3">
          <div class="lc-container-4">

            <div class="cta-section-footer">
              <nav>
                <ul>
                  <li>
                    <nuxt-link :to="{ name: 'in-whitepaper' }">
                      {{ $t('Home.Sale.button.onePage') }}
                    </nuxt-link>
                  </li>
                  <li>
                    <nuxt-link :to="{ name: 'in-whitepaper' }">
                      {{ $t('Home.Sale.button.whitepaper') }}
                    </nuxt-link>
                  </li>
                </ul>
              </nav>

            </div>

          </div>
        </div>
      </div>

    </div>
  </section>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

import { logTrackerEvent } from '@/util/EventLogger';

import TokenSaleProgress from '~/components/TokenSaleProgress';

import {
  FINAL_TOKENSALE_ETH_VALUE,
  QRYPTOS_LIKEETH_URL,
} from '@/constant';

export default {
  name: 'cta-section',
  components: {
    'tokensale-progress': TokenSaleProgress,
  },
  props: {
    isShowFooter: {
      type: Boolean,
      default: true,
    },
    isShowSupportButton: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      tokenSaleAmount: FINAL_TOKENSALE_ETH_VALUE,
      QRYPTOS_LIKEETH_URL,
    };
  },
  computed: {
    ...mapGetters([
      'getUserIsRegistered',
      'getUserNeedAuth',
    ]),
  },
  methods: {
    ...mapActions([
      'showLoginWindow',
    ]),
    onClickRegisterButton() {
      this.$router.push({ name: 'in-register', query: { ref: '' } });
    },
    onClickTokenSaleButton() {
      this.$router.push({ name: 'in-tokensale' });
    },
    onClickSignInButton() {
      if (this.$route.name === 'index') {
        this.$router.push({ name: 'in' });
      } else {
        this.showLoginWindow();
      }
    },
    onClickSupportLikeCoinButton() {
      logTrackerEvent(this, 'RegFlow', 'ClickedSupportLikeCoinButton', 'User wants to support LikeCoin', 1);
      this.$router.push({ name: 'in-backer' });
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.cta-section {
  @media (max-width: 600px) {
    .underlay.gradient {
      background: $like-green;
    }
  }
}

.cta-section-body {
  display: flex;
  align-items: center;
  min-height: 212px;

  @media (max-width: 600px) {
    flex-direction: column;

    margin-bottom: -24px;
  }
}

.cta-section-body-content {
  position: relative;

  flex: 2;

  padding: 32px 0;

  @media (max-width: 600px) {
    width: 100%;
  }

  h1 {
    font-size: 38px;
    font-weight: 600;

    @media (max-width: 600px) {
      color: $like-white;

      font-size: 26px;
    }

    .status {
      color: $like-green;

      font-size: 32px;
      font-weight: 300;

      @media (max-width: 600px) {
        display: block;

        color: $like-white;

        font-size: 24px;
      }
    }
  }

  h2 {
    margin-top: 8px;

    font-size: 38px;
    font-weight: 300;

    @media (max-width: 600px) {
      color: $like-white;

      font-size: 26px;
    }

    &.completed-percentage {
      margin-top: 0;
      color: $like-green;

      font-size: 44px;

      @media (max-width: 768px) {
        font-size: 38px;
      }

      @media (max-width: 600px) {
        color: $like-light-blue;

        font-size: 32px;
      }
    }
  }

  h3 {
    margin-top: 20px;

    color: $like-gray-4;

    font-size: 20px;
    font-weight: 400;
    line-height: 1.5;

    @media (max-width: 600px) {
      color: $like-gray-3;

      font-size: 16px;
    }
  }

  h6 {
    margin-top: 8px;

    font-size: 14px;
    font-weight: 400;

    @media (max-width: 600px) {
      color: $like-gray-3;
    }
  }

  .raised-eth {
    color: $like-green;

    .amount {
      padding: 0 12px;
    }

    @media (max-width: 600px) {
      margin-top: 24px;

      color: $like-white;
    }
  }
}

.cta-section-body-buttons {
  position: relative;

  flex: 1;

  > ul {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    margin: 0;
    padding: 0;

    list-style: none;

    > li {
      width: 100%;
      padding: 4px;
    }
  }

  .cta-btn {
    min-width: 200px;
    margin: 0;

    background-image: linear-gradient(73deg, $like-gradient-2, $like-gradient-3);

    &[disabled] {
      color: $like-gray-4;
      background: $like-gray-5;
    }

    &.support {
      background-image: linear-gradient(60deg, $like-gradient-2, $like-green);
    }
  }
}

.cta-section-footer {
  padding: 24px 0;

  @media (max-width: 600px) {
    margin-top: 24px;
  }

  nav {
    > ul {
      display: flex;
      flex-wrap: wrap;

      margin: -20px;
      padding: 0;

      list-style: none;

      @media (max-width: 600px) {
        justify-content: center;

        margin: -10px;
      }

      > li {
        padding: 20px;

        @media (max-width: 600px) {
          padding: 10px;
        }

        a {
          text-decoration: underline;

          color: $like-green;

          font-size: 20px;

          @media (max-width: 600px) {
            font-size: 16px;
          }
        }
      }
    }
  }
}

.token-sale-progress-wrapper {
  :global(.lc-tokensale-progress-bar) {
    @media (max-width: 600px) {
      box-shadow: 0px 0px 3px 5px rgba(0, 0, 0, 0.1);
    }
  }
}

.md-button.md-likecoin {
  width: 100%;
}
</style>

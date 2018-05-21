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

                <div v-if="tokenSalePercentage" class="raised-eth">
                  <span class="lc-font-size-16 lc-font-weight-600">
                    {{ $t('TokenSale.label.raised') }}:
                  </span>
                  <br class="lc-mobile-show" />
                  <span class="amount lc-font-weight-300 lc-font-size-46 lc-mobile">
                    >{{ tokenSalePercentage }}%
                  </span>
                </div>

                <div class="token-sale-progress-wrapper lc-margin-top-8">
                  <tokensale-progress
                    class="cta-section-token-sale-progress"
                    :progress="tokenSaleProgress" />
                </div>
              </div>

              <div class="cta-section-body-buttons">
                <ul>
                  <li v-if="getUserIsRegistered">
                    <material-button
                    class="cta-btn"
                    :hasShadow="true"
                    @click=onClickSupportLikeCoinButton>
                    {{ $t('Home.Sale.button.supportLikeCoin') }}
                    </material-button>
                  </li>
                  <li v-else>
                    <material-button
                      class="cta-btn"
                      :hasShadow="true"
                      @click=onClickRegisterButton>
                      {{ $t('Dialog.transaction.button.createID') }}
                    </material-button>
                  </li>
                  <li>
                    <material-button
                      class="cta-btn support"
                      :hasShadow="true"
                      @click=onClickTokenSaleButton>
                      {{ $t('Home.Sale.button.aboutTokenSale') }}
                    </material-button>
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
import BigNumber from 'bignumber.js';

import { logTrackerEvent } from '@/util/EventLogger';

import CountdownTimer from '~/components/CountdownTimer';
import MaterialButton from '~/components/MaterialButton';
import TokenSaleProgress from '~/components/TokenSaleProgress';

import EthHelper from '@/util/EthHelper';
import { LIKE_COIN_ICO_ADDRESS } from '@/constant/contract/likecoin-ico';
import {
  TOKENSALE_SOFTCAP_ETH,
  ONE_LIKE,
} from '@/constant';

export default {
  name: 'cta-section',
  components: {
    CountdownTimer,
    MaterialButton,
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
      currentTokenSaleAmount: 0,
    };
  },
  computed: {
    ...mapGetters([
      'getUserIsRegistered',
    ]),
    tokenSaleProgress() {
      return this.currentTokenSaleAmount.toFixed(2);
    },
    tokenSalePercentage() {
      return Math.max(
        180,
        Math.floor((this.currentTokenSaleAmount / TOKENSALE_SOFTCAP_ETH) * 10) * 10,
      );
    },
  },
  methods: {
    ...mapActions([
      'queryTokensaleInitial',
    ]),
    onClickRegisterButton() {
      this.$router.push({ name: 'in-register', query: { ref: this.$route.name } });
    },
    onClickTokenSaleButton() {
      this.$router.push({ name: 'in-tokensale' });
    },
    onClickSupportLikeCoinButton() {
      logTrackerEvent(this, 'RegFlow', 'ClickedSupportLikeCoinButton', 'User wants to support LikeCoin', 1);
      this.$router.push({ name: 'in-backer' });
    },
    async updateTokenSaleProgress() {
      const amount = await EthHelper.queryEthBalance(LIKE_COIN_ICO_ADDRESS);
      const initial = await this.queryTokensaleInitial();
      this.currentTokenSaleAmount = new BigNumber(amount).dividedBy(ONE_LIKE)
        .plus(initial);
    },
  },
  mounted() {
    this.updateTokenSaleProgress();
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
</style>

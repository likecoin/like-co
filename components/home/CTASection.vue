<template>
  <section class="cta-section">
    <div class="lc-container-1">

      <div class="lc-container-2">
        <div class="underlay gradient" />
        <div class="lc-container-3">
          <div class="lc-container-4">

            <div class="cta-section-body">
              <!-- BEGIN - After announcing token sale date -->
              <div
                v-if="now.isBefore(SALE_DATE)"
                class="cta-section-body-content">
                <h1>{{ $t('Home.Sale.title.publicTokenSale') }}</h1>
                <h6>{{ $t('Home.Sale.label.startOn') }}</h6>
                <div class="token-sale-timer-wrapper">
                  <countdown-timer
                    class="cta-section-token-sale-timer"
                    :date="SALE_DATE"
                  />
                </div>
              </div>
              <!-- END - After announcing token sale date -->
              <!-- BEGIN - After token sale begins -->
              <div
                v-else
                class="cta-section-body-content">
                <h1>
                  {{ $t('Home.Sale.title.publicTokenSale') }}
                  <span class="now-live">{{ $t('Home.Sale.title.nowLive') }}</span>
                </h1>
                <h2 class="completed-percentage" v-if="tokenSalePercentage">
                  {{ $t('Home.Sale.label.completedPercent', { percent: tokenSalePercentage }) }}
                </h2>
                <div class="token-sale-progress-wrapper">
                  <tokensale-progress
                    class="cta-section-token-sale-progress"
                    :progress="tokenSaleProgress" />
                </div>
              </div>
              <!-- END - After token sale begins -->


              <div class="cta-section-body-buttons">
                <ul>
                  <!-- BEGIN - Before token sale begins -->
                  <li v-if="now.isBefore(SALE_DATE)">
                    <material-button
                      class="cta-btn"
                      :hasShadow="true"
                      @click=onClickJoinTokenSaleButton>
                      {{ $t('Home.Sale.button.joinTokenSale') }}
                    </material-button>
                  </li>
                  <!-- END - Before token sale begins -->
                  <!-- BEGIN - After token sale begins -->
                  <li v-else>
                    <material-button
                      class="cta-btn"
                      :hasShadow="true"
                      @click=onClickJoinTokenSaleButton>
                      {{ $t('Home.Sale.button.joinNow') }}
                    </material-button>
                  </li>
                  <!-- END - After token sale begins -->
                  <li v-if="isShowSupportButton">
                    <material-button
                      class="cta-btn support"
                      :hasShadow="true"
                      @click=onClickSupportLikeCoinButton>
                      {{ $t('Home.Sale.button.supportLikeCoin') }}
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
import BigNumber from 'bignumber.js';
import moment from 'moment';

import { logTrackerEvent } from '@/util/EventLogger';
import CountdownTimer from '~/components/CountdownTimer';
import MaterialButton from '~/components/MaterialButton';
import TokenSaleProgress from '~/components/TokenSaleProgress';

import EthHelper from '@/util/EthHelper';
import { LIKE_COIN_ICO_ADDRESS } from '@/constant/contract/likecoin-ico';
import {
  INITIAL_TOKENSALE_ETH,
  TOKENSALE_SOFTCAP_ETH,
  ONE_LIKE,
  SALE_DATE,
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
      SALE_DATE,
      now: moment(),
      currentTokenSaleAmount: 0,
    };
  },
  computed: {
    tokenSalePercentage() {
      return Math.round((this.currentTokenSaleAmount / TOKENSALE_SOFTCAP_ETH) * 100);
    },
    tokenSaleProgress() {
      return this.currentTokenSaleAmount.toFixed(2);
    },
  },
  methods: {
    onClickJoinTokenSaleButton() {
      logTrackerEvent(this, 'RegFlow', 'ClickedIAmInterestedButton', 'User is interested in early bird token sale', 1);
      this.$router.push({ name: 'in-tokensale' });
    },
    onClickSupportLikeCoinButton() {
      logTrackerEvent(this, 'RegFlow', 'ClickedSupportLikeCoinButton', 'User wants to support LikeCoin', 1);
      this.$router.push({ name: 'in-backer' });
    },
    async updateTokenSaleProgress() {
      const amount = await EthHelper.queryEthBalance(LIKE_COIN_ICO_ADDRESS);
      this.currentTokenSaleAmount = new BigNumber(amount).dividedBy(ONE_LIKE)
        .plus(INITIAL_TOKENSALE_ETH);
    },
  },
  mounted() {
    if (!moment().isBefore(SALE_DATE)) {
      this.updateTokenSaleProgress();
    }
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

    text-align: center;
  }

  h1 {
    font-size: 38px;
    font-weight: 600;

    @media (max-width: 600px) {
      color: $like-white;

      font-size: 26px;
    }

    .now-live {
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

.token-sale-timer-wrapper {
  @media (max-width: 600px) {
    margin-right: -8px;
    margin-left: -8px;
  }
}

.cta-section-token-sale-timer {
  max-width: 480px;
}

.token-sale-progress-wrapper {
  margin-top: 16px;

  @media (max-width: 600px) {
    margin-right: 0;
  }
}
</style>

<style lang="scss">
@import "~assets/variables";

.cta-section {
  .cta-section-token-sale-progress .lc-tokensale-progress-bar {
    @media (max-width: 600px) {
      box-shadow: 0px 0px 3px 5px rgba(0, 0, 0, 0.1);
    }
  }

  .cta-section-token-sale-timer {
    margin-top: 8px;

    ul {
      li {
        &::after {
          @media (max-width: 600px) {
            background-color: $like-light-blue !important;
          }
        }

        .date-value {
          @media (max-width: 768px) {
            font-size: 38px !important;
            line-height: 44px !important;
          }
        }

        .date-unit {
          @media (max-width: 768px) {
            font-size: 12px !important;
          }
        }

        .date-value,
        .date-unit {
          @media (max-width: 600px) {
            color: $like-light-blue !important;
          }
        }
      }
    }
  }
}
</style>

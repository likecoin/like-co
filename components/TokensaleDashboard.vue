<template>
  <div class="tokensale-dashboard">

    <div class="lc-container-2-extend">
      <div class="lc-container-3-extend-bg" />
      <div class="lc-container-3">
        <div class="lc-padding-top-32 lc-padding-bottom-16">

          <section class="countdown-section lc-text-align-center">
            <h1 class="lc-font-size-42 lc-font-weight-600 lc-mobile">
              {{ $t('TokenSale.title') }}
              <span
                v-if="isICOStarted"
                class="lc-font-weight-300 lc-color-like-green">
                {{ $t(`Home.Sale.title.${isICOEnded ? 'isOver' : 'nowLive'}`) }}
              </span>
            </h1>
            <h2
              v-if="isICOStarted && tokenSalePercentage"
              class="completed-percentage lc-font-weight-600 lc-color-like-green lc-padding-top-24 lc-padding-bottom-16 lc-mobile">
              {{ $t('Home.Sale.label.completedPercent', { percent: tokenSalePercentage }) }}
            </h2>
            <h3 v-if="!isICOStarted" class="lc-margin-top-12 lc-font-size-14 lc-font-weight-400">
              {{ $t('TokenSale.label.publicSaleStartIn') }}
            </h3>
            <countdown-timer v-if="!isICOStarted" :date="SALE_DATE" />
          </section>

        </div>
      </div>
    </div>

    <div class="lc-container-2">

      <div class="tokensale-progress-wrapper lc-container-3 lc-bg-gray-1 lc-padding-vertical-16">
        <tokensale-progress
          :progress="currentTokenSaleAmount.toFixed(2)"
          :total="maxTokenSaleAmount.toFixed(2)"/>

        <div class="lc-container-4">
          <div class="tokensale-amount lc-padding-top-12 lc-text-align-center">
            <span
              v-if="isICOEnded"
              class="lc-color-like-green lc-font-size-18 lc-font-weight-600">
              {{ $t('TokenSale.label.raised') }}:
            </span>
            <br v-if="isICOEnded" class="lc-mobile-show" />
            <span class="amount">
              <span class="current lc-color-like-green lc-font-size-46 lc-font-weight-300">{{ currentTokenSaleAmount.toFixed(2) }}</span>
              <span class="max lc-font-size-20 lc-font-weight-400"> / {{ maxTokenSaleAmount.toFixed(2) }} ETH</span>
            </span>
          </div>
        </div>
      </div>

      <section v-if="isICOStarted && !isICOEnded" class="lc-margin-top-8">
        <div class="lc-container-3 lc-bg-gray-1">
          <div class="lc-container-4 lc-padding-vertical-16">
            <div class="lc-text-align-center">
              {{ $t('TokenSale.label.publicSaleEndIn') }}
            </div>
            <countdown-timer :date="SALE_END_DATE" />
          </div>
        </div>
      </section>

      <section class="token-info-section lc-margin-top-8">
        <div class="lc-container-3 lc-bg-gray-1">
          <div class="lc-container-4 lc-padding-vertical-16">
            <div class="info-grid">
              <ul>
                <li>
                  <div>
                    <span class="label">{{ $t('TokenSale.label.token') }}</span>
                    <span class="value highlight">
                      LIKE
                    </span>
                  </div>
                </li>
                <li>
                  <div>
                    <span class="label">{{ $t('TokenSale.label.exchangeRate') }}</span>
                    <span class="value">1 ETH / 40,000 LIKE</span>
                  </div>
                </li>
                <li>
                  <div>
                    <span class="label">{{ $t('TokenSale.label.supply') }}</span>
                    <span class="value">600,000,000</span>
                  </div>
                </li>
                <li class="what-is-eth" v-if="!isICOEnded">
                  <a
                    :href="$t('TokenSale.label.whatIsEthLink')"
                    ref="noopener"
                    target="_blank">
                    <span class="lc-font-size-12">{{ $t('TokenSale.label.whatIsETH') }}</span>
                    <img :src="QuestionIcon" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

    </div>

  </div>
</template>


<script>
import BigNumber from 'bignumber.js';
import { mapActions } from 'vuex';

import CountdownTimer from '~/components/CountdownTimer';
import TokenSaleProgress from '~/components/TokenSaleProgress';

import QuestionIcon from '@/assets/tokensale/question.svg';

import EthHelper from '@/util/EthHelper';
import postICOMixin from '@/util/mixin/postICO';
import { LIKE_COIN_ICO_ADDRESS } from '@/constant/contract/likecoin-ico';
import {
  ONE_LIKE,
  SALE_DATE,
  SALE_END_DATE,
  SALE_DATE_ANNOUNCE_DATE,
  TOKENSALE_SOFTCAP_ETH,
} from '@/constant';

export default {
  name: 'tokensale-dashboard',
  components: {
    'tokensale-progress': TokenSaleProgress,
    CountdownTimer,
  },
  mixins: [postICOMixin],
  data() {
    return {
      QuestionIcon,

      SALE_DATE,
      SALE_END_DATE,

      currentTokenSaleAmount: 0,
      maxTokenSaleAmount: new BigNumber('12600'),
    };
  },
  computed: {
    isPreSale() {
      return (new Date() < SALE_DATE_ANNOUNCE_DATE);
    },
    isICOStarted() {
      return (new Date() >= SALE_DATE);
    },
    tokenSalePercentage() {
      return (this.currentTokenSaleAmount / TOKENSALE_SOFTCAP_ETH).toFixed(2) * 100;
    },
  },
  methods: {
    ...mapActions([
      'queryTokensaleInitial',
    ]),
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


.tokensale-progress-wrapper {
  padding-right: 0;
  padding-left: 0;

  @media (max-width: 600px) {
    overflow: hidden;
  }

  > .lc-tokensale-progress {
    margin-right: -8px;
    margin-left: -8px;
  }
}

.tokensale-amount {
  text-align: center;

  font-weight: 300;

  .amount {
    padding: 0 12px;
  }

  .current {
    color: $like-green;

    line-height: 62px;

    @media (max-width: 600px) {
      font-size: 36px;
    }
  }

  .max {
    font-size: 20px;
    font-weight: 400;
  }
}

.token-info-section {
  .info-grid {
    > ul {
      display: flex;
      flex-wrap: wrap;

      margin: -20px -12px;
      padding: 0;

      list-style: none;

      justify-content: center;

      @media (max-width: 600px) {
        margin: -12px;
      }
      @media (max-width: 480px) {
        flex-direction: column;
      }

      > li {
        flex-shrink: 0;

        margin: 20px 10px;

        @media (max-width: 600px) {
          margin: 12px;
        }

        > div {
          margin: -4px;

          @media (max-width: 480px) {
            display: flex;
            justify-content: space-between;
          }

          .highlight {
            color: #28646e;

            font-weight: 600 !important;
          }

          > a, span {
            display: block;

            margin: 4px;

            &.label {
              font-size: 14px;
              font-weight: 400;
              flex-shrink: 0;
            }

            &.value {
              font-size: 20px;
              font-weight: 300;

              @media (max-width: 480px) {
                font-size: 18px;

                text-align: right;
              }
            }
          }

          a {
            text-decoration: none;

            &:hover {
              opacity: .7;
            }
          }
        }

        &.what-is-eth {
          width: 100%;
          display: flex;
          align-items: center;
          flex-grow: 1;
          justify-content: center;

          @media (min-width: 480 + 1px) {
            margin-top: 0;
          }

          a {
            display: flex;
            flex-direction: row;

            text-decoration: underline;

            span {
              text-align: center;
            }

            img {
              margin-left: 4px;
            }
          }
        }
      }
    }
  }
}

.completed-percentage {
  font-size: 56px;

  @media (max-width: 600px) {
    font-size: 28px;
  }
}
</style>

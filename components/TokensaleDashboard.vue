<template>
  <section class="tokensale-dashboard">
    <div class="lc-container-0">
      <div class="lc-container-1 lc-section-block">

        <div class="lc-container-2-extend">
          <div class="lc-container-3-extend-bg" />
          <div class="lc-container-3">
            <div class="lc-padding-top-32 lc-padding-bottom-16">

              <section class="countdown-section lc-text-align-center">
                <h1 class="lc-font-size-42 lc-font-weight-600">
                  {{ isPreSale ? $t('TokenSale.preSaleTitle') : $t('TokenSale.title') }}
                  <span v-if="isPreSale || isICOStarted" class="lc-font-weight-300 lc-color-like-green">LIVE</span>
                </h1>
                <h2 v-if="isPreSale" class="lc-margin-top-12 lc-font-size-38 lc-font-weight-300">
                  {{ $t('TokenSale.label.bonusAndLimitedOffer') }}
                </h2>
                <h3 v-if="isPreSale || !isICOStarted" class="lc-margin-top-12 lc-font-size-14 lc-font-weight-400">
                  {{ isPreSale ? $t('TokenSale.label.limitedOfferCondition') : $t('TokenSale.label.publicSaleStartIn') }}
                </h3>
                <countdown-timer v-if="!isPreSale && !isICOStarted" :date="SALE_DATE" />
              </section>

            </div>
          </div>
        </div>

        <div class="lc-container-2">

          <div v-if="!isPreSale" class="tokensale-progress-wrapper lc-container-3 lc-bg-gray-1 lc-verticle-inset-4">
            <tokensale-progress
              :progress="currentTokenSaleAmount.toFixed(2)"
              :total="maxTokenSaleAmount.toFixed(2)"/>

            <div class="lc-container-4">
              <div class="tokensale-amount lc-verticle-inset-2 lc-text-align-center">
                <span class="current lc-color-like-green lc-font-size-46 lc-font-weight-300">{{ currentTokenSaleAmount.toFixed(2) }}</span>
                <span class="max lc-font-size-20 lc-font-weight-400"> / {{ maxTokenSaleAmount.toFixed(2) }} ETH</span>
              </div>
            </div>
          </div>
          <div v-else-if="isPreSale" class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 lc-padding-vertical-32 lc-text-align-center ">
              {{ $t('TokenSale.label.amountWillBeSentWhenSalesStart')}}
            </div>
          </div>

          <section class="token-info-section lc-margin-top-8">
            <div class="lc-container-3 lc-bg-gray-1">
              <div class="lc-container-4 lc-verticle-inset-4">
                <div class="info-grid">
                  <ul>
                    <li>
                      <div>
                        <span class="label">{{ $t('TokenSale.label.token') }}</span>
                        <span class="value highlight" >
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
                    <li class="what-is-eth">
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
    </div>
  </section>
</template>


<script>
import BigNumber from 'bignumber.js';

import CountdownTimer from '~/components/CountdownTimer';
import TokenSaleProgress from '~/components/TokenSaleProgress';

import QuestionIcon from '@/assets/tokensale/question.svg';

import EthHelper from '@/util/EthHelper';
import { LIKE_COIN_ICO_ADDRESS } from '@/constant/contract/likecoin-ico';
import {
  INITIAL_TOKENSALE_ETH,
  ONE_LIKE,
  SALE_DATE,
  SALE_DATE_ANNOUNCE_DATE,
} from '@/constant';

export default {
  name: 'tokensale-dashboard',
  components: {
    'tokensale-progress': TokenSaleProgress,
    CountdownTimer,
  },
  data() {
    return {
      QuestionIcon,

      SALE_DATE,

      currentTokenSaleAmount: INITIAL_TOKENSALE_ETH,
      maxTokenSaleAmount: new BigNumber('12600'),
    };
  },
  head() {
    const meta = [
      {
        hid: 'og_image',
        property: 'og:image',
        content: 'https://like.co/tokensale_og.jpg',
      },
    ];
    if (this.$route.query.from) {
      meta.push({
        hid: 'description',
        name: 'description',
        content: this.$t('TokenSale.head.fromDescription'),
      });
      meta.push({
        hid: 'og_description',
        property: 'og:description',
        content: this.$t('TokenSale.head.fromDescription'),
      });
    } else {
      meta.push({
        hid: 'description',
        name: 'description',
        content: this.$t('TokenSale.head.description'),
      });
      meta.push({
        hid: 'og_description',
        property: 'og:description',
        content: this.$t('TokenSale.head.description'),
      });
    }
    return {
      meta,
    };
  },
  computed: {
    isPreSale() {
      return (new Date() < SALE_DATE_ANNOUNCE_DATE);
    },
    isICOStarted() {
      return (new Date() >= SALE_DATE);
    },
  },
  methods: {
    async updateTokenSaleProgress() {
      const amount = await EthHelper.queryEthBalance(LIKE_COIN_ICO_ADDRESS);
      this.currentTokenSaleAmount = new BigNumber(amount).dividedBy(ONE_LIKE)
        .plus(INITIAL_TOKENSALE_ETH);
    },
  },
  mounted() {
    this.updateTokenSaleProgress();
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.referral-page {
  ul {
    padding: 0;

    list-style-type: none;
  }

  li {
    display: inline-block;

    margin: 0 10px;
  }
}

.tokensale-progress-wrapper {
  padding-right: 0;
  padding-left: 0;

  @media (max-width: 600px) {
    overflow: hidden;
  }

  > div {
    margin-right: -8px;
    margin-left: -8px;
  }
}

.tokensale-amount {
  text-align: center;

  font-weight: 300;

  .current {
    color: $like-green;

    font-size: 46px;
    line-height: 62px;
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

          margin-top: 0;

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
</style>

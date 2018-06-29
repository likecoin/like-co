<template>
  <div class="tokensale-dashboard">

    <div class="lc-container-2-extend">
      <div class="lc-container-3-extend-bg" />
      <div class="lc-container-3">
        <div class="lc-padding-top-32 lc-padding-bottom-16">

          <section class="countdown-section lc-text-align-center">
            <h1 class="lc-font-size-42 lc-font-weight-600 lc-mobile">
              {{ $t('TokenSale.title') }}
              <span class="lc-font-weight-300 lc-color-like-green">
                {{ $t('Home.Sale.title.isOver') }}
              </span>
            </h1>
            <h2
              class="completed-percentage
              lc-font-weight-600
              lc-color-like-green
              lc-padding-top-24
              lc-padding-bottom-16
              lc-mobile"
            >
              {{ $t('Home.Sale.label.completedPercent', { percent: tokenSalePercentage }) }}
            </h2>
          </section>

        </div>
      </div>
    </div>

    <div class="lc-container-2">

      <div class="tokensale-progress-wrapper lc-container-3 lc-bg-gray-1 lc-padding-vertical-16">
        <tokensale-progress
          :total="maxTokenSaleAmount"
        />

        <div class="lc-container-4">
          <div class="tokensale-amount lc-padding-top-12 lc-text-align-center">
            <span class="lc-color-like-green lc-font-size-18 lc-font-weight-600">
              {{ $t('TokenSale.label.raised') }}:
            </span>
            <br class="lc-mobile-show">
            <span class="amount">
              <span class="current lc-color-like-green lc-font-size-46 lc-font-weight-300">
                {{ tokenSaleAmount }}
              </span>
              <span class="max lc-font-size-20 lc-font-weight-400">
                / {{ maxTokenSaleAmount }} ETH
              </span>
            </span>
          </div>
        </div>
      </div>

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

import TokenSaleProgress from '~/components/TokenSaleProgress';

import {
  FINAL_TOKENSALE_ETH_VALUE,
  FINAL_TOKENSALE_PERCENTAGE,
} from '@/constant';

export default {
  name: 'tokensale-dashboard',
  components: {
    'tokensale-progress': TokenSaleProgress,
  },
  data() {
    return {
      tokenSaleAmount: FINAL_TOKENSALE_ETH_VALUE,
      tokenSalePercentage: FINAL_TOKENSALE_PERCENTAGE,
      maxTokenSaleAmount: new BigNumber('12600').toFixed(2),
    };
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

          > span {
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

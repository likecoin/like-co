<template>
  <section class="cta-section">
    <div class="lc-container-1">

      <div class="lc-container-2">
        <div class="underlay gradient" />
        <div class="lc-container-3">
          <div class="lc-container-4">

            <!-- BEGIN - Before announcing token sale date -->
            <div
              v-if="now.isBefore(SALE_DATE_ANNOUNCE_DATE)"
              class="cta-section-body">

              <div class="cta-section-body-content">
                <h1>{{ $t('Home.Sale.title.earlyBirdTokenSale') }}</h1>
                <h2>{{ $t('Home.Sale.title.secure25Percent') }}</h2>
              </div>

              <div class="cta-section-body-cta-btn">
                <span :class="['tooltip', { disabled: !isCTAButtonDisabled }]">
                  {{ $t('Home.Sale.label.contactUsThroughButton') }}
                </span>
                <material-button
                  class="cta-btn"
                  :disabled="isCTAButtonDisabled"
                  @click=onClickCTAButton>
                  {{ $t('Home.Sale.button.joinTokenSale') }}
                </material-button>
              </div>

            </div>
            <!-- END - Before announcing token sale date -->

            <!-- BEGIN - After announcing token sale date -->
            <div
              v-else-if="now.isBefore(SALE_DATE)"
              class="cta-section-body">

              <div class="cta-section-body-content">
                <h1>{{ $t('Home.Sale.title.publicTokenSale') }}</h1>
                <h6>{{ $t('Home.Sale.label.startOn') }}</h6>
                <div class="token-sale-timer-wrapper">
                  <countdown-timer
                    class="cta-section-token-sale-timer"
                    :date="SALE_DATE_ANNOUNCE_DATE"
                  />
                </div>
              </div>

              <div class="cta-section-body-cta-btn">
                <material-button
                  class="cta-btn"
                  :disabled="isCTAButtonDisabled"
                  @click=onClickCTAButton>
                  {{ $t('Home.Sale.button.joinTokenSale') }}
                </material-button>
              </div>

            </div>
            <!-- END - After announcing token sale date -->

            <!-- BEGIN - After token sale begins -->
            <div v-else class="cta-section-body">

              <div
                class="cta-section-body-content">
                <h1>{{ $t('Home.Sale.title.publicTokenSale') }} <span class="now-live">{{ $t('Home.Sale.title.nowLive') }}</span></h1>
                <h2 class="completed-percentage">
                  {{ $t('Home.Sale.label.completedPercent', { percent: tokenSalePercentage }) }}
                </h2>
                <div class="token-sale-progress-wrapper">
                  <tokensale-progress class="cta-section-token-sale-progress" />
                </div>
              </div>

              <div class="cta-section-body-cta-btn">
                <material-button
                  class="cta-btn"
                  :disabled="isCTAButtonDisabled"
                  @click=onClickCTAButton>
                  {{ $t('Home.Sale.button.joinNow') }}
                </material-button>
              </div>

            </div>
            <!-- END - After token sale begins -->

          </div>
        </div>
      </div>

      <div class="lc-container-2">
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
import moment from 'moment';

import { logTrackerEvent } from '@/util/EventLogger';
import CountdownTimer from '~/components/CountdownTimer';
import MaterialButton from '~/components/MaterialButton';
import TokenSaleProgress from '~/components/TokenSaleProgress';
import {
  SALE_DATE_ANNOUNCE_DATE,
  SALE_DATE,
} from '@/constant';

export default {
  name: 'cta-section',
  components: {
    CountdownTimer,
    MaterialButton,
    'tokensale-progress': TokenSaleProgress,
  },
  data() {
    return {
      isCTAButtonDisabled: false,
      tokenSalePercentage: 128,
      now: moment(),
      SALE_DATE,
      SALE_DATE_ANNOUNCE_DATE,
    };
  },
  methods: {
    onClickCTAButton() {
      this.isCTAButtonDisabled = true;
      this.ctaBtnDisabledTimer = setTimeout(() => {
        this.isCTAButtonDisabled = false;
      }, 10000);

      logTrackerEvent(this, 'RegFlow', 'ClickedIAmInterestedButton', 'User is interested in early bird token sale', 1);
      this.$router.push({ name: 'in-tokensale' });
    },
  },
  beforeDestory() {
    if (this.ctaBtnDisabledTimer) {
      clearTimeout(this.ctaBtnDisabledTimer);
      this.ctaBtnDisabledTimer = undefined;
    }
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/index";

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
      color: #28646e;

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
      color: #28646E;

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

    color: #737373;

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

.cta-section-body-cta-btn {
  position: relative;

  display: flex;
  align-items: center;
  flex: 1;

  .tooltip {
    position: absolute;
    right: 0;
    bottom: 100%;
    left: 0;

    margin-bottom: 8px;

    transition: all .25s ease-in;
    text-align: center;

    color: #28646E;

    font-size: 14px;

    &.disabled {
      transform: translateY(100%);
      pointer-events: none;

      opacity: 0 !important;
    }

    @media (max-width: 600px) {
      margin-bottom: 4px;

      color: $like-gray-3;

      font-size: 12px;
    }
  }

  .cta-btn {
    min-width: 256px;

    background-image: linear-gradient(73deg, #3c286e, #6e2828);

    &[disabled] {
      color: $like-gray-4;
      background: $like-gray-5;
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

          color: #28646E;

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
  margin-right: -64px;

  @media (max-width: 600px) {
    margin-right: 0;
  }
}
</style>

<style lang="scss">
@import "~assets/index";

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

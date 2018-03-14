<template>
  <section class="cta-section">
    <div class="lc-container-1">

      <div class="lc-container-2">
        <div class="underlay gradient" />
        <div class="lc-container-3">
          <div class="lc-container-4">

            <div class="cta-section-body">
              <div class="cta-section-body-content">
                <h1>{{ $t('Home.Sale.title') }}</h1>
                <h2>{{ $t('Home.Sale.subtitle1') }}</h2>
                <h3>{{ $t('Home.Sale.subtitle2') }}</h3>
              </div>

              <div class="cta-section-body-cta-btn">
                <span :class="`tooltip${isCTAButtonDisabled ? '' : ' disabled'}`">
                  {{ $t('Home.Sale.buttonTooltip') }}
                </span>
                <material-button
                  class="cta-btn"
                  :disabled="isCTAButtonDisabled"
                  @click=onClickCTAButton>
                  {{ $t('Home.Sale.button.imInterested') }}
                </material-button>
              </div>
            </div>

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
                    <nuxt-link :to="{ name: 'whitepaper' }">
                      {{ $t('Home.Sale.button.onePage') }}
                    </nuxt-link>
                  </li>
                  <li>
                    <nuxt-link :to="{ name: 'whitepaper' }">
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
import { logTrackerEvent } from '@/util/EventLogger';
import MaterialButton from '~/components/MaterialButton';

export default {
  name: 'cta-section',
  components: {
    MaterialButton,
  },
  data() {
    return {
      isCTAButtonDisabled: false,
    };
  },
  methods: {
    onClickCTAButton() {
      this.isCTAButtonDisabled = true;
      this.ctaBtnDisabledTimer = setTimeout(() => {
        this.isCTAButtonDisabled = false;
      }, 10000);

      logTrackerEvent(this, 'RegFlow', 'Clicked I am interested button', 'User is interested in early bird token sale', 1);
      if (this.$intercom) this.$intercom.show();
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
    text-align: center;
  }

  h1 {
    font-size: 38px;
    font-weight: 600;

    @media (max-width: 600px) {
      color: $like-white;

      font-size: 26px;
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

      opacity: 0;
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
      }

      > li {
        padding: 20px;

        a {
          text-decoration: underline;

          color: #28646E;

          font-size: 20px;
        }
      }
    }
  }
}
</style>

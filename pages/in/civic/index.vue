<template>
  <div
    :class="[
      'civic-page',
      {
        'civic-page--registered': isCivicLiker,
      }
    ]"
  >
    <header class="lc-container-1 lc-margin-top-48">
      <div class="lc-container-2">
        <div class="lc-container-3">
          <h1 class="lc-font-size-32 lc-font-weight-300">
            {{ $t('CivicPage.title') }}
          </h1>
        </div>
      </div>
    </header>

    <section class="civic-page__cta lc-margin-top-24 lc-container-1 lc-container-no-padding-mobile">
      <div class="lc-container-2">
        <div class="hero-image lc-text-align-center">
          <img :src="HeroImage">
        </div>

        <div
          :class="[
            'lc-padding-top-40 lc-padding-bottom-24',
            'lc-bg-like-gradient lc-text-align-center'
          ]"
        >
          <div class="lc-container-3">
            <div class="lc-container-4">

              <h2 class="lc-font-size-32 lc-font-weight-300">
                {{ $t('CivicPage.slogan') }}
              </h2>

              <h3
                v-if="isPreRegPeriod"
                :class="[
                  'lc-margin-top-24 lc-font-size-16 lc-font-weight-500 lc-color-light-burgundy',
                ]"
              >
                {{ $t('CivicLikerTrial.subtitle') }}
              </h3>

              <div
                v-if="isPreRegPeriod || isStarted"
                class="lc-button-group lc-margin-top-32"
              >
                <md-button
                  class="md-likecoin lc-gradient-2 lc-font-size-20 lc-font-weight-600 shadow"
                  @click="scrollToPricing"
                >{{ buttonTitle }}</md-button>
              </div>
              <span
                v-if="isStarted && buttonFootnote"
                class="lc-margin-top-12 lc-color-light-burgundy lc-font-size-12 lc-font-weight-500"
              >
                {{ buttonFootnote }}
              </span>

            </div>
            <lc-chop-countdown
              v-if="!isStarted"
              :date="civicLikerStartDate"
              class="lc-mobile-hide"
              size="136"
              rotate-z="14"
            />
          </div>
        </div>
      </div>
    </section>

    <section
      :class="[
        'civic-page__intro lc-container-1',
        'lc-color-like-gray-5 lc-font-size-16 lc-font-weight-600',
      ]"
    >
      <div class="lc-container-2">
        <div class="lc-container-3">
          <div class="lc-container-4">
            <p
              v-for="i in 3"
              :key="i"
            >{{ $t(`CivicPage.intro1[${i - 1}]`) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Wait for design
    <section class="civic-page__feature-list lc-padding-vertical-48 lc-bg-gray-1">
      <div class="lc-container-1">
        <div class="lc-container-2">
          <div class="lc-container-3">
            <div class="lc-container-4">
              <ul>
                <li
                  v-for="i in FEATURE_COUNT"
                  :key="i"
                >
                  <lc-chop-civic-liker-rect
                    :date="civicLikerStartDate"
                    size="156"
                    rotate-z="12"
                    is-trial
                  />
                  <p>{{ $t(`CivicPage.features[${i - 1}]`) }}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
    -->

    <section class="civic-page__intro-2 lc-container-1">
      <div class="lc-container-2">
        <div class="lc-container-3 lc-padding-top-24">

          <div
            v-for="i in 2"
            :key="i"
            class="lc-container-4"
          >
            <h2 class="lc-font-size-28 lc-font-weight-300">
              {{ $t(`CivicPage.intro2[${i - 1}].title`) }}
            </h2>
            <p class="lc-font-size-16 lc-margin-top-32 lc-color-like-gray-5">
              {{ $t(`CivicPage.intro2[${i - 1}].p`) }}
            </p>
          </div>

          <!-- <div
            v-if="isPreRegPeriod || isStarted"
            class="lc-container-4 lc-button-group lc-margin-top-64"
          >
            <span class="button-wrapper">
              <lc-chop-civic-liker
                :is-beta="isStarted"
                rotate-z="18"
                is-trial
              />
              <md-button
                class="md-likecoin lc-gradient-2 lc-font-size-20 lc-font-weight-600 shadow"
                @click="scrollToPricing"
              >
                {{ buttonTitle }}
              </md-button>
            </span>
            <br>
            <span
              v-if="buttonFootnote"
              class="lc-margin-top-12 lc-color-light-burgundy lc-font-size-12 lc-font-weight-500"
            >
              {{ buttonFootnote }}
            </span>
          </div> -->

        </div>
      </div>
    </section>

    <div class="lc-padding-top-16 lc-bg-gray-1" />

    <section
      v-if="!isStarted"
      class="civic-page__countdown lc-padding-top-24 lc-padding-bottom-32"
    >
      <div class="lc-container-1 ">
        <div class="lc-container-2">
          <div class="lc-container-3">
            <div class="lc-container-4">
              <h2
                class="lc-font-size-32 lc-color-like-green lc-font-weight-500 lc-text-align-center"
              >
                {{ $t('CivicPage.countdown.title') }}
              </h2>

              <countdown-timer
                :date="civicLikerStartDate"
                class="lc-margin-top-16"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      id="pricing"
      ref="pricing"
      class="civic-page__pricing lc-bg-like-gradient"
    >
      <div class="lc-container-1">
        <div class="lc-container-2">
          <div class="lc-container-3">
            <div class="lc-container-4">

              <ul class="pricing-table">
                <li
                  v-for="p in pricing"
                  :key="p.type"
                >
                  <div
                    :class="[
                      'pricing-table__col',
                      `pricing-table__col--${p.type}`,
                    ]"
                  >
                    <header class="pricing-table__col__header">
                      <div class="pricing-table__col__header__type">
                        {{ $t(`CivicPage.pricing.type.${p.type}`) }}
                      </div>
                      <div>
                        <span class="pricing-table__col__header__price">{{ p.price }}</span>
                        <span
                          class="pricing-table__col__header__payment-cycle"
                        >{{ $t(`CivicPage.pricing.paymentCycle.${p.paymentCycle}`) }}</span>
                      </div>
                      <template v-if="p.type === 'civicLiker' && (isPreRegPeriod || isStarted)">
                        <div
                          class="lc-font-size-14"
                          style="color: #d0021b"
                        >{{ pricingHighlightTitle }}</div>
                        <lc-chop-civic-liker
                          :is-beta="isStarted"
                          rotate-z="12"
                          is-trial
                        />
                      </template>
                    </header>

                    <ul class="pricing-table__col__feature-list">
                      <li
                        v-for="f in p.features"
                        :key="f[0]"
                        :class="[
                          'pricing-table__col__feature-list__item',
                          {
                            'pricing-table__col__feature-list__item--disabled': !f[1],
                          }
                        ]"
                      >
                        <simple-svg
                          :filepath="TickIcon"
                          class="pricing-table__col__feature-list__item__bullet"
                          width="20px"
                          height="20px"
                          fill="currentColor"
                          stroke="transparent"
                        />
                        <div>
                          {{ $t(`CivicPage.pricing.features.${f[0]}`) }}
                        </div>
                      </li>
                    </ul>

                    <footer
                      v-if="p.type === 'civicLiker' && (isPreRegPeriod || isStarted)"
                      class="pricing-table__col__footer"
                    >
                      <div class="lc-button-group">
                        <md-button
                          class="md-likecoin lc-font-size-16 lc-font-weight-600"
                          @click="onClickButton"
                        >
                          {{ pricingButtonTitle }}
                        </md-button>
                        <div
                          class="lc-font-size-12 lc-color-light-burgundy"
                        >{{ buttonFootnote }}</div>
                      </div>
                    </footer>
                  </div>
                </li>
              </ul>

            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="civic-page__footnote lc-padding-top-24">
      <div class="lc-container-1">
        <div class="lc-container-2">
          <div class="lc-container-3">
            <div class="lc-container-4">
              <ul>
                <li>{{ $t('CivicPage.footnote[0]') }}</li>
              </ul>
              <p class="lc-margin-top-16">
                {{ $t('CivicPage.credit.photo') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import {
  PRE_REG_CIVIC_LIKER_END_DATE,
  CIVIC_LIKER_START_DATE,
  CIVIC_LIKER_TRIAL_END_DATE,
} from '~/constant';

import CountdownTimer from '~/components/CountdownTimer';
import HeroImage from '~/assets/civic/hero.png';
import TickIcon from '~/assets/icons/fillable/tick.svg';

export default {
  components: {
    CountdownTimer,
  },
  data() {
    return {
      HeroImage,
      TickIcon,

      FEATURE_COUNT: 3,

      civicLikerStartDate: new Date(CIVIC_LIKER_START_DATE),

      isPreRegPeriod: Date.now() < PRE_REG_CIVIC_LIKER_END_DATE,
      isStarted: Date.now() >= CIVIC_LIKER_START_DATE,

      pricing: [
        {
          type: 'generalLiker',
          price: 'USD0.00',
          paymentCycle: 'perMonth',
          features: [
            ['ICRpool', true],
            ['ownRewardPool', false],
            ['communityVoting', false],
            ['bonusContent', false],
            ['idolNewsletter', false],
            ['offlineEvent', false],
            ['report', false],
            ['badges', false],
          ],
        },
        {
          type: 'civicLiker',
          price: 'USD5.00',
          paymentCycle: 'perMonth',
          features: [
            ['ICRpool', true],
            ['ownRewardPool', true],
            ['communityVoting', true],
            ['bonusContent', true],
            ['idolNewsletter', true],
            ['offlineEvent', true],
            ['report', true],
            ['badges', true],
          ],
        },
      ],
    };
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
    ]),
    hasPreRegCivicLiker() {
      return (
        this.getUserInfo.hasPreRegCivicLiker
        || this.getUserInfo.preRegCivicLikerStatus === 'waiting'
      );
    },
    isCivicLiker() {
      return this.getUserInfo.isSubscribedCivicLiker;
    },
    isCivicLikerTrial() {
      return (
        !this.isCivicLiker
        && this.isStarted
        && this.getUserInfo.isPreRegCivicLiker
        && Date.now() <= CIVIC_LIKER_TRIAL_END_DATE
      );
    },
    buttonTitle() {
      if (this.isCivicLiker) {
        return this.$t('CivicPage.registered');
      }
      if (this.isCivicLikerTrial) {
        return this.$t('CivicLikerBeta.upgrade');
      }
      if (this.hasPreRegCivicLiker) {
        return this.$t('CivicLikerTrial.registered');
      }
      return this.$t('CivicPage.register');
    },
    buttonFootnote() {
      if (this.isPreRegPeriod) {
        return this.$t('CivicLikerTrial.willBeHeld');
      }
      if (this.isStarted) {
        return this.$t('CivicPage.limitedQuota');
      }
      return '';
    },
    pricingHighlightTitle() {
      if (this.isPreRegPeriod) {
        return this.$t('CivicLikerTrial.onGoing');
      }
      if (this.isStarted) {
        return this.$t('CivicPage.onGoing');
      }
      return '';
    },
    pricingButtonTitle() {
      if (this.isCivicLiker) {
        return this.$t('CivicPage.registered');
      }
      if (this.isCivicLikerTrial) {
        return this.$t('CivicLikerBeta.upgrade');
      }
      if (this.hasPreRegCivicLiker) {
        return this.$t('CivicLikerTrial.registered');
      }
      return this.$t('CivicPage.pricingRegister');
    },
    pricingButtonFoonote() {
      if (this.isStarted) {
        return this.$t('CivicPage.limitedQuota');
      }
      return this.$t('CivicLikerTrial.registered');
    },
  },
  head() {
    return {
      title: this.$t('CivicPage.title'),
      meta: [
        {
          hid: 'og_title',
          property: 'og:title',
          content: this.$t('CivicPage.title'),
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('CivicPage.slogan'),
        },
        {
          hid: 'og_description',
          property: 'og:description',
          content: this.$t('CivicPage.slogan'),
        },
        {
          hid: 'og_image',
          property: 'og:image',
          content: 'https://like.co/images/og/civic.png',
        },
      ],
    };
  },
  mounted() {
    if (this.isPreRegPeriod) {
      this.preRegTimer = setTimeout(() => {
        this.isPreRegPeriod = false;
      }, PRE_REG_CIVIC_LIKER_END_DATE - Date.now());
    }
    if (!this.isStarted) {
      this.countdownTimer = setTimeout(() => {
        this.isStarted = true;
      }, CIVIC_LIKER_START_DATE - Date.now());
    }
  },
  beforeDestroy() {
    if (this.preRegTimer) clearTimeout(this.preRegTimer);
    if (this.countdownTimer) clearTimeout(this.countdownTimer);
  },
  methods: {
    scrollToPricing() {
      if (this.$refs.pricing) {
        this.$refs.pricing.scrollIntoView({ behavior: 'smooth' });
      }
    },
    onClickButton() {
      if (this.isCivicLiker) return;

      this.$router.push({ name: `in-civic-${this.isStarted ? 'register' : 'trial'}` });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

.hero-image {
  position: relative;
  z-index: 1;

  margin-bottom: -24px;
}

.civic-page {
  h1 {
    @media screen and (min-width: 600px + 1px) {
      padding: 0 56px;
    }
  }

  &__cta {
    position: relative;

    .lc-chop-countdown {
      position: absolute;
      right: -16px;
      bottom: -48px;
    }
  }

  &__intro,
  &__intro-2 {
    .lc-container-4 {
      padding: 24px 100px 48px;

      @media screen and (max-width: 768px) {
        padding: {
          right: 24px;
          left: 24px;
        }
      }
    }
  }

  &__intro {
    p {
      &:not(:first-child) {
        margin-top: 24px;
      }
    }
  }

  &__intro-2 {
    .button-wrapper {
      position: relative;
    }

    .lc-chop-civic-liker {
      position: absolute;
      right: calc(100% - 64px);
      bottom: calc(100% - 36px);
    }
  }

  &__feature-list {
    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;

      margin: 0;
      padding: 0;

      list-style: none;

      li {
        width: calc(100% / 3);
        padding: 24px;

        text-align: center;

        @media screen and (max-width: 768px) {
          width: 100%;
        }

        p {
          margin-top: 16px;

          color: $like-green;

          font-size: 24px;
          font-weight: 500;
        }
      }
    }
  }

  &__countdown {
    .lc-countdown-timer {
      max-width: 480px;
      margin: 0 auto;
    }
  }

  &__footnote {
    color: $gray-9b;

    font-size: 12px;

    ul {
      margin: 0;
      padding: 0;

      list-style: none;

      li {
        &::before {
          display: inline;

          content: '*';
          vertical-align: super;

          font-size: 10px;
        }
      }
    }
  }

  .md-button {
    min-width: 200px;
  }

  &--registered {
    &#{&} .md-button {
      pointer-events: none;

      color: #40bfa5;
      border: 4px solid currentColor;
      background-color: transparent;
      background-image: none;
      box-shadow: none;
    }
  }
}

.pricing-table {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  margin: 0;
  padding: 8px;

  list-style: none;

  > li {
    padding: 8px;
  }

  &__col {
    min-width: 272px;
    padding: 16px;

    border-radius: 8px;
    background: white;

    &__header {
      position: relative;

      min-height: 96px;

      border-bottom: solid 1px $like-gray-3;

      &__type {
        margin: 8px 0;

        color: $like-gray-5;

        font-size: 14px;

        .pricing-table__col--civicLiker & {
          color: $like-green;
        }
      }

      &__price {
        color: $like-gray-5;

        font-size: 28px;
        font-weight: 600;
      }

      &__payment-cycle {
        color: $gray-9b;

        font-size: 12px;
      }

      .lc-chop-civic-liker {
        position: absolute;
        right: -48px;
        bottom: -36px;
      }
    }

    &__feature-list {
      margin: 0;
      padding: 24px 0;

      list-style: none;

      &__item {
        display: flex;

        color: $like-gray-5;

        font-size: 14px;

        &:not(:first-child) {
          margin-top: 12px;
        }

        &--disabled {
          color: $gray-e6;
        }

        &__bullet {
          flex-grow: 0;
          flex-shrink: 1;

          margin-right: 8px;

          .pricing-table__col--civicLiker & {
            color: #40bfa5;
          }
        }
      }
    }

    &__footer {
      padding: 0;

      border: none;
    }
  }
}
</style>

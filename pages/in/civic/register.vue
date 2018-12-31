<template>
  <div class="civic-liker-register-page">
    <div class="lc-container-0 lc-narrow">

      <section class="lc-container-1 lc-section-block">

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 lc-text-align-center">

              <lc-chop-civic-liker
                class="civic-liker-beta-logo"
                size="180"
                rotate-z="-12"
                is-beta
              />

            </div>
          </div>
        </div>

        <div class="lc-container-2-extend">
          <div class="lc-container-3-extend-bg" />
          <div class="lc-container-3 lc-padding-top-48 lc-padding-bottom-32 lc-text-align-center">

            <h1 class="lc-font-size-32 lc-font-weight-600 lc-mobile">
              {{ $t('CivicLikerTrial.thankYouForYourInterest') }}
              <br>
              <span class="lc-font-size-46 lc-font-weight-300 lc-mobile">
                {{ $t('CivicLikerBeta.title') }}
              </span>
            </h1>

          </div>
        </div>

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 lc-padding-vertical-32">

              <template v-if="isCSOnline">
                <div
                  :class="[
                    'lc-margin-bottom-16',
                    'lc-color-civic-green lc-font-size-32 lc-font-weight-600 lc-text-align-center',
                  ]"
                >
                  {{ $t('CivicLikerBeta.applying') }}
                </div>

                <div class="applying-notice">
                  <img :src="ChatIcon">
                  <span>{{ $t('CivicLikerBeta.description') }}</span>
                </div>

                <div class="lc-text-align-center lc-margin-vertical-16">
                  <lc-loading-indicator class="lc-color-civic-green lc-font-size-18" />
                </div>

                <div class="pricing-item lc-margin-top-24">
                  <div class="pricing-item__type">
                    {{ $t(`CivicPage.pricing.type.civicLiker`) }}
                  </div>
                  <div>
                    <span class="pricing-item__price">USD5.00</span>
                    <span
                      class="pricing-item__payment-cycle"
                    >{{ $t(`CivicPage.pricing.paymentCycle.perMonth`) }}</span>
                  </div>
                  <div
                    class="lc-font-size-14"
                    style="color: #d0021b"
                  >{{ $t('CivicPage.onGoing') }}</div>
                </div>
              </template>

              <template v-else>
                <div class="countdown-clock">
                  <clock />
                </div>

                <div
                  :class="[
                    'lc-margin-bottom-16',
                    'lc-color-civic-yellow lc-font-size-32 lc-font-weight-600 lc-text-align-center',
                  ]"
                >
                  {{ $t('CivicPage.waitingList.title') }}
                </div>

                <p class="lc-text-align-center lc-margin-bottom-32">
                  {{ $t('CivicLikerBeta.waitingList.sorry') }}
                  <template v-if="!getUserInfo.email">
                    {{ $t('CivicPage.waitingList.ensureEmail') }}
                  </template>
                  {{ $t('CivicPage.waitingList.notifyByEmail') }}
                </p>
                <div class="lc-button-group lc-margin-top-16">
                  <md-button
                    class="md-likecoin lc-font-size-16 lc-font-weight-600"
                    @click="$router.push({ name: 'in' })"
                  >
                    {{ $t('General.button.ok') }}
                  </md-button>
                </div>
              </template>

            </div>
          </div>
        </div>

      </section>

    </div>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

import { CIVIC_LIKER_START_DATE } from '~/constant';
import ChatIcon from '~/assets/icons/chat.svg';

import { apiGetCivicCSOnline } from '~/util/api/api';

import Clock from '~/components/Mission/Clock';

export default {
  layout: 'narrowWithHeader',
  components: {
    Clock,
  },
  async asyncData({ redirect, store }) {
    if (
      Date.now() < CIVIC_LIKER_START_DATE
      || store.getters.getUserInfo.isSubscribedCivicLiker
    ) {
      redirect({ name: 'in-civic' });
    }

    const res = await apiGetCivicCSOnline();
    const { isCSOnline } = res.data;
    return {
      isCSOnline,
    };
  },
  data() {
    return {
      ChatIcon,

      civicLikerStartDate: new Date(CIVIC_LIKER_START_DATE),
    };
  },
  middleware: 'authenticated',
  computed: {
    ...mapGetters([
      'getUserInfo',
    ]),
  },
  head() {
    return {
      title: this.$t('CivicLikerBeta.title'),
      meta: [
        {
          hid: 'og_title',
          property: 'og:title',
          content: this.$t('CivicLikerBeta.title'),
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('CivicPage.CTA.title'),
        },
        {
          hid: 'og_description',
          property: 'og:description',
          content: this.$t('CivicPage.CTA.title'),
        },
        {
          hid: 'og_image',
          property: 'og:image',
          content: 'https://like.co/images/og/civic.png',
        },
      ],
    };
  },
  async mounted() {
    const queryString = Object.keys(this.$route.query)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(this.$route.query[key])}`)
      .join('&');
    if (this.$intercom && this.isCSOnline) {
      await this.dequeueCivicLiker({ id: this.getUserInfo.user, queryString });
      this.$intercom.trackEvent('likecoin-store_civicLikerRegister');
      this.$intercom.update({ isOnCivicLikerWaitingList: false });
      this.$intercom.show();
    } else {
      await this.queueCivicLiker({ id: this.getUserInfo.user, queryString });
      if (this.$intercom) {
        this.$intercom.update({ isOnCivicLikerWaitingList: true });
      }
    }
  },
  methods: {
    ...mapActions([
      'queueCivicLiker',
    ]),
    onClickOk() {
      this.$router.push({ name: 'in' });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

.civic-liker-beta-logo {
  position: relative;
  z-index: 2;

  margin-bottom: -32px;
}

.countdown-clock {
  display: block;

  width: 52px;
  height: 52px;
  margin: 0 auto 24px;
  padding: 7px;

  border: 2px solid $like-green;

  border-radius: 50%;
}

.applying-notice {
  display: flex;

  > img {
    flex-grow: 0;

    width: 42px;
    height: 36px;
    margin-right: 16px;
  }
}

.pricing-item {
  min-height: 96px;
  padding: 24px;

  border-radius: 8px;
  background: white;

  &__type {
    margin-bottom: 8px;

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
</style>

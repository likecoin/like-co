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

              <div
                :class="[
                  'lc-margin-bottom-16',
                  'lc-color-like-green lc-font-size-24 lc-font-weight-600',
                ]"
              >
                {{ $t('CivicLikerBeta.joinOice') }}
              </div>

              <div class="pricing-item lc-margin-top-24">
                <div class="pricing-item-content">
                  <div class="pricing-item__type">
                    {{ $t(`CivicPage.pricing.type.civicLiker`) }}
                  </div>
                  <div>
                    <span class="pricing-item__price">USD5.00</span>
                    <span
                      class="pricing-item__payment-cycle"
                    >{{ $t(`CivicPage.pricing.paymentCycle.perMonth`) }}</span>
                  </div>
                </div>
                <div class="pricing-item__image">
                  <img :src="OiceBackerPage">
                </div>
              </div>

              <div class="lc-button-group lc-margin-top-24">
                <md-button
                  :href="applyURL"
                  class="md-likecoin"
                  rel="noopener noreferrer"
                  target="_blank"
                  @click="onClickApplyButton"
                >
                  {{ $t('CivicLikerBeta.applyNow') }}
                </md-button>
              </div>

            </div>
          </div>
        </div>

      </section>

    </div>
  </div>
</template>


<script>
import { mapGetters } from 'vuex';

import { apiGetCivicCSOnline } from '~/util/api/api';

import OiceBackerPage from '~/assets/civic/oice-backer-reg.png';
import { IS_TESTNET } from '~/constant';

export default {
  layout: 'narrowWithHeader',
  async asyncData({ redirect, store }) {
    const { isSubscribedCivicLiker, currentType } = store.getters.getUserInfo;
    if (isSubscribedCivicLiker && currentType !== 'trial') {
      redirect({ name: 'in-civic' });
      return {};
    }

    const res = await apiGetCivicCSOnline();
    const { isCSOnline } = res.data;
    return {
      isCSOnline,
    };
  },
  data() {
    return {
      OiceBackerPage,
    };
  },
  middleware: 'authenticated',
  computed: {
    ...mapGetters([
      'getUserInfo',
    ]),
    applyURL() {
      return `https://${IS_TESTNET ? 'oicetest.lakoo.com' : 'oice.com'}/profile?action=subscribe&referrer=${this.getUserInfo.user}`;
    },
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
  mounted() {
    if (this.$intercom && this.isCSOnline) {
      this.$intercom.trackEvent('likecoin-store_civicLikerRegister');
      this.$intercom.show();
    }
  },
  methods: {
    onClickApplyButton() {
      if (this.$intercom) {
        this.$intercom.update({ isOnCivicLikerWaitingList: true });
      }
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

.pricing-item {
  overflow: hidden;

  min-height: 96px;

  border-radius: 8px;

  &-content {
    padding: 16px 24px;

    background: white;
  }

  &__type {
    margin-bottom: 8px;

    color: $like-green;

    font-size: 14px;
    font-weight: 600;
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

  &__image {
    max-height: 212px;

    padding: 0 12px;

    text-align: center;

    border-top: solid 1px $like-gray-3;
    background: $gray-e6;

    > img {
      max-height: inherit;
    }
  }

  .lc-chop-civic-liker {
    position: absolute;
    right: -48px;
    bottom: -36px;
  }
}
</style>

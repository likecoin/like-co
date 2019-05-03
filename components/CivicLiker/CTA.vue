<template>
  <!-- CTA for Civic Liker Renewal -->
  <div
    v-if="canRenew"
    :class="rootClass"
  >
    <div>
      <div class="lc-text-align-center-mobile">
        <p class="lc-color-like-gray-4 lc-font-size-16">
          {{ $t('CivicLikerCTAForRenewal.content') }}
        </p>
        <p class="lc-color-like-green lc-margin-top-12 lc-font-weight-600">
          {{ $t('CivicLikerCTAForRenewal.till') }}
        </p>
        <CountdownTimer :date="new Date(getUserInfo.civicLikerRenewalPeriodLast)" />
      </div>
      <div class="civic-liker-cta__content">
        <div class="lc-button-group">
          <md-button
            class="md-likecoin lc-gradient-2 lc-font-size-20 lc-font-weight-600 shadow"
            @click="onClickRenewButton"
          >{{ buttonTitle }}</md-button>
          <div class="lc-margin-top-12">
            <nuxt-link
              class="lc-underline lc-font-size-12"
              :to="{ name: 'in-civic' }"
            >
              {{ $t('CivicPage.about') }}
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Normal CTA -->
  <div
    v-else
    :class="rootClass"
  >
    <div>
      <div
        v-if="isShowChop"
        class="civic-liker-cta__image"
      >
        <chop-art
          :is-registered="isCivicLiker || isCivicLikerTrial"
          :is-show-countdown="layout !== 'wide'"
        />
      </div>

      <div class="civic-liker-cta__content">
        <i18n
          :path="contentPath"
          class="lc-color-like-gray-4 lc-font-size-16"
          tag="p"
        >
          <nuxt-link
            :to="{ name: 'in-settings' }"
            class="lc-color-like-green lc-font-weight-500"
            place="here"
          >{{ $t('CivicLikerCTAForWaitingList.here') }}</nuxt-link>
        </i18n>
        <div class="lc-button-group">
          <md-button
            class="md-likecoin lc-gradient-2 lc-font-size-20 lc-font-weight-600 shadow"
            @click="onClick"
          >{{ buttonTitle }}</md-button>
          <div
            v-if="isOnWaitingList"
            class="lc-color-light-burgundy lc-font-size-12 lc-margin-top-12"
          >
            {{ $t('CivicPage.waitingList.notifyByEmail') }}
          </div>
        </div>
      </div>

    </div>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

import CountdownTimer from '@/components/CountdownTimer';
import ChopArt from './ChopArt';

export default {
  name: 'civic-liker-cta',
  components: {
    CountdownTimer,
    ChopArt,
  },
  props: {
    layout: {
      type: String,
      default: 'default',
    },
    isShowChop: {
      type: [Boolean, String],
      default: true,
    },
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getUserIsRegistered',
    ]),
    rootClass() {
      const { name } = this.$options;
      return [
        name,
        `${name}--${this.layout}`,
        {
          [`${name}--renewal`]: this.canRenew,
        },
      ];
    },
    isCivicLiker() {
      return this.getUserInfo.isSubscribedCivicLiker;
    },
    isCivicLikerTrial() {
      return this.getUserInfo.isCivicLikerTrial;
    },
    isOnWaitingList() {
      return (
        !(this.isCivicLiker || this.isCivicLikerTrial)
        && this.getUserInfo.civicLikerStatus === 'waiting'
      );
    },
    canRenew() {
      return this.getUserInfo.isCivicLikerRenewalPeriod;
    },
    contentPath() {
      if (this.isCivicLiker) {
        return 'CivicLikerCTAForPaid.content';
      }
      if (this.isOnWaitingList) {
        return 'CivicLikerCTAForWaitingList.content';
      }
      return 'CivicLikerCTA.content';
    },
    buttonTitle() {
      if (this.canRenew) {
        return this.$t('CivicLikerCTAForRenewal.buttonTitle');
      }
      if (this.isCivicLikerTrial) {
        return this.$t('CivicLikerCTAForTrial.buttonTitle');
      }
      if (this.isCivicLiker) {
        return this.$t('General.learnMore');
      }
      if (this.isOnWaitingList) {
        return this.$t('CivicLikerCTAForWaitingList.buttonTitle');
      }
      return this.$t('CivicPage.register');
    },
  },
  methods: {
    ...mapActions([
      'popupAuthDialogInPlace',
    ]),
    onClick() {
      // Use Civic CTA as register callout for new user
      if (!this.getUserIsRegistered) {
        this.popupAuthDialogInPlace({ route: { name: 'in-civic' } });
        return;
      }
      this.$router.push({ name: 'in-civic' });
    },
    onClickRenewButton() {
      this.$router.push({ name: 'in-civic' });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

.civic-liker-cta {
  overflow: hidden;

  > div {
    display: flex;
    align-items: center;

    max-width: 816px;
    margin: 0 auto;

    @media screen and (min-width: 600px + 1px) {
      min-height: 200px;
    }

    @media screen and (max-width: 600px) {
      flex-direction: column;
    }
  }

  &--wide {
    overflow: visible;

    > div {
      max-width: 100%;
    }
  }

  &__image {
    position: relative;

    display: flex;
    align-items: center;
    flex: 1;
    justify-content: flex-end;

    margin-bottom: -24px;

    text-align: right;

    @media screen and (min-width: 600px + 1px) and (max-width: 768px) {
      flex-grow: 0;

      width: 33%;
    }

    @media screen and (min-width: 600px + 1px) {
      margin-right: 12px;

      .civic-liker-cta--wide & {
        max-width: 224px;
        height: 0;
      }
    }

    @media screen and (max-width: 600px) {
      justify-content: center;
    }

    .chop-art {
      transform: scale(1.36);
      transform-origin: right center;
    }
  }

  &__content {
    position: relative;

    display: flex;
    flex: 1;
    flex-direction: column;

    @media screen and (min-width: 1024px) {
     .civic-liker-cta--wide & {
        align-items: center;
        flex: 1;
        flex-direction: row;
      }
    }

    @media screen and (max-width: 600px) {
      flex-direction: column-reverse;
    }

    > * {
      padding: 24px;

      @media screen and (max-width: 600px) {
        padding: 12px 24px;
      }

      &:not(:first-child) {
        padding-top: 0;
      }
    }

    .md-button {
      min-width: 256px;
      margin: 0;

      border-radius: 0;

      /deep/ .md-ripple {
        min-height: 48px;
      }
    }
  }

  &--renewal {
    .lc-countdown-timer {
      font-size: 32px;

      @media screen and (min-width: 1024px) {
        max-width: 338px;
      }
    }

    .civic-liker-cta__content {
      margin: 0;
    }

    > div {
      > div:first-child {
        @media screen and (min-width: 600px + 1px) {
          padding-right: 24px;
        }
      }

      @media screen and (max-width: 768px) {
        flex-direction: column;
      }
    }
  }
}
</style>

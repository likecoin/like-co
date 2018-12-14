<template>
  <div :class="['civic-liker-cta', `civic-liker-cta--${layout}`]">
    <div>

      <div class="civic-liker-cta__image">
        <pre-register-chop
          :is-registered="isPreRegistered"
          :is-show-countdown="layout !== 'wide'"
        />
      </div>
      <div class="civic-liker-cta__content">
        <i18n
          class="lc-color-like-gray-4 lc-font-size-16"
          path="CivicLikerCTA.content"
          tag="p"
        >
          <nuxt-link
            :to="{ name: 'in-civic' }"
            class="lc-color-like-green lc-font-weight-500"
            place="title"
          >
            {{ $t('CivicLikerCTA.title') }}
          </nuxt-link>
        </i18n>
        <div class="lc-button-group">
          <md-button
            class="md-likecoin lc-gradient-2 lc-font-size-20 lc-font-weight-600 shadow"
            @click="onClick"
          >{{ buttonTitle }}</md-button>
        </div>
      </div>

    </div>
  </div>
</template>


<script>
import { mapGetters } from 'vuex';
import PreRegisterChop from './PreRegisterChop';

export default {
  name: 'civic-liker-cta',
  components: {
    PreRegisterChop,
  },
  props: {
    layout: {
      type: String,
      default: 'default',
    },
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
    ]),
    isPreRegistered() {
      return this.getUserInfo.isPreRegCivicLiker;
    },
    buttonTitle() {
      if (this.isPreRegistered) {
        return this.$t('General.learnMore');
      }
      return this.$t('CivicLikerCTA.buttonTitle');
    },
  },
  methods: {
    onClick() {
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
    min-height: 200px;
    margin: 0 auto;

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

    text-align: right;

    @media screen and (min-width: 600px + 1px) and (max-width: 768px) {
      flex-grow: 0;

      width: 33%;
    }

    @media screen and (min-width: 600px + 1px) {
      .civic-liker-cta--wide & {
        max-width: 224px;
        height: 0;
        margin-right: 12px;
      }
    }

    @media screen and (max-width: 600px) {
      justify-content: center;
    }

    .pre-register-chop {
      transform: scale(1.36);
      transform-origin: right center;

      @media screen and (max-width: 600px) {
        transform: scale(1.18);
        transform-origin: center top;
      }
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

    @media screen and (min-width: 600px + 1px) {
      margin: -12px;

      .civic-liker-cta:not(.civic-liker-cta--wide) & {
        padding: 24px;
      }
    }

    @media screen and (max-width: 600px) {
      flex-direction: column-reverse;
    }

    > * {
      padding: 12px;

      @media screen and (max-width: 600px) {
        padding: 12px 24px;
      }
    }

    .md-button {
      min-width: 256px;
      margin: 0;

      border-radius: 0;

      @media screen and (max-width: 600px) {
        margin-top: -12px;
      }

      :global(.md-ripple) {
        min-height: 48px;
      }
    }
  }
}
</style>

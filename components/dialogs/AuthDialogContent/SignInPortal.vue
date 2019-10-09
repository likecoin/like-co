<template>
  <div class="signin-portal">
    <header class="signin-portal__header base-dialog-v2__corner-block--top">
      <LikeToCoinGraph
        color="#50e3c2"
        bg-color="#29626B"
        :avatar="avatar"
        style="display:block;margin:0 auto"
      />
      <div class="signin-portal__header-headline">
        {{ getExperimentLocaleString(`${localeBasePath}.title`) }}
      </div>

      <button
        v-if="isShowCloseButton"
        class="signin-portal__close-button"
        @click="$emit('close')"
      >
        <simple-svg
          :filepath="CloseIcon"
          fill="white"
          stroke="transparent"
        />
      </button>
    </header>

    <div class="signin-portal__body base-dialog-v2__corner-block--bottom">
      <div class="signin-portal__body-text">
        {{ getExperimentLocaleString(`${localeBasePath}.description`) }}
      </div>

      <div class="signin-portal__platform-button-list">
        <button
          v-for="platform in platforms"
          :key="platform.id"
          class="signin-portal__platform-button"
          v-bind="platform.id === 'wallet' ? $testID('SignInWithWalletButton') : undefined"
          @click="onSignInWith(platform.id)"
        >
          <img
            class="signin-portal__platform-button-icon"
            :src="platform.icon"
          >
          <div class="signin-portal__platform-button-title">
            {{ $t(`${localeBasePath}.auth.${platform.id}`) }}
          </div>
        </button>
      </div>

      <div class="signin-portal__body-text">
        <i18n
          tag="div"
          :path="getExperimentLocalePath(`${localeBasePath}.toggle`)"
        >
          <a
            v-bind="$testID('ToggleSignInButton')"
            class="signin-portal__toggle-button"
            place="action"
            @click="$emit('toggle-sign-in')"
          >
            {{ $t(`${localeBasePath}.toggleButton`) }}
          </a>
        </i18n>
      </div>

    </div>
  </div>
</template>

<script>
import CloseIcon from '~/assets/icons/cross.svg';

import LikeToCoinGraph from '~/components/graph/LikeToCoin';

import { checkIsMobileClient } from '~/util/client';
// import experimentsMixin from '~/util/mixins/experiments';

const getAuthPlatformIcon = require.context('~/assets/icons/auth-platform/');

export default {
  name: 'signin-portal',
  components: {
    LikeToCoinGraph,
  },
  mixins: [
    // experimentsMixin(
    //   'shouldUseAltAsset',
    //   'signin-portal',
    //   'alternative',
    // ),
  ],
  props: {
    isSignIn: {
      type: Boolean,
      default: false,
    },
    isShowCloseButton: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      CloseIcon,
    };
  },
  computed: {
    localeBasePath() {
      return `AuthDialog.${this.isSignIn ? 'SignIn' : 'SignUp'}`;
    },
    platforms() {
      const ids = [
        'google',
        'facebook',
        'twitter',
        'matters',
        // 'email', // XXX: Disable for now
      ];

      if (!checkIsMobileClient() && this.isSignIn) {
        ids.push('wallet');
      }

      return ids.map(id => ({
        id,
        icon: getAuthPlatformIcon(`./${id}.svg`),
      }));
    },
  },
  methods: {
    getExperimentLocalePath(path) {
      if (this.shouldUseAltAsset && this.$te(`${path}-alternative`)) {
        return `${path}-alternative`;
      }
      return path;
    },
    getExperimentLocaleString(path) {
      return this.$t(this.getExperimentLocalePath(path));
    },
    onSignInWith(platform) {
      this.$emit('submit', platform);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/variables';

.signin-portal {
  &__header {
    position: relative;

    padding: 28px 40px 20px;

    color: $like-cyan;
    background-color: $like-green;

    // For extending header
    &::before {
      position: absolute;
      right: 0;
      bottom: 100%;
      left: 0;

      height: 300px;

      content: '';

      background-color: inherit;
    }

    &-like-icon {
      width: 44px;
      height: 44px;

      margin: 0 auto 20px;

      color: inherit;
    }

    &-headline {
      text-align: center;

      font-size: 24px;
      font-weight: 500;
      line-height: 1.2;
    }
  }

  &__close-button {
    position: absolute;
    top: 0;
    left: 0;

    width: 32px;
    height: 32px;
    margin-top: 16px;
    margin-left: 16px;

    cursor: pointer;
    transition: opacity 0.25 ease;

    border: none;
    background: transparent;

    &:hover {
      opacity: 0.75;
    }

    &:active {
      opacity: 0.50;
    }
  }

  &__body {
    padding: 0 40px;

    background: $like-gray-1;

    &-text {
      padding: 24px 0;

      text-align: center;

      color: #4a4a4a;

      font-size: 16px;

      a {
        text-decoration: underline;
      }
    }
  }

  &__platform-button {
    display: flex;
    align-items: center;

    width: 100%;
    min-height: 40px;
    padding: 6px 12px;

    cursor: pointer;
    transition: all 0.25s ease;

    color: $like-green;
    border: solid 1px $gray-e6;
    border-radius: 8px;
    background-color: white;

    box-shadow: 0 2px 2px 0 rgba(black, 0.1);

    font-family: inherit;
    font-size: 16px;

    &:hover {
      border-color: #50e3c2;
    }

    &:active {
      background-color: $like-gray-1;
      box-shadow: 0 0 2px 0 rgba(black, 0.1);
    }

    &-icon {
      width: 28px;
      height: 28px;

      margin-right: 16px;
    }

    & + & {
      margin-top: 24px;
    }
  }
}
</style>

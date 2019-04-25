<template>
  <div class="signin-portal lc-padding-top-16">
    <div class="lc-dialog-container-1">
      <h1 class="lc-font-size-32 lc-margin-bottom-8 lc-mobile">
        {{ $t(`${localeBasePath}.title`) }}
      </h1>
      <p class="lc-font-size-16 lc-color-like-gray-4 lc-margin-bottom-24 lc-mobile">
        {{ $t(`${localeBasePath}.description`) }}
      </p>
    </div>

    <div class="signin-portal__method-list-wrapper lc-dialog-container-1">
      <span class="lc-font-size-12">
        {{ $t(`${localeBasePath}.label.with`) }}
      </span>

      <div class="signin-portal__method-list lc-margin-top-12 lc-text-align-center">
        <md-button
          class="md-likecoin google with-border lc-with-icon"
          @click="onSignInWith('google')"
        >
          <md-icon :md-src="GoogleIcon" />
          Google
        </md-button>
        <md-button
          class="md-likecoin lc-facebook lc-with-icon"
          @click="onSignInWith('facebook')"
        >
          <md-icon :md-src="FacebookIcon" />
          Facebook
        </md-button>
        <md-button
          class="md-likecoin lc-twitter lc-with-icon"
          @click="onSignInWith('twitter')"
        >
          <md-icon :md-src="TwitterIcon" />
          Twitter
        </md-button>

        <!-- <span class="lc-margin-vertical-8 lc-font-size-12">
          {{ $t(`${localeBasePath}.label.or`) }}
        </span>

        <md-button
          class="md-likecoin email with-border lc-with-icon"
          @click="onSignInWith('email')"
        >
          <md-icon :md-src="EmailIcon" />
          {{ $t(`${localeBasePath}.button.email`) }}
        </md-button> -->

      </div>
    </div>

    <div class="lc-dialog-container-1 lc-padding-top-16 lc-padding-bottom-12 lc-text-align-center">
      <a
        v-bind="$testID('SignInWithWalletButton')"
        class="lc-color-like-gray-4 lc-font-size-12 lc-underline"
        @click="onSignInWith('wallet')"
      >
        {{ $t(`${localeBasePath}.button.wallet`) }}
      </a>
    </div>

  </div>
</template>

<script>
import EmailIcon from '@/assets/icons/fillable/email.svg';
import FacebookIcon from '@/assets/icons/fillable/facebook.svg';
import GoogleIcon from '@/assets/icons/google.svg';
import TwitterIcon from '@/assets/icons/fillable/twitter.svg';

export default {
  name: 'signin-portal',
  props: {
    isSignIn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      EmailIcon,
      FacebookIcon,
      GoogleIcon,
      TwitterIcon,
    };
  },
  computed: {
    localeBasePath() {
      return `AuthDialog.${this.isSignIn ? 'SignIn' : 'SignUp'}`;
    },
  },
  methods: {
    onSignInWith(platform) {
      this.$emit('submit', platform);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/variables';

.signin-portal {
  &__method-list-wrapper {
    padding-top: 16px;
    padding-bottom: 32px;

    background: $like-gray-1;
  }

  &__method-list {
    display: flex;
    flex-direction: column;
    justify-content: center;

    padding: 0 16px;

    .md-button {
      display: block;

      height: 48px;
      margin: 0;

      border-radius: 8px;

      font-size: 24px;

      & + .md-button {
        margin-top: 8px;
      }

      &.google {
        color: #4385f4;
        background-color: white;
      }

      &.email {
        color: $like-green;
        background-color: transparent;

        .md-icon {
          color: $like-gray-4;
        }
      }

      &.with-border {
        border: solid 2px #e6e6e6;
      }
    }
  }
}
</style>

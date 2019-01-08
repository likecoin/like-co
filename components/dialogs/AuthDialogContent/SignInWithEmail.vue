<template>
  <div class="signin-with-email-form lc-padding-vertical-16">
    <div class="lc-dialog-container-1">
      <h1 class="lc-font-size-32 lc-margin-bottom-8 lc-mobile">
        {{ $t('AuthDialog.SignInWithEmail.title') }}
      </h1>
      <p class="lc-font-size-16 lc-color-like-gray-4 lc-margin-bottom-32">
        {{ $t(`AuthDialog.SignInWithEmail.description${isReEnter ? 'ReEnter' : '' }`) }}
      </p>
    </div>

    <form @submit.prevent="onSubmit">

      <div class="user-fields">
        <div class="lc-dialog-container-1">

          <md-field class="lc-margin-top-12 lc-margin-bottom-24 lc-mobile">
            <label>{{ $t('AuthDialog.SignInWithEmail.label.email') }}</label>
            <md-input
              v-model="email"
              :pattern="W3C_EMAIL_REGEX"
              :title="$t('Register.form.error.emailFormat')"
              required
              @change="email=email.toLowerCase().trim()"
            />
          </md-field>

          <div class="lc-dialog-container-1 lc-button-group">
            <md-button
              :disabled="!isFormValid"
              class="md-likecoin"
              type="submit"
            >
              {{ $t('General.button.continue') }}
            </md-button>
          </div>

        </div>
      </div>

    </form>

    <div
      v-if="isShowBack"
      class="lc-dialog-container-1 lc-margin-top-24 lc-text-align-center"
    >
      <a
        class="lc-color-like-gray-4 lc-font-size-12 lc-underline"
        @click="$emit('cancel')"
      >
        {{ $t('AuthDialog.SignInWithEmail.button.back') }}
      </a>
    </div>

  </div>
</template>

<script>
import {
  W3C_EMAIL_REGEX,
} from '@/constant';

export default {
  name: 'signin-with-email-form',
  props: {
    isShowBack: {
      type: [Boolean, String],
      default: true,
    },
    isReEnter: {
      type: [Boolean, String],
      default: false,
    },
  },
  data() {
    return {
      W3C_EMAIL_REGEX,

      email: '',
    };
  },
  computed: {
    isFormValid() {
      return new RegExp(W3C_EMAIL_REGEX).test(this.email);
    },
  },
  methods: {
    onSubmit() {
      this.$emit('submit', this.email.toLowerCase().trim());
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/variables';

form {
  .user-fields {
    padding-top: 24px;
    padding-bottom: 24px;

    background-color: $like-gray-1;
  }
}
</style>

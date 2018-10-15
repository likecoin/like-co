<template>
  <div class="sign-in-with-email-form">
    <div class="lc-dialog-container-1">
      <h1 class="lc-font-size-32 lc-margin-bottom-8">
        {{ $t('AuthDialog.SignIn.title') }}
      </h1>
    </div>

    <form @submit.prevent="onSubmit">

      <div class="user-fields">
        <div class="lc-dialog-container-1">

          <md-field class="lc-margin-top-12 lc-margin-bottom-24 lc-mobile">
            <label>{{ $t('Register.form.email') }}</label>
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
              {{ $t('General.button.confirm') }}
            </md-button>
          </div>

        </div>
      </div>

    </form>

  </div>
</template>

<script>
import {
  W3C_EMAIL_REGEX,
} from '@/constant';

export default {
  name: 'email-login-form',
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

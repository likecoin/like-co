<template>
  <div class="register-form lc-padding-vertical-16">
    <div class="lc-dialog-container-1">
      <h1 class="lc-font-size-32 lc-margin-bottom-8 lc-mobile">
        {{ $t('AuthDialog.Register.title') }}
      </h1>
    </div>

    <form
      v-bind="$testID('RegisterForm')"
      @submit.prevent="onSubmit"
    >

      <div class="user-fields">
        <div class="lc-dialog-container-1">

          <div
            v-if="isShowAvatar"
            class="avatar-picker"
          >

            <div class="avatar-picker__preview">
              <img
                v-if="avatarSrc"
                :src="avatarSrc"
              >
              <md-button @click="openAvatarPicker">
                <md-icon
                  v-if="!avatarSrc"
                  class="md-size-2x"
                >person</md-icon>
              </md-button>
            </div>

            <a
              class="lc-underline lc-font-size-12"
              @click.prevent="openAvatarPicker"
            >
              {{ $t('AuthDialog.Register.button.uploadAvatar') }}
            </a>

            <input
              ref="avatarPicker"
              type="file"
              accept="image/*"
              @change="onPickAvatar"
            >

          </div>

          <md-field
            :class="[
              'lc-margin-top-12 lc-margin-bottom-24 lc-mobile',
              {
                'md-invalid': !!idErrorMessage,
              },
            ]"
          >
            <label>{{ $t('Register.form.createID') }}</label>
            <md-input
              v-model="likeCoinId"
              :pattern="LIKECOIN_ID_REGEX_STRING"
              :title="$t('Register.form.error.alphanumeric')"
              v-bind="$testID('RegisterForm-LikeCoinIdField')"
              required
              @focus="isFocusedIdField = true"
              @blur="isFocusedIdField = false"
              @change="likeCoinId=likeCoinId.toLowerCase().trim()"
            />
            <span class="md-error">{{ idErrorMessage }}</span>
          </md-field>

          <md-field
            v-if="!isHideFilledInfo"
            :class="[
              'lc-margin-top-12 lc-margin-bottom-24 lc-mobile',
              {
                'md-invalid': !!emailErrorMessage,
              },
            ]"
          >
            <label>{{ $t('Register.form.email') }}</label>
            <md-input
              v-model="email"
              :disabled="!isEditEmail"
              :pattern="REGISTER_EMAIL_REGEX_STRING"
              :title="$t('Register.form.error.emailFormat')"
              v-bind="$testID('RegisterForm-EmailField')"
              required
              @focus="isFocusedEmailField = true"
              @blur="isFocusedEmailField = false"
              @change="email=email.toLowerCase().trim()"
            />
            <span class="md-error">{{ emailErrorMessage }}</span>
          </md-field>
        </div>
      </div>

      <!-- HACK: Hide email notification option -->
      <!-- <div class="checkbox-list lc-dialog-container-1">
        <md-checkbox
          v-model="isEmailEnabled"
          class="md-likecoin"
        >
          {{ $t('Register.form.enableEmail') }}
        </md-checkbox>
      </div> -->

      <div class="lc-dialog-container-1 lc-button-group">
        <md-button
          :disabled="!isFormValid"
          class="md-likecoin"
          type="submit"
        >
          {{ $t('General.button.confirm') }}
        </md-button>
      </div>

      <div class="term-agreement">
        <i18n
          path="Register.form.agreeTerms"
          tag="span"
        >
          <a
            href="/in/policies/privacy"
            place="privacyPolicy"
            rel="noopener noreferrer"
            target="_blank"
          >{{ $t('Register.form.privacyPolicy') }}</a>
        </i18n>
      </div>

    </form>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import {
  IS_TESTNET,
  LIKECOIN_ID_REGEX_STRING,
  LIKECOIN_ID_REGEX,
  REGISTER_EMAIL_REGEX_STRING,
  REGISTER_EMAIL_REGEX,
} from '@/constant';

export default {
  name: 'register-form',
  props: {
    prefilledData: {
      type: Object,
      default: () => {},
    },
    isEditEmail: {
      type: Boolean,
      default: true,
    },
    platform: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      LIKECOIN_ID_REGEX_STRING,
      REGISTER_EMAIL_REGEX_STRING,

      avatarData: null,
      avatarFile: null,
      likeCoinId: this.prefilledData.defaultLikeCoinId || '',
      email: this.prefilledData.email || '',
      isEmailEnabled: true,
      isTermsAgreed: true,

      isFocusedIdField: false,
      isFocusedEmailField: false,
    };
  },
  computed: {
    ...mapGetters([
      'getInfoMsg',
    ]),
    isHideFilledInfo() {
      return this.platform === 'google' || this.platform === 'authcore';
    },
    isShowAvatar() {
      return this.platform !== 'authcore';
    },
    avatarSrc() {
      return this.avatarData || this.prefilledData.avatarURL;
    },
    isIdValid() {
      return LIKECOIN_ID_REGEX.test(this.likeCoinId);
    },
    isEmailFormatValid() {
      return REGISTER_EMAIL_REGEX.test(this.email);
    },
    isEmailContainsInvalidCharacter() {
      if (IS_TESTNET) return false;
      return /\+/.test(this.email.split('@')[0]);
    },
    isEmailValid() {
      return (
        this.isHideFilledInfo
        || !this.isEditEmail
        || (this.isEmailFormatValid && !this.isEmailContainsInvalidCharacter)
      );
    },
    isFormValid() {
      return this.isTermsAgreed && this.isEmailValid && this.isIdValid;
    },
    idErrorMessage() {
      if (this.likeCoinId && !this.isFocusedIdField && !this.isIdValid) {
        return this.$t('Register.form.error.alphanumeric');
      }

      if (this.getInfoMsg === 'USER_ALREADY_EXIST') {
        return this.$t(`Error.${this.getInfoMsg}`);
      }

      return '';
    },
    emailErrorMessage() {
      if (this.email && !this.isFocusedEmailField && !this.isEmailValid) {
        if (!this.isEmailFormatValid) {
          return this.$t('Register.form.error.emailFormat');
        }
        if (this.isEmailContainsInvalidCharacter) {
          return this.$t('Register.form.error.emailWithInvalidCharacter');
        }
      }

      if (this.getInfoMsg === 'EMAIL_ALREADY_USED') {
        return this.$t(`Error.${this.getInfoMsg}`);
      }

      return '';
    },
  },
  methods: {
    ...mapActions([
      'setInfoMsg',
      'setErrorMsg',
      'refreshUser',
    ]),
    openAvatarPicker() {
      this.$refs.avatarPicker.click();
    },
    onPickAvatar(event) {
      const { files } = event.target;
      if (files && files[0]) {
        [this.avatarFile] = Object.values(files);
        const reader = new FileReader();
        reader.onload = (e) => {
          this.avatarData = e.target.result;
        };
        reader.readAsDataURL(files[0]);
      }
    },
    async onSubmit() {
      if (!this.isFormValid) return;

      if (!this.isTermsAgreed) {
        this.setErrorMsg(this.$t('Register.form.error.terms'));
        return;
      }

      const payload = {
        user: this.likeCoinId.toLowerCase().trim(),
        isEmailEnabled: this.isEmailEnabled,
      };

      if (this.email) {
        payload.email = this.email.toLowerCase().trim();
      }
      if (this.avatarFile) payload.avatarFile = this.avatarFile;

      this.$emit('register', payload);
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

  .avatar-picker {
    display: flex;
    align-items: center;

    &__preview {
      position: relative;

      overflow: hidden;

      width: 64px;
      height: 64px;
      margin: 0;

      border-radius: 50%;
      background-color: $like-gray-3;

      > .md-button {
        position: absolute;
        top: 0;
        left: 0;

        min-width: 64px;
        margin: 0;

        .md-icon {
          color: darken($like-gray-3, 15);
        }
      }

      > img {
        pointer-events: none;
      }

      > * {
        display: block;

        width: inherit;
        height: inherit;
      }
    }

    a {
      margin-left: 16px;
    }

    input {
      display: none;
    }
  }

  .checkbox-list {
    margin: 24px 0;

    .md-checkbox {
      margin: 0;

      & + label {
        margin-left: 8px;
      }
    }
  }

  .term-agreement {
    text-align: center;
  }
}
</style>

<template>
  <div class="register-form lc-padding-vertical-16">
    <div class="lc-dialog-container-1">
      <h1 class="lc-font-size-32 lc-margin-bottom-8">
        {{ $t('AuthDialog.Register.title') }}
      </h1>
    </div>

    <form @submit.prevent="onSubmit">

      <div class="user-fields">
        <div class="lc-dialog-container-1">

          <div
            v-if="isShowAvatar"
            class="avatar-picker"
          >

            <div class="avatar-picker__preview">
              <img
                v-if="avatarData || avatarUrl"
                :src="avatarData || avatarUrl"
              >
              <md-button @click="openAvatarPicker">
                <md-icon
                  v-if="!(avatarData || avatarUrl)"
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
                'md-invalid': getInfoMsg === 'USER_ALREADY_EXIST',
              },
            ]"
          >
            <label>{{ $t('Register.form.createID') }}</label>
            <md-input
              v-model="likeCoinId"
              :pattern="LIKECOIN_ID_REGEX"
              :title="$t('Register.form.error.alphanumeric')"
              required
              @change="likeCoinId=likeCoinId.toLowerCase().trim()"
            />
            <span class="md-error">{{ $t(`Error.${getInfoMsg}`) }}</span>
          </md-field>

          <md-field
            v-if="isShowEmail"
            :class="[
              'lc-margin-top-12 lc-margin-bottom-24 lc-mobile',
              {
                'md-invalid': getInfoMsg === 'EMAIL_ALREADY_USED',
              },
            ]"
          >
            <label>{{ $t('Register.form.email') }}</label>
            <md-input
              v-model="email"
              :pattern="W3C_EMAIL_REGEX"
              :title="$t('Register.form.error.emailFormat')"
              required
              @change="email=email.toLowerCase().trim()"
            />
            <span class="md-error">{{ $t(`Error.${getInfoMsg}`) }}</span>
          </md-field>
        </div>
      </div>

      <div class="checkbox-list lc-dialog-container-1">
        <md-checkbox
          v-model="isEmailEnabled"
          class="md-likecoin"
        >
          {{ $t('Register.form.enableEmail') }}
        </md-checkbox>

        <div class="term-agreement">
          <md-checkbox
            v-model="isTermsAgreed"
            class="md-likecoin"
          />
          <i18n
            path="Register.form.agreeTerms"
            tag="label"
            @click="isTermsAgreed = !isTermsAgreed"
          >
            <a
              href="/in/policies/privacy"
              place="privacyPolicy"
              rel="noopener noreferrer"
              target="_blank"
            >{{ $t('Register.form.privacyPolicy') }}</a>
          </i18n>
        </div>

      </div>

      <div class="lc-dialog-container-1 lc-button-group">
        <md-button
          :disabled="!isFormValid"
          class="md-likecoin"
          type="submit"
        >
          {{ $t('General.button.confirm') }}
        </md-button>
      </div>

    </form>

  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';

import {
  W3C_EMAIL_REGEX,
} from '@/constant';

const LIKECOIN_ID_REGEX = '[a-z0-9-_]{7,20}';

export default {
  name: 'register-form',
  props: {
    isShowEmail: {
      type: Boolean,
      default: true,
    },
    isShowAvatar: {
      type: Boolean,
      default: true,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      W3C_EMAIL_REGEX,
      LIKECOIN_ID_REGEX,

      avatarData: null,
      avatarFile: null,
      likeCoinId: '',
      email: '',
      isEmailEnabled: false,
      isTermsAgreed: false,
    };
  },
  computed: {
    ...mapGetters([
      'getCurrentLocale',
      'getInfoMsg',
    ]),
    isFormValid() {
      const isIdValid = new RegExp(LIKECOIN_ID_REGEX).test(this.likeCoinId);
      const isEmailValid = (
        !this.isShowEmail
        || new RegExp(W3C_EMAIL_REGEX).test(this.email)
      );
      return this.isTermsAgreed && isEmailValid && isIdValid;
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

      if (this.avatarFile) {
        payload.avatarFile = this.avatarFile;
      } else if (this.avatarUrl) {
        // Get the avatar file from URL
        const res = await axios.get(this.avatarUrl, {
          responseType: 'blob',
          timeout: 30000,
        });
        const filename = this.avatarUrl.split('/').pop();
        payload.avatarFile = new File([new Blob([res.data])], filename);
      }

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
}
</style>

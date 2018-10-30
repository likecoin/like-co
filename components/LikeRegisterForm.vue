<template>
  <div class="inner-container">
    <form
      id="registerForm"
      @submit.prevent="onSubmit"
    >
      <div class="md-layout">
        <div class="icon">
          <img
            v-if="avatarData"
            :src="avatarData"
            class="avatar"
          >
          <md-button @click="openPicker">
            <md-icon class="md-size-2x">file_upload</md-icon>
          </md-button>
          <input
            ref="inputFile"
            type="file"
            accept="image/*"
            @change="previewImage"
          >
        </div>
        <div class="md-layout md-layout-item">
          <div class="md-layout-item">

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
                v-model="user"
                :pattern="USER_ID_REGEX"
                :title="$t('Register.form.error.alphanumeric')"
                v-bind="getTestAttribute('userId')"
                required
                @change="user=user.toLowerCase().trim()"
              />
              <span class="md-error">{{ $t(`Error.${getInfoMsg}`) }}</span>
            </md-field>

            <md-field
              :class="[
                'lc-margin-top-12',
                'lc-margin-bottom-24',
                'lc-mobile',
                { 'md-invalid': isBadAddress }
              ]"
            >
              <label>{{ $t('Register.form.walletAddress') }}</label>
              <md-input
                v-model="wallet"
                maxlength="42"
                required
                disabled
              />
              <span
                v-if="isBadAddress"
                class="md-error"
              >
                {{ $t('Register.form.error.addressFormat') }}
              </span>
            </md-field>

            <md-field
              :class="[
                'lc-margin-top-12 lc-margin-bottom-24 lc-mobile',
                {
                  'md-invalid': getInfoMsg === 'EMAIL_ALREADY_USED',
                },
              ]"
            >
              <label>{{ $t('Register.form.email') }}</label>
              <md-input
                :pattern="W3C_EMAIL_REGEX"
                v-model="email"
                :title="$t('Register.form.error.emailFormat')"
                v-bind="getTestAttribute('email')"
                required
                @change="email=email.toLowerCase().trim()"
              />
              <span class="md-error">{{ $t(`Error.${getInfoMsg}`) }}</span>
            </md-field>

            <md-field
              :class="[
                'lc-margin-top-12 lc-margin-bottom-24 lc-mobile',
                {
                  'md-invalid': getInfoMsg === 'REFERRER_NOT_EXIST',
                },
              ]"
            >
              <label>{{ $t('Register.form.referrer') }}</label>
              <md-input
                v-model="referrer"
                @change="referrer=referrer.toLowerCase().trim()"
              />
              <span class="md-error">{{ $t(`Error.${getInfoMsg}`) }}</span>
            </md-field>

            <md-field
              v-if="isRedeem"
              class="lc-margin-top-12 lc-margin-bottom-24 lc-mobile"
            >
              <label>
                {{ $t('Register.form.couponCode') }}
              </label>
              <md-input
                v-model="couponCode"
                pattern="[2-9A-HJ-NP-Za-km-z]{8}"
              />
            </md-field>

            <div class="check-box-list">
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
                  v-bind="getTestAttribute('agreeTerms')"
                  path="Register.form.agreeTerms"
                  tag="label"
                  @click="selectAgreeTerms"
                >
                  <a
                    href="/in/policies/privacy"
                    place="privacyPolicy"
                    rel="noopener noreferrer"
                    target="_blank"
                  >{{
                    $t('Register.form.privacyPolicy')
                  }}</a>
                </i18n>
              </div>
            </div>

            <vue-recaptcha
              class="lc-margin-top-32"
              sitekey="6LfQqlgUAAAAADGckz6BtIuD_sU6cJhWDJ__OBx7"
              @verify="onCaptchaVerify"
              @expired="onCaptchaExpired"
            />

          </div>
        </div>
      </div>
      <div
        id="form-btn"
        class="lc-margin-top-16 lc-mobile"
      >
        <material-button
          id="confirm-btn"
          :disabled="getIsPopupBlocking || !isFormValid"
          type="submit"
          form="registerForm"
        >
          <span v-if="subscriptionId">{{ $t('General.button.confirmAndClaim') }}</span>
          <span>{{ $t('General.button.confirm') }}</span>
        </material-button>
      </div>
    </form>

    <claim-dialog
      ref="claimDialog"
      :couponCode="couponCode"
      :wallet="wallet"
    />

    <referrer-dialog
      :is-show.sync="shouldShowReferrerDialog"
      :referrer-id="referrer"
      v-bind="referrerInfo"
    />

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import VueRecaptcha from 'vue-recaptcha';

import User from '@/util/User';
import { logTrackerEvent } from '@/util/EventLogger';
import getTestAttribute from '@/util/test';

import ClaimDialog from '~/components/dialogs/ClaimDialog';
import ReferrerDialog from '~/components/dialogs/ReferrerDialog';
import MaterialButton from '~/components/MaterialButton';

import { toDataUrl } from '@likecoin/ethereum-blockies';
import { ETHERSCAN_HOST, W3C_EMAIL_REGEX, IS_TESTNET } from '@/constant';

const USER_ID_REGEX = '[a-z0-9-_]{7,20}';
export default {
  name: 'like-register-form',
  components: {
    ClaimDialog,
    ReferrerDialog,
    MaterialButton,
    VueRecaptcha,
  },
  props: {
    isRedeem: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      avatarFile: null,
      avatar: null,
      avatarData: null,
      user: '',
      email: this.$route.query.email || '',
      isEmailEnabled: false,
      isTermsAgreed: false,
      couponCode: '',
      referrer: this.$route.query.from || '',
      referrerInfo: {},
      likeCoinBalance: NaN,
      wallet: this.getLocalWallet,
      reCaptchaResponse: '',
      isBadAddress: false,
      ETHERSCAN_HOST,
      USER_ID_REGEX,
      W3C_EMAIL_REGEX,
      IS_TESTNET,
      shouldShowReferrerDialog: false,
      sourceURL: this.$route.query.referrer || '',
    };
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getInfoMsg',
      'getIsPopupBlocking',
      'getLocalWallet',
      'getCurrentLocale',
    ]),
    isFormValid() {
      const isIdValid = new RegExp(USER_ID_REGEX).test(this.user);
      const isEmailValid = new RegExp(W3C_EMAIL_REGEX).test(this.email);
      return this.isTermsAgreed && isEmailValid && isIdValid && !!this.reCaptchaResponse;
    },
    subscriptionId() {
      return this.$route.query.subscriptionId || '';
    },
  },
  watch: {
    getLocalWallet(w) {
      if (w) {
        this.setMyLikeCoin(w);
      }
    },
    shouldShowReferrerDialog(isShow) {
      this.setErrorDisabled(isShow);
    },
  },
  mounted() {
    if (this.referrer) {
      this.fetchReferrerInfo();
    }
    if (this.isEdit) {
      this.updateInfo();
    }
    const localWallet = this.getLocalWallet;
    if (localWallet) {
      this.setMyLikeCoin(localWallet);
    }
  },
  methods: {
    ...mapActions([
      'newUser',
      'getBlockie',
      'getMiniUserById',
      'setPageHeader',
      'setInfoMsg',
      'setErrorDisabled',
      'setErrorMsg',
      'refreshUser',
      'setTxDialogAction',
      'claimSubscription',
    ]),
    async setMyLikeCoin(wallet) {
      this.wallet = wallet;
      if (!this.avatarFile) {
        this.avatarData = toDataUrl(wallet);
      }
    },
    checkAddress() {
      return this.wallet.length === 42 && this.wallet.substr(0, 2) === '0x';
    },
    previewImage(event) {
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
    openPicker() {
      this.$refs.inputFile.click();
    },
    onCaptchaVerify(response) {
      this.reCaptchaResponse = response;
    },
    onCaptchaExpired() {
      this.reCaptchaResponse = '';
    },
    selectAgreeTerms() {
      this.isTermsAgreed = !this.isTermsAgreed;
    },
    getTestAttribute: getTestAttribute('registerForm'),
    async onSubmit() {
      try {
        this.isBadAddress = false;
        if (!this.checkAddress()) {
          this.isBadAddress = true;
          return;
        }
        if (!this.isTermsAgreed) {
          this.setErrorMsg(this.$t('Register.form.error.terms'));
          return;
        }
        const { reCaptchaResponse } = this;
        if (!reCaptchaResponse && !this.IS_TESTNET) {
          this.setErrorMsg(this.$t('Register.form.error.reCaptcha'));
          return;
        }
        const userInfo = {
          avatarFile: this.avatarFile,
          user: this.user.toLowerCase().trim(),
          wallet: this.wallet,
          email: this.email.toLowerCase().trim(),
          isEmailEnabled: this.isEmailEnabled,
          referrer: this.referrer.toLowerCase().trim(),
          locale: this.getCurrentLocale,
        };
        const data = await User.formatAndSignUserInfo(userInfo, this.$t('Sign.Message.registerUser'));
        await this.newUser({ reCaptchaResponse, ...data });
        if (this.subscriptionId) {
          const payload = {
            user: this.user,
            subscriptionId: this.subscriptionId,
          };
          try {
            await this.claimSubscription(payload);
            this.$route.query.ref = 'in-donation-done';
          } catch (err) {
            // no op
          }
        }
        if (this.couponCode) {
          this.setTxDialogAction({ txDialogActionRoute: { name: 'in' }, txDialogActionText: 'View Account' });
          await this.$refs.claimDialog.onSubmit();
        }
        logTrackerEvent(this, 'RegFlow', 'CompleteRegistration', 'click confirm to create new account and the action success', 1);
        if (this.referrer) {
          logTrackerEvent(this, 'RegFlow', 'CompleteReferrer', 'created new account with referrer', 1);
        }
        if (this.sourceURL) {
          logTrackerEvent(this, 'RegFlow', 'CompleteSourceURL', this.sourceURL, 1);
        }
        await this.refreshUser(this.wallet);
        this.setInfoMsg(`${this.$t('Register.form.label.updatedInfo')}  <a href="/${this.user}">${this.$t('Register.form.label.viewPage')}</a>`);
        this.$emit('registered', this.user);
      } catch (err) {
        console.error(err);
      }
    },
    async fetchReferrerInfo() {
      this.setErrorDisabled(true);
      try {
        const { avatar, displayName } = await this.getMiniUserById(this.referrer);
        this.referrerInfo = {
          avatar,
          displayName,
        };
        this.shouldShowReferrerDialog = true;
      } catch (error) {
        this.setErrorDisabled(false);
        const { from, ...query } = this.$route.query;
        this.$router.replace({ name: 'in-register', query });
      }
    },
  },
};

</script>

<style lang="scss" scoped>
@import "~assets/variables";
@import "~assets/input";

$icon-size: 144px;
$icon-mobile-size: 88px;


#registerForm {
  @media (max-width: 600px) {
    > .md-layout {
      flex-direction: column;
    }

    .md-field {
      label,
      input {

        overflow: hidden;

        width: 100%;

        white-space: nowrap;

        text-overflow: ellipsis;
      }
    }
  }

  #form-btn {
    text-align: right;

    @media (max-width: 600px) {
      text-align: center;
    }

    #confirm-btn {
      width: 256px;
      height: 40px;

      margin: 0;
    }
  }
}

.icon {
  position: relative;

  overflow: hidden;

  border-radius: 50%;

  @media (min-width: 601px) {
    width: $icon-size;
    height: $icon-size;

    margin: 8px;
    margin-right: 32px;
  }

  @media (max-width: 600px) {
    width: $icon-mobile-size;
    height: $icon-mobile-size;
  }

  .avatar {
    width: auto;
    height: 100%;
  }

  .md-button {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    width: 100%;
    height: 100%;
    margin: auto;

    opacity: .3;

    &:hover {
      opacity: 1;
    }
  }
}

input[type="file"] {
  position: absolute;

  overflow: hidden;
  clip: rect(0 0 0 0);

  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;

  border: 0;
}

.check-box-list {
  display: flex;
  flex-direction: column;

  .md-checkbox {
    margin: 0;
  }

  .term-agreement {
    display: flex;
    flex-direction: row;

    color: $like-dark-brown-1;

    label {
      padding-top: 6px;
      padding-left: 8px;

      cursor: pointer;

      :global(a) {
        text-decoration: underline;

        color: currentColor;
      }
    }
  }
}

.md-field.md-required label:after {

  right: initial;

  transform: translateX(2px);
}
</style>

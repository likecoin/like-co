<template>
  <div class="inner-container">
    <form id="registerForm" v-on:submit.prevent="onSubmit">
      <div class="md-layout">
        <div class="icon">
          <img v-if="avatarData" class="avatar" :src="avatarData" />
          <md-button @click="openPicker">
            <md-icon class="md-size-2x">file_upload</md-icon>
          </md-button>
          <input type="file" ref="inputFile" accept="image/*" @change="previewImage" />
        </div>
        <div class="md-layout md-layout-item">
          <div class="md-layout-item">

            <md-field
              :class="[
                'lc-margin-top-12 lc-margin-bottom-24 lc-mobile',
                {
                  'md-invalid': getInfoMsg === 'USER_ALREADY_EXIST',
                },
              ]">
              <label>{{ $t('Register.form.createID') }}</label>
              <md-input
                v-model="user"
                pattern="[a-z0-9-_]{7,20}"
                @change="user=user.toLowerCase().trim()"
                :title="$t('Register.form.error.alphanumeric')"
                required />
              <span class="md-error">{{ $t(`Error.${getInfoMsg}`) }}</span>
            </md-field>

            <md-field :class="['lc-margin-top-12', 'lc-margin-bottom-24', 'lc-mobile', { 'md-invalid': isBadAddress }]">
              <label>{{ $t('Register.form.walletAddress') }}</label>
              <md-input v-model="wallet" maxlength="42" required disabled />
              <span v-if="isBadAddress" class="md-error">
                {{ $t('Register.form.error.addressFormat') }}
              </span>
            </md-field>

            <md-field
              :class="[
                'lc-margin-top-12 lc-margin-bottom-24 lc-mobile',
                {
                  'md-invalid': getInfoMsg === 'EMAIL_ALREADY_USED',
                },
              ]">
              <label>{{ $t('Register.form.email') }}</label>
              <md-input
                :pattern="W3C_EMAIL_REGEX"
                v-model="email"
                @change="email=email.toLowerCase().trim()"
                :title="$t('Register.form.error.emailFormat')"
              />
              <span class="md-error">{{ $t(`Error.${getInfoMsg}`) }}</span>
            </md-field>

            <md-field
              :class="[
                'lc-margin-top-12 lc-margin-bottom-24 lc-mobile',
                {
                  'md-invalid': getInfoMsg === 'REFERRER_NOT_EXIST',
                },
              ]">
              <label>{{ $t('Register.form.referrer') }}</label>
              <md-input v-model="referrer" @change="referrer=referrer.toLowerCase().trim()" />
              <span class="md-error">{{ $t(`Error.${getInfoMsg}`) }}</span>
            </md-field>

            <md-field class="lc-margin-top-12 lc-margin-bottom-24 lc-mobile" v-if="isRedeem">
              <label>
                {{ $t('Register.form.couponCode') }}
              </label>
              <md-input v-model="couponCode" pattern="[2-9A-HJ-NP-Za-km-z]{8}" />
            </md-field>
          </div>
        </div>
      </div>
      <!-- TODO: fix style -->
      <div style="display:flex">
        <div style="flex: 1" class=".lc-mobile-hide"/>
        <vue-recaptcha
          @verify="onCaptchaVerify"
          @expired="onCaptchaExpired"
          sitekey="6LfQqlgUAAAAADGckz6BtIuD_sU6cJhWDJ__OBx7">
        </vue-recaptcha>
      </div>
      <div id="form-btn" class="lc-margin-top-16 lc-mobile">
        <material-button
          id="confirm-btn"
          type="submit"
          form="registerForm"
          :disabled="getIsPopupBlocking">
          {{ $t('General.button.confirm') }}
        </material-button>
      </div>
    </form>
    
    <claim-dialog ref="claimDialog" :couponCode="couponCode" :wallet="wallet" />
    
    <referrer-dialog
      :is-show.sync="shouldShowReferrerDialog"
      :referrer-id="referrer"
      v-bind="referrerInfo" />

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import VueRecaptcha from 'vue-recaptcha';

import User from '@/util/User';
import { logTrackerEvent } from '@/util/EventLogger';

import ClaimDialog from '~/components/dialogs/ClaimDialog';
import ReferrerDialog from '~/components/dialogs/ReferrerDialog';
import MaterialButton from '~/components/MaterialButton';

import { toDataUrl } from '@likecoin/ethereum-blockies';
import { ETHERSCAN_HOST, W3C_EMAIL_REGEX, IS_TESTNET } from '@/constant';

export default {
  name: 'LikeRegisterForm',
  props: ['isRedeem'],
  data() {
    return {
      avatarFile: null,
      avatar: null,
      avatarData: null,
      user: '',
      email: this.$route.query.email || '',
      couponCode: '',
      referrer: this.$route.query.from || '',
      referrerInfo: {},
      likeCoinBalance: NaN,
      wallet: this.getLocalWallet,
      reCaptchaResponse: '',
      isBadAddress: false,
      ETHERSCAN_HOST,
      W3C_EMAIL_REGEX,
      IS_TESTNET,
      shouldShowReferrerDialog: false,
    };
  },
  components: {
    ClaimDialog,
    ReferrerDialog,
    MaterialButton,
    VueRecaptcha,
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getInfoMsg',
      'getIsPopupBlocking',
      'getLocalWallet',
      'getCurrentLocale',
    ]),
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
    async onSubmit() {
      try {
        this.isBadAddress = false;
        if (!this.checkAddress()) {
          this.isBadAddress = true;
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
          referrer: this.referrer.toLowerCase().trim(),
          locale: this.getCurrentLocale,
        };
        const data = await User.formatAndSignUserInfo(userInfo, this.$t('Sign.Message.registerUser'));
        await this.newUser({ reCaptchaResponse, ...data });
        if (this.couponCode) {
          this.setTxDialogAction({ txDialogActionRoute: { name: 'in' }, txDialogActionText: 'View Account' });
          await this.$refs.claimDialog.onSubmit();
        }
        logTrackerEvent(this, 'RegFlow', 'CompleteRegistration', 'click confirm to create new account and the action success', 1);
        if (this.referrer) {
          logTrackerEvent(this, 'RegFlow', 'CompleteReferrer', 'created new account with referrer', 1);
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
        width: 100%;

        white-space: nowrap;
        overflow: hidden;
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
</style>

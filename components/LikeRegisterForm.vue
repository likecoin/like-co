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
            <md-field>
              <label>{{ $t('Register.form.createID') }}</label>
              <md-input
                v-model="user"
                pattern="[a-z0-9-_]{7,20}"
                @change="user=user.toLowerCase()"
                :disabled="isEdit"
                :title="$t('Register.form.error.alphanumeric')"
                required />
            </md-field>
            <md-field :class="isBadAddress? 'md-invalid' : ''">
              <label>{{ $t('Register.form.walletAddress') }}</label>
              <md-input v-model="wallet" maxlength="42" required disabled />
              <span v-if="isBadAddress" class="md-error">
                {{ $t('Register.form.error.addressFormat') }}
              </span>
            </md-field>
            <div v-if="isEdit && !isNaN(likeCoinBalance) && !isRedeemingCoupon">
              {{ $t('Register.form.amount') }}
              <a :href="`${ETHERSCAN_HOST}/address/${wallet}#tokentxns`" target="_blank" rel="noopener">
                {{ likeCoinBalance }}
              </a>
            </div>
            <md-field>
              <label>{{ $t('Register.form.email') }}</label>
              <md-input type="email" v-model="email" />
            </md-field>
            <md-field>
              <label>{{ $t('Register.form.referrer') }}</label>
              <md-input v-model="referrer" />
            </md-field>
            <md-field v-if="isEdit && !isRedeemingCoupon">
              <label>{{ $t('Register.form.displayName') }}</label>
              <md-input v-model="displayName" />
            </md-field>
            <md-field v-if="isRedeem || isEdit">
              <label>
                <span v-if="isEdit">
                  {{ $t('Register.form.claim') }}
                </span>
                {{ $t('Register.form.couponCode') }}
              </label>
              <md-input v-model="couponCode" pattern="[2-9A-HJ-NP-Za-km-z]{8}" />
            </md-field>
          </div>
        </div>
      </div>
      <div id="form-btn">
        <md-button
          class="md-raised md-primary"
          id="confirm-btn"
          type="submit"
          form="registerForm"
          :disabled="getIsPopupBlocking">
          {{ $t('General.button.confirm') }}
        </md-button>
      </div>
    </form>
    <claim-dialog ref="claimDialog" :couponCode="couponCode" :wallet="wallet" />
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';

import EthHelper from '@/util/EthHelper';
import User from '@/util/User';
import { logTrackerEvent } from '@/util/EventLogger';
import ClaimDialog from '~/components/dialogs/ClaimDialog';
import { mapActions, mapGetters } from 'vuex';
import { toDataUrl } from '@likecoin/ethereum-blockies';
import { ETHERSCAN_HOST } from '@/constant';

const URL = require('url-parse');

const ONE_LIKE = new BigNumber(10).pow(18);

export default {
  name: 'LikeRegisterForm',
  props: ['isEdit', 'isRedeem', 'redirect'],
  data() {
    return {
      avatarFile: null,
      avatar: null,
      avatarData: null,
      user: '',
      email: this.$route.query.email || '',
      displayName: '',
      couponCode: '',
      referrer: this.$route.query.from || '',
      likeCoinBalance: NaN,
      wallet: this.getLocalWallet,
      isBadAddress: false,
      isConfirming: false,
      confirmContent: '',
      onConfirm: () => {},
      ETHERSCAN_HOST,
    };
  },
  components: {
    ClaimDialog,
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getIsPopupBlocking',
      'getLocalWallet',
      'getCurrentLocale',
    ]),
    isRedeemingCoupon() {
      return this.couponCode;
    },
  },
  methods: {
    ...mapActions([
      'newUser',
      'getBlockie',
      'setPageHeader',
      'setInfoMsg',
      'checkCoupon',
      'isUser',
      'setTxDialogAction',
    ]),
    async setMyLikeCoin(wallet) {
      this.wallet = wallet;
      if (!this.avatarFile && !this.isEdit) {
        this.avatarData = toDataUrl(wallet);
      }
      const balance = await EthHelper.queryLikeCoinBalance(wallet);
      this.likeCoinBalance = new BigNumber(balance).dividedBy(ONE_LIKE).toFixed(4);
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
    updateInfo() {
      const user = this.getUserInfo;
      this.user = user.user;
      this.displayName = user.displayName;
      this.email = user.email;
      this.avatarData = user.avatar;
    },
    openPicker() {
      this.$refs.inputFile.click();
    },
    onCancel() {
      this.$router.push({ name: 'edit' });
    },
    async onSubmit() {
      try {
        this.isBadAddress = false;
        if (!this.checkAddress()) {
          this.isBadAddress = true;
          return;
        }
        const userInfo = {
          avatarFile: this.avatarFile,
          user: this.user,
          wallet: this.wallet,
          email: this.email,
          referrer: this.referrer,
          locale: this.getCurrentLocale,
        };
        const data = await User.formatAndSignUserInfo(userInfo);
        await this.newUser(data);
        await this.isUser(this.wallet);
        if (this.couponCode) {
          this.setTxDialogAction({ txDialogActionRoute: { name: 'edit' }, txDialogActionText: 'View Account' });
          await this.$refs.claimDialog.onSubmit();
        } else {
          this.setInfoMsg(`${this.$t('Register.form.label.updatedInfo')}  <a href="/${this.user}">${this.$t('Register.form.label.viewPage')}</a>`);
        }
        logTrackerEvent(this, 'RegFlow', 'CompleteRegistration', 'click confirm to create new account and the action success', 1);
        if (this.referrer) {
          logTrackerEvent(this, 'RegFlow', 'CompleteReferrer', 'created new account with referrer', 1);
        }
        if (this.redirect) {
          try {
            const url = new URL(this.redirect, true);
            url.query.likecoinId = this.user;
            url.set('query', url.query);
            window.location.href = url.toString();
          } catch (err) {
            // invalid URL;
          }
        }
      } catch (err) {
        console.error(err);
      }
    },
  },
  mounted() {
    if (this.isEdit) {
      this.updateInfo();
    }
    const localWallet = this.getLocalWallet;
    if (localWallet) {
      this.setMyLikeCoin(localWallet);
    }
  },
  watch: {
    isEdit(e) {
      if (e && !this.isRedeemingCoupon) {
        this.$router.replace({ name: 'edit', params: { showEmail: !!this.email } });
      }
    },
    getLocalWallet(w) {
      if (w) {
        this.setMyLikeCoin(w);
      }
    },
  },
};

</script>

<style lang="scss" scoped>
@import "../assets/index";

$icon-size: 144px;


.inner-container {
  padding-bottom: 60px;
}

#has-account {
  text-align: right;
}

.md-card-media img {
  width: auto;
  max-width: 400px;
}

#form-btn {
  text-align: right;

  #confirm-btn {
    width: 256px;
    height: 40px;

    border-radius: 0;
    background-color: $like-green;

  	font-size: 24px;
  }
}

#registerForm {
  margin-top: -20px;
  padding: 40px;

  background-color: $like-gray-1;

  .md-field {
    margin: 12px 0 24px;
  }
}

.avatar {
  display: inline;

  width: auto;
  height: 100%;
  margin: 0 auto;
}

.icon {
  position: relative;

  overflow: hidden;

  width: $icon-size;
  height: $icon-size;
  margin: 8px;
  margin-right: 32px;

  border-radius: 50%;

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
      color: white;
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

<template>
  <div class="inner-container">
    <form id="registerForm" v-on:submit.prevent="onSubmit">
      <div class="md-layout">
        <div>
          <img v-if="avatarData" class="avatar" @click="openPicker" :src="avatarData" />
          <input type="file" ref="inputFile" accept="image/*" @change="previewImage" />
        </div>
        <div class="md-layout md-layout-item">
          <div class="md-layout-item">
            <md-field>
              <label>Please pick your unique username</label>
              <md-input v-model="user" :disabled="isEdit" required></md-input>
            </md-field>
            <md-field :class="isBadAddress?'md-invalid':''">
              <label>ETH wallet address</label>
              <md-input v-model="wallet" maxlength="42" required disabled />
              <span v-if="isBadAddress" class="md-error">Invalid address format</span>
            </md-field>
            <div v-if="isEdit && !isNaN(likeCoinBalance)">
              Amount of LikeCoin:
              <a :href="`https://rinkeby.etherscan.io/address/${wallet}#tokentxns`" target="_blank">{{ likeCoinBalance }}</a>
            </div>
          </div>
        </div>
      </div>
      <md-field v-if="isEdit">
        <label>Display Name</label>
        <md-input v-model="displayName" required></md-input>
      </md-field>
      <md-field v-if="isRedeem || isEdit">
        <label><span v-if="isEdit"> Claim </span> Coupon Code (Optional)</label>
        <md-input v-model="couponCode"></md-input>
      </md-field>
      <hr />
      <div id="form-btn">
        <md-button class="md-raised md-primary" type="submit" form="registerForm" :disabled="getIsLoading">Confirm</md-button>
      </div>
    </form>
    <md-dialog-confirm
      :md-active.sync="isConfirming"
      md-title="Claim coupon"
      :md-content="confirmContent"
      md-confirm-text="Confirm"
      md-cancel-text="Cancel"
      @md-cancel="onCancel"
      @md-confirm="onConfirm" />
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';

import EthHelper from '@/util/EthHelper';
import FileHelper from '@/util/FileHelper';
import { mapActions, mapGetters } from 'vuex';

const ONE_LIKE = new BigNumber(10).pow(18);

export default {
  name: 'LikeRegisterForm',
  props: ['isEdit', 'isRedeem'],
  data() {
    return {
      avatarFile: null,
      avatar: null,
      avatarData: null,
      user: '',
      displayName: '',
      couponCode: '',
      likeCoinBalance: NaN,
      wallet: EthHelper.getWallet() || '0x81f9b6c7129cee90fed5df241fa6dc4f88a19699',
      isBadAddress: false,
      isConfirming: false,
      confirmContent: '',
      onConfirm: () => {},
    };
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getIsLoading',
    ]),
  },
  methods: {
    ...mapActions([
      'newUser',
      'getBlockie',
      'setPageHeader',
      'setErrorMsg',
      'checkCoupon',
      'claimCoupon',
      'isUser',
    ]),
    async setMyLikeCoin(wallet) {
      this.wallet = wallet;
      if (!this.avatarFile) {
        const { blockie } = await this.getBlockie(wallet);
        if (!this.isEdit) this.avatarData = blockie;
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
        const ts = Date.now();
        const {
          avatarFile,
          user,
          wallet,
        } = this;
        let avatarSHA256;
        if (avatarFile) {
          const avatarBuf = await FileHelper.blobToArrayBuffer(avatarFile);
          avatarSHA256 = await FileHelper.arrayBufferToSha256(avatarBuf);
        }
        const payload = JSON.stringify({
          user,
          displayName: this.displayName || user,
          ts,
          avatarSHA256,
          wallet,
        });
        const sign = await EthHelper.signNewUser(payload);
        const data = {
          avatar: avatarFile,
          payload,
          sign,
          from: wallet,
        };
        await this.newUser(data);
        if (this.couponCode) {
          this.isConfirming = true;
          this.confirmContent = 'Loading coupon content...';
          try {
            const { value } = await this.checkCoupon(this.couponCode);
            if (!value) throw new Error('Invalid coupon');
            this.confirmContent = `Are you sure you want to claim ${value} LikeCoin?`;
            this.onConfirm = async () => {
              try {
                await this.claimCoupon({ coupon: this.couponCode, to: wallet });
                this.isUser(this.wallet);
              } catch (error) {
                this.isConfirming = true;
                this.confirmContent = `Error: ${error.message || error || 'Invalid coupon code'}! Redirecting to your account page...`;
                this.onConfirm = this.onCancel;
              }
            };
          } catch (error) {
            this.isConfirming = true;
            this.confirmContent = `Error: ${error.message || error || 'Invalid coupon code'}! Redirecting to your account page...`;
            this.onConfirm = this.onCancel;
          }
        } else {
          // commit(types.UI_ERROR_ICON, 'check');
          this.setErrorMsg(`Your information have been updated,  <a href="/pay/${this.user}">view your page</a>`);
          this.isUser(this.wallet);
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
    let localWallet = EthHelper.getWallet();
    if (localWallet) {
      this.setMyLikeCoin(localWallet);
    } else {
      setTimeout(() => {
        localWallet = EthHelper.getWallet();
        if (localWallet) {
          this.setMyLikeCoin(localWallet);
        }
      }, 2000);
    }
  },
};

</script>

<style>
#has-account {
  text-align: right;
}
.md-card-media img {
  width: auto;
  max-width: 400px;
}
#form-btn {
  text-align: right;
}

#registerForm {
  background-color: #f7f7f7;
  padding: 20px;
}

.avatar {
  width: 200px;
  height: 200px;
  cursor: pointer;
  margin: 20px;
}

input[type="file"] {
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  position: absolute;
  clip: rect(0 0 0 0);
  border: 0;
}

</style>

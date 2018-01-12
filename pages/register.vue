<template>
  <div class="inner-container">
    <div id="has-account">
      <nuxt-link :to="{ name: 'edit' }"> {{ hasAccountMsg }}</nuxt-link>
    </div>
    <form id="registerForm" v-on:submit.prevent="onSubmit">
      <div class="md-layout">
        <div>
          <input v-if="avatarData" type="image" class="avatar" @click.prevent="openPicker" :src="avatarData" />
          <input type="file" ref="inputFile" accept="image/*" @change="previewImage" />
        </div>
        <div class="md-layout md-layout-item">
          <div class="md-layout-item">
            <md-field>
              <label>Please pick your unique username</label>
              <md-input v-model="user" required></md-input>
            </md-field>
            <md-field :class="isBadAddress?'md-invalid':''">
              <label>ETH wallet address</label>
              <md-input v-model="wallet" maxlength="42" required disabled />
              <span v-if="isBadAddress" class="md-error">Invalid address format</span>
            </md-field>
          </div>
        </div>
      </div>
      <md-field v-if="isRedeem">
        <label>Coupon Code</label>
        <md-input v-model="couponCode" required></md-input>
      </md-field>
      <md-field>
        <label>Display Name</label>
        <md-input v-model="displayName" required></md-input>
      </md-field>
      <hr />
      <div id="form-btn">
        <md-button class="md-raised md-primary" type="submit" form="registerForm">Confirm</md-button>
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
import EthHelper from '@/util/EthHelper';
import FileHelper from '@/util/FileHelper';
import * as types from '@/store/mutation-types';
import { mapActions } from 'vuex';

export default {
  name: 'Register',
  fetch({ store, route }) {
    const title = (route.name === 'redeem') ?
      'Redeem your free LikeCoin' : 'Register your LikeCoin.store link';
    const subtitle = (route.name === 'redeem') ?
      'Create Account and Redeem' : 'Create Account';
    store.commit(types.UI_HEADER_UPDATE, {
      title,
      subtitle,
      icon: '',
    });
  },
  data() {
    return {
      hasAccountMsg: 'I already have a LikeCoin account',
      avatarFile: null,
      avatar: null,
      avatarData: null,
      user: '',
      displayName: '',
      couponCode: '',
      wallet: EthHelper.getWallet() || '0x81f9b6c7129cee90fed5df241fa6dc4f88a19699',
      isBadAddress: false,
      isRedeem: false,
      isConfirming: false,
      confirmContent: '',
      onConfirm: () => {},
    };
  },
  methods: {
    ...mapActions([
      'newUser',
      'getBlockie',
      'checkCoupon',
      'claimCoupon',
    ]),
    async setMyLikeCoin(wallet) {
      this.wallet = wallet;
      if (!this.avatarFile) {
        const { blockie } = await this.getBlockie(wallet);
        this.avatarData = blockie;
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
          displayName,
          wallet,
        } = this;
        let avatarSHA256;
        if (avatarFile) {
          const avatarBuf = await FileHelper.blobToArrayBuffer(avatarFile);
          avatarSHA256 = await FileHelper.arrayBufferToSha256(avatarBuf);
        }
        const payload = JSON.stringify({
          user,
          displayName,
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
                this.$router.push({ name: 'edit' });
              } catch (error) {
                this.isConfirming = true;
                this.confirmContent = `${error.message || error || 'Invalid coupon code'}! Redirecting to your account page...`;
                this.onConfirm = this.onCancel;
              }
            };
          } catch (error) {
            this.isConfirming = true;
            this.confirmContent = `${error.message || error}
Invalid coupon code! Redirecting to your account page...`;
            this.onConfirm = this.onCancel;
          }
        } else {
          this.$router.push({ name: 'edit' });
        }
      } catch (err) {
        console.error(err);
      }
    },
  },
  mounted() {
    this.isRedeem = this.$route.name === 'redeem';
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

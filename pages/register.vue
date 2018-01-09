<template>
  <div class="hello">
    <md-toolbar class="md-layout" v-if="errMsg"><md-progress-spinner md-mode="indeterminate" class="md-warn" /><md-icon class="md-warn">warning</md-icon><div class="md-layout-item" v-html="errMsg" /></md-toolbar>
    <div class="inner-container">
      <div v-if="isPreview" class="avatar-preview">
        <md-card-media>
          <img :src="avatarData" >
        </md-card-media>
      </div>
      <form id="registerForm" v-on:submit.prevent="onSubmit">
        <md-field>
          <label>Image upload</label>
          <md-file v-model="avatar" @md-change="previewImage($event)" accept="image/*"></md-file>
        </md-field>
        <md-field>
          <label>Username</label>
          <md-input v-model="user" required></md-input>
        </md-field>
        <md-field>
          <label>Display Name</label>
          <md-input v-model="displayName" required></md-input>
        </md-field>
        <md-field :class="isBadAddress?'md-input-invalid':''">
          <label>ETH wallet address</label>
          <md-input v-model="wallet" maxlength="42" required />
          <span v-if="isBadAddress" class="md-error">Invalid address format</span>
        </md-field>

        <hr />
        <md-button class="md-raised" type="submit" form="registerForm">Submit</md-button>
      </form>
    </div>
  </div>
</template>

<script>
import EthHelper from '@/util/EthHelper';
import * as api from '@/util/api/api';
import FileHelper from '@/util/FileHelper';

export default {
  name: 'Register',
  data() {
    return {
      errMsg: '',
      avatarFile: null,
      avatar: null,
      avatarData: null,
      user: '',
      displayName: '',
      wallet: EthHelper.getWallet() || '0x81f9b6c7129cee90fed5df241fa6dc4f88a19699',
      isBadAddress: false,
      isPreview: false,
    };
  },
  methods: {
    setMyLikeCoin(wallet) {
      this.wallet = wallet;
    },
    checkAddress() {
      return this.wallet.length === 42 && this.wallet.substr(0, 2) === '0x';
    },
    previewImage(files) {
      if (files && files[0]) {
        [this.avatarFile] = Object.values(files);
        const reader = new FileReader();
        reader.onload = (e) => {
          this.avatarData = e.target.result;
          this.isPreview = true;
        };
        reader.readAsDataURL(files[0]);
      }
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
        await api.apiPostNewUser(data);
      } catch (err) {
        this.errorMsg = err.message || err.response.data;
        console.error(err);
      }
    },
  },
  mounted() {
    EthHelper.initApp(
      (err) => {
        if (err === 'web3') this.errMsg = this.web3Error;
        else if (err === 'testnet') this.errMsg = this.testnetError;
        else if (err === 'locked') this.errMsg = this.lockedError;
      },
      () => {
        this.errMsg = '';
      },
    );
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

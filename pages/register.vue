<template>
  <div class="inner-container">
    <div id="has-account">
      <nuxt-link :to="{ name: 'edit' }"> {{ hasAccountMsg }}</nuxt-link>
    </div>
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
      <md-field :class="isBadAddress?'md-invalid':''">
        <label>ETH wallet address</label>
        <md-input v-model="wallet" maxlength="42" required disabled />
        <span v-if="isBadAddress" class="md-error">Invalid address format</span>
      </md-field>

      <hr />
      <div id="form-btn">
        <md-button class="md-raised" type="submit" form="registerForm">Submit</md-button>
      </div>
    </form>
  </div>
</template>

<script>
import EthHelper from '@/util/EthHelper';
import FileHelper from '@/util/FileHelper';
import { mapActions } from 'vuex';

export default {
  name: 'Register',
  data() {
    return {
      hasAccountMsg: 'I already have a LikeCoin account',
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
    ...mapActions([
      'newUser',
    ]),
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
        await this.newUser(data);
        this.$router.push({ path: user });
      } catch (err) {
        console.error(err);
      }
    },
  },
  mounted() {
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

</style>

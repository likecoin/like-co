<template>
  <div class="inner-container">
    <form id="registerForm" v-on:submit.prevent="onSubmit">
      <div class="md-layout">
        <div class="icon">
          <img v-if="avatarData" class="avatar":src="avatarData" />
          <md-button @click="openPicker"><md-icon class="md-size-2x">file_upload</md-icon></md-button>
          <input type="file" ref="inputFile" accept="image/*" @change="previewImage" />
        </div>
        <div class="md-layout md-layout-item">
          <div class="md-layout-item">
            <md-field>
              <label>Create a LikeCoin ID* (minimum 7 character)</label>
              <md-input v-model="user" pattern="[a-z0-9-_]{7,20}" :disabled="isEdit" @change="user=user.toLowerCase()"
                title="Please enter at least 7 alphanumeric characters" required />
            </md-field>
            <md-field :class="isBadAddress?'md-invalid':''">
              <label>ETH wallet address</label>
              <md-input v-model="wallet" maxlength="42" required disabled />
              <span v-if="isBadAddress" class="md-error">Invalid address format</span>
            </md-field>
            <div v-if="isEdit && !isNaN(likeCoinBalance) && !isRedeemingCoupon">
              Amount of LikeCoin:
              <a :href="`https://rinkeby.etherscan.io/address/${wallet}#tokentxns`" target="_blank">{{ likeCoinBalance }}</a>
            </div>
            <md-field>
              <label>Email (Optional)</label>
              <md-input type="email" v-model="email" />
            </md-field>
            <md-field v-if="isEdit && !isRedeemingCoupon">
              <label>Display Name</label>
              <md-input v-model="displayName" required></md-input>
            </md-field>
            <md-field v-if="isRedeem || isEdit">
              <label><span v-if="isEdit"> Claim </span> Coupon Code (Optional)</label>
              <md-input v-model="couponCode" pattern="[2-9A-HJ-NP-Za-km-z]{8}"></md-input>
            </md-field>
          </div>
        </div>
      </div>
      <div id="form-btn">
        <md-button class="md-raised md-primary" id="confirm-btn" type="submit" form="registerForm" :disabled="getIsPopupBlocking">Confirm</md-button>
      </div>
    </form>
    <claim-dialog ref="claimDialog" :couponCode="couponCode" :wallet="wallet" />
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';

import EthHelper from '@/util/EthHelper';
import User from '@/util/User';
import ClaimDialog from '~/components/ClaimDialog';
import { mapActions, mapGetters } from 'vuex';
import { toDataUrl } from 'ethereum-blockies';

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
      email: '',
      displayName: '',
      couponCode: '',
      likeCoinBalance: NaN,
      wallet: EthHelper.getWallet(),
      isBadAddress: false,
      isConfirming: false,
      confirmContent: '',
      onConfirm: () => {},
    };
  },
  components: {
    ClaimDialog,
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getIsPopupBlocking',
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
        };
        const data = await User.formatAndSignUserInfo(userInfo);
        await this.newUser(data);
        await this.isUser(this.wallet);
        if (this.couponCode) {
          this.setTxDialogAction({ txDialogRouteTo: { name: 'edit' }, txDialogRouteText: 'View Account' });
          await this.$refs.claimDialog.onSubmit();
        } else {
          this.setInfoMsg(`Your information have been updated,  <a href="/pay/${this.user}">view your page</a>`);
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
  watch: {
    isEdit(e) {
      if (e && !this.isRedeemingCoupon) {
        this.$router.replace({ name: 'edit' });
      }
    },
  },
};

</script>

<style scoped>
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
  padding: 40px;
  margin-top: -20px;
}

#confirm-btn {
  background-color: #28646e;
}

.avatar {
  display: inline;
  margin: 0 auto;
  height: 100%;
  width: auto;
}

.icon {
  position: relative;
  width: 128px;
  height: 128px;
  overflow: hidden;
  margin: 20px;
  border-radius: 50%;
}

.icon .md-button {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  margin: auto;
  opacity: .3;
}

.icon .md-button:hover {
  color: white;
  opacity: 1;
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

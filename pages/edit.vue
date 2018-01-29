<template>
  <div class="container">
    <form id="editForm" v-on:submit.prevent="onSubmitEdit">
      <div class="md-layout">
        <div class="icon">
          <img class="avatar" :src="avatarData" />
          <md-button :class="isProfileEdit ? '' : 'input-display-btn'" @click="openPicker"><img :src="EditIcon" class="md-size-2x"/></md-button>
          <input type="file" ref="inputFile" accept="image/*" @change="previewImage" />
        </div>
        <div class="user-container">
          <div :class="[isProfileEdit ? 'edit-mode' : '', 'user-content']">LikeCoin ID:&nbsp;</div>
          <div :class="[isProfileEdit ? 'edit-mode' : '', 'user-content']">{{ user }}</div>
          <md-field :class="isProfileEdit ? 'md-field-edit-mode' : 'md-field-pre-edit'">
            <md-input class="input-display-name input-display" v-model="displayName" required
                                                               :disabled="!isProfileEdit"></md-input>
            <md-button :class="isProfileEdit ? '' : 'input-display-btn'"
                                                               @click="setEditProfileMode(true)"><img :src="EditIcon" /></md-button>
          </md-field>
        </div>
      </div>
      <like-coin-amount class="amount-section" :value="likeCoinValueStr" :isOpaque="isProfileEdit"
                        :linkHref="!isProfileEdit ? 'https://likecoin.foundation/#/' : ''"
                        :linkText="!isProfileEdit ? 'Buy LikeCoin' : ''" />
      <div class="address-container">
        <div :class="[isProfileEdit ? 'edit-mode' : '', 'address-title']">Your Address</div>
        <md-field class="md-field-display">
          <md-input :class="isProfileEdit ? 'edit-mode' : ''" v-model="wallet" required disabled></md-input>
        </md-field>
        <div class="address-title">Your E-mail</div>
        <md-field :class="isProfileEdit ? 'md-field-edit-mode' : 'md-field-pre-edit'">
          <label class="input-display-hint">add email address</label>
          <md-input class="input-display" v-model="email" :disabled="!isProfileEdit"></md-input>
          <md-button :class="isProfileEdit ? '' : 'input-display-btn'"
                                          @click="setEditProfileMode(true)"><img :src="EditIcon" /></md-button>
        </md-field>
      </div>
      <div v-if="isProfileEdit" class="btn-container">
        <div class="edit-form-btn">
          <md-button class="md-raised md-primary" id="edit-confirm-btn" type="submit" form="editForm" :disabled="getIsPopupBlocking">Confirm</md-button>
        </div>
        <div class="edit-form-btn">
          <md-button class="md-raised md-accent" id="edit-cancel-btn" :disabled="getIsPopupBlocking" @click="onCancel">Cancel</md-button>
        </div>
      </div>
    </form>
    <div :class="isProfileEdit ? 'section-redeem-edit-mode' : ''">
      <div class="section-title-wrapper">
        <h2 class="title">{{ subtitle }}</h2>
      </div>
      <form id="redeemForm" v-on:submit.prevent="onSubmitCoupon">
        <md-field>
          <label><span> Claim </span> Coupon Code</label>
          <md-input v-model="couponCode" required ></md-input>
        </md-field>
        <div v-if="!isProfileEdit" id="form-btn">
          <md-button class="md-raised md-primary" id="confirm-btn" type="submit" form="redeemForm" :disabled="getIsInTransaction">Confirm</md-button>
        </div>
      </form>
      <claim-dialog ref="claimDialog" :couponCode="couponCode" :wallet="wallet" />
    </div>
    <view-etherscan :address="wallet" />
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';

import EthHelper from '@/util/EthHelper';
import User from '@/util/User';
import LikeCoinAmount from '~/components/LikeCoinAmount';
import ClaimDialog from '~/components/ClaimDialog';
import ViewEtherscan from '~/components/ViewEtherscan';
import { mapActions, mapGetters } from 'vuex';

import EditIcon from '../assets/icons/edit.svg';

const ONE_LIKE = new BigNumber(10).pow(18);

export default {
  name: 'Edit',
  layout: 'baseWithBackground',
  data() {
    return {
      avatarFile: null,
      avatarData: null,
      user: '',
      displayName: '',
      couponCode: '',
      wallet: '',
      email: '',
      isProfileEdit: false,
      likeCoinValueStr: '',
      subtitle: 'Redeem LikeCoin',
      EditIcon,
    };
  },
  components: {
    LikeCoinAmount,
    ClaimDialog,
    ViewEtherscan,
  },
  async fetch({ store, redirect }) {
    if (!store.getters.getUserIsRegistered) {
      redirect('/register');
    }
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getIsInTransaction',
      'getIsPopupBlocking',
    ]),
  },
  methods: {
    ...mapActions([
      'newUser',
      'setInfoMsg',
      'checkCoupon',
      'refreshUserInfo',
    ]),
    setEditProfileMode(isProfileEdit) {
      this.isProfileEdit = isProfileEdit;
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
    async updateInfo() {
      const user = this.getUserInfo;
      this.user = user.user;
      this.displayName = user.displayName;
      this.avatarData = user.avatar;
      this.wallet = user.wallet;
      this.email = user.email;
      const balance = await EthHelper.queryLikeCoinBalance(user.wallet);
      this.likeCoinValueStr = new BigNumber(balance).dividedBy(ONE_LIKE).toFixed(4);
    },
    openPicker() {
      this.setEditProfileMode(true);
      this.$refs.inputFile.click();
    },
    onCancel() {
      this.avatarFile = null;
      this.updateInfo();
      this.setEditProfileMode(false);
    },
    async onSubmitEdit() {
      try {
        const userInfo = {
          avatarFile: this.avatarFile,
          user: this.user,
          displayName: this.displayName,
          wallet: this.wallet,
          email: this.email,
        };
        const data = await User.formatAndSignUserInfo(userInfo);
        await this.newUser(data);
        this.setInfoMsg(`Your information have been updated,  <a href="/pay/${this.user}">view your page</a>`);
        this.refreshUserInfo(this.user);
      } catch (err) {
        console.error(err);
      }
      this.setEditProfileMode(false);
    },
    async onSubmitCoupon() {
      try {
        await this.$refs.claimDialog.onSubmit();
      } catch (err) {
        console.error(err);
      }
    },
  },
  mounted() {
    this.updateInfo();
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/index.scss";
@import "../assets/default.scss";

$profile-margin: 48px;

.container{
  margin-left: 0px;
}

#editForm {
  padding: 0px;
  .user-container {
    margin-top: 20px;
    width: 40%;
  }
  
  .edit-mode {
    opacity: 0.3;
  }

  .user-content {
    float: left;
    font-size: 20px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
  }

  .input-display-btn {
    opacity: 0;
    &:hover {
      opacity: 1;
    }
  }

  .input-display:hover + .input-display-btn {
    opacity: 1;
  }

  .md-field-edit-mode {
    padding-top: 0px;
    margin-bottom: 0px;
    &:after {
      height: 1px;
    }
  }

  .md-field-display {
    padding-top: 0px;
    margin-bottom: 0px;
    &:after {
      height: 0px;
    }
    label {
      top: 0px;
    }
  }

  .md-field-pre-edit {
    padding-top: 0px;
    margin-bottom: 0px;
    &:after {
      background-color: #28646e;
      opacity: 0.3;
    }
    label {
      top: 0px;
    }
  }

  .input-display-name {
    height: 50px;
    font-size: 42px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.21;
    letter-spacing: -0.4px;
    text-align: left;
    color: #462814;
    -webkit-text-fill-color: #462814;
  }

  .amount-section {
    margin-top: -24px;
  }

  .address-container {
    margin: 17px $profile-margin;
    width: 50%;
    float: left;
  }
  
  .btn-container {
    margin: 17px 41px;
    width: 30%;
    float: left;
    padding-top: 56px;
  }
  
  .address-title {
    font-size: 14px;
    margin: 5px -5px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #462814;
  }

  .md-has-value .input-display-hint {
    opacity: 0;
  }
   
  .md-focused .input-display-hint {
    opacity: 0;
  }

  #edit-confirm-btn {
    width: 256px;
    height: 40px;
    background-color: #28646e;
  }

  #edit-cancel-btn {
    width: 256px;
    height: 40px;
    background-color: #6e2828;
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
    margin-left: $profile-margin;
    margin-right: $profile-margin;
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
  }
  
  .icon .md-button:hover {
    color: white;
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
}

@media (max-width: 768px) {
  #editForm {
    .user-container {
      width: 90%;
	}
  }
}

.section-redeem-edit-mode {
  opacity: 0.3;
}

.section-title-wrapper {
  display: inline-block;
  z-index: 1;
  margin-top: 60px;

  padding: 0 80px;

  text-align: center;

  background-color: $like-light-blue;
  width: 50%;

  > .title {
    letter-spacing: -0.3px;

    color: $like-dark-brown;

    font-size: 32px;
    line-height: 48px;
    font-weight: 300;
    font-size: 2.5em;
    margin: 0;
  }
}

#redeemForm {
  background-color: #f7f7f7;
  padding: 40px 20px 20px 20px;
  margin-top: -20px;
  
  #form-btn {
    text-align: right;
  
    #confirm-btn {
      width: 256px;
      height: 40px;
      background-color: #28646e;
    }
  }
}
</style>

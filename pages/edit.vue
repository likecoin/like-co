<template>
  <div class="edit-form-container">
    <form id="editForm" @keydown.esc="onCancel" @submit.prevent="onSubmitEdit">
      <div class="upper-left-corner" />
      <div class="md-layout">
        <div class="icon">
          <img class="avatar" :src="avatarData" />
          <md-button
            :class="isProfileEdit ? '' : 'input-display-btn'"
            @click="openPicker">
            <img :src="EditWhiteIcon" />
          </md-button>
          <input type="file" ref="inputFile" accept="image/*" @change="previewImage" />
        </div>
        <div class="user-container">
          <div class="md-layout">
            <div :class="[isProfileEdit ? 'edit-mode' : '', 'user-content']">
              LikeCoin ID:&nbsp;
            </div>
            <nuxt-link :to="{ name: 'id', params: { id: user } }">
              <div :class="[isProfileEdit ? 'edit-mode' : '', 'user-content']">{{ user }}</div>
            </nuxt-link>
          </div>
          <div @click="onEditDisplayName">
            <md-field :class="isProfileEdit ? 'md-field-edit-mode' : 'md-field-pre-edit'">
              <md-input
                ref="inputDisplayName"
                class="input-display-name input-display"
                v-model="displayName"
                :disabled="!isProfileEdit"
                required />
              <md-button
                :class="isProfileEdit ? '' : 'input-display-btn'"
                @click="onEditDisplayName"
                v-if="!isProfileEdit">
                <img :src="EditIcon" />
              </md-button>
            </md-field>
          </div>
        </div>
      </div>

      <like-coin-amount
        class="amount-section"
        :value="likeCoinValueStr"
        :isOpaque="isProfileEdit"
        :linkHref="!isProfileEdit ? getAmountHref : ''"
        :linkText="!isProfileEdit ? getAmountText : ''"
        @getCoupon="onGetCoupon" />

      <div class="address-section">
        <div :class="`address-container${isProfileEdit ? ' edit' : ''}`">
          <div class="address-field">
            <div :class="[isProfileEdit ? 'edit-mode' : '', 'address-title']">Your Address</div>
            <md-field class="md-field-display">
              <md-input
                :class="[isProfileEdit ? 'edit-mode' : '', 'input-info']"
                v-model="wallet"
                required
                disabled />
            </md-field>
          </div>
          <div class="address-field" @click="onEditEmail">
            <div class="address-title">
              Your E-mail
              <span class="verified" v-if="getUserInfo.isEmailVerified"><md-icon>check</md-icon>Verified</span>
              <span v-else-if="isVerifying">(Verfication sent, Please check your inbox!)</span>
              <span v-else-if="email">(Unverifed, <a href="" @click.prevent.stop="onVerifyEmail">Verify your email</a>)</span>
            </div>
            <md-field :class="isProfileEdit ? 'md-field-edit-mode' : 'md-field-pre-edit'">
              <label class="input-display-hint">Add email address</label>
              <md-input type="email" class="input-display input-info" v-model="email" ref="inputEmail"
                                                                      :disabled="!isProfileEdit"></md-input>
              <md-button
                :class="isProfileEdit ? '' : 'input-display-btn'"
                @click="onEditEmail"
                v-if="!isProfileEdit">
                <img :src="EditIcon" />
              </md-button>
            </md-field>
          </div>
        </div>

        <div v-if="isProfileEdit" class="btn-container">
          <div class="edit-form-btn">
            <md-button class="md-raised md-primary" id="edit-confirm-btn" type="submit" form="editForm" :disabled="getIsPopupBlocking">Confirm</md-button>
          </div>
          <div class="edit-form-btn">
            <md-button class="md-raised md-accent" id="edit-cancel-btn" :disabled="getIsPopupBlocking" @click="onCancel">Cancel</md-button>
          </div>
        </div>
      </div>
    </form>

    <div :class="isProfileEdit ? 'section-redeem-edit-mode' : ''">
      <div class="section-title-wrapper">
        <h2 class="title">{{ subtitle }}</h2>
      </div>
      <form id="redeemForm" v-on:submit.prevent="onSubmitCoupon">
        <md-field>
          <label class="input-redeem-hint">Redeem Code (Optional)</label>
          <md-input v-model="couponCode" title="Please enter a valid coupon code"
            pattern="[2-9A-HJ-NP-Za-km-z]{8}" required :disabled="isProfileEdit"></md-input>
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
import EditWhiteIcon from '../assets/icons/edit-white.svg';

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
      isVerifying: false,
      likeCoinValueStr: '',
      subtitle: 'Redeem LikeCoin',
      EditIcon,
      EditWhiteIcon,
      isSentCoupon: true,
      isTriggerGetCoupon: false,
      isDirectClaim: false,
    };
  },
  components: {
    LikeCoinAmount,
    ClaimDialog,
    ViewEtherscan,
  },
  async fetch({ store, redirect }) {
    if (!store.getters.getUserIsRegistered) {
      redirect({ name: 'register' });
    }
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getIsInTransaction',
      'getIsPopupBlocking',
    ]),
    getAmountHref() {
      return this.isSentCoupon ? 'https://likecoin.foundation/#/' : '';
    },
    getAmountText() {
      return this.isSentCoupon ? 'Buy LikeCoin' : 'Get free LikeCoin';
    },
  },
  methods: {
    ...mapActions([
      'newUser',
      'setInfoMsg',
      'checkCoupon',
      'sendVerifyEmail',
      'refreshUserInfo',
      'checkIsSentCoupon',
      'getCouponCode',
      'sendCouponCodeEmail',
    ]),
    onEditDisplayName() {
      if (this.isProfileEdit) {
        this.$nextTick(() => this.$refs.inputDisplayName.$el.focus());
        return;
      }
      this.isProfileEdit = !this.isProfileEdit;
      if (this.isProfileEdit) {
        this.$nextTick(() => this.$refs.inputDisplayName.$el.focus());
      }
    },
    onEditEmail() {
      if (this.isProfileEdit) {
        this.$nextTick(() => this.$refs.inputEmail.$el.focus());
        return;
      }
      this.isProfileEdit = !this.isProfileEdit;
      if (this.isProfileEdit) {
        this.$nextTick(() => this.$refs.inputEmail.$el.focus());
      }
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
      const isSentCouponRes = await this.checkIsSentCoupon(this.user);
      if (isSentCouponRes.isSent !== null) {
        this.isSentCoupon = isSentCouponRes.isSent;
      }
    },
    openPicker() {
      this.isProfileEdit = true;
      this.$refs.inputFile.click();
    },
    onCancel() {
      this.avatarFile = null;
      this.updateInfo();
      this.isProfileEdit = false;
    },
    onVerifyEmail() {
      this.sendVerifyEmail(this.user);
      this.isVerifying = true;
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
        this.setInfoMsg(`Your information have been updated,  <a href="/${this.user}">view your page</a>`);
        this.refreshUserInfo(this.user);
        this.isProfileEdit = false;
        if (this.isTriggerGetCoupon) {
          this.isTriggerGetCoupon = false;
          await this.submitGetCoupon();
        }
      } catch (err) {
        console.error(err);
      }
    },
    async onSubmitCoupon() {
      try {
        await this.$refs.claimDialog.onSubmit();
      } catch (err) {
        console.error(err);
      }
    },
    async onGetCoupon() {
      if (this.isSentCoupon) {
        return;
      }
      if (!this.email) {
        this.isProfileEdit = true;
        this.isTriggerGetCoupon = true;
      } else {
        await this.submitGetCoupon();
      }
    },
    async submitGetCoupon() {
      if (this.isSentCoupon) {
        return;
      }
      try {
        const couponRes = await this.getCouponCode(this.user);
        if (couponRes.coupon) {
          if (this.getUserInfo.isEmailVerified) {
            // directly claim
            this.couponCode = couponRes.coupon;
            this.isDirectClaim = true;
            await this.$refs.claimDialog.onClaimCoupon();
          } else {
            await this.sendCouponCodeEmail({
              user: this.user,
              coupon: couponRes.coupon,
            });
          }
        }
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
@import "../assets/index";
@import "../assets/default";

$profile-margin: 48px;
$profile-icon-size: 128px;

.verified {
  color: $like-green-2;
  .md-icon {
    color: $like-green-2;
  }
}

.edit-form-container {
  display: flex;
  flex-direction: column;

  #editForm {
    position: relative;

    display: flex;
    flex-direction: column;

    > .md-layout {
      display: flex;
      align-items: center;
      flex-direction: row;

      width: 66.66%;
    }

    .user-container {
      overflow: hidden;
      flex: 1;

      padding-right: 64px;

      div > .user-content {
        color: $like-gray-5;

        font-size: 20px;
      }

      a {
        text-decoration: none;

        font-size: 20px;
      }

      .md-field {
        align-items: center;
      }
    }

    .edit-mode {
      opacity: 0.3;
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

    .md-field {
      &.md-field-pre-edit {
        margin-bottom: 0px;
        padding-top: 0px;

        &:after {
          display: none;
        }

        label {
          font-size: 20px;
        }

        .input-info {
          height: auto;

          font-size: 20px;
        }
      }

      .input-display-name {
        overflow: hidden;

        height: auto;

        white-space: nowrap;
        text-overflow: ellipsis;

        color: $like-dark-brown-1;

        font-size: 42px;
        font-weight: 600;

        -webkit-text-fill-color: $like-dark-brown-1;
      }

      .md-button {
        min-width: unset;
      }
    }

    .md-field-edit-mode {
      margin-bottom: 0px;
      padding-top: 0px;
      &:after {
        height: 1px;
      }
      label {
        font-size: 20px;
      }
      .input-info {
        height: auto;

        font-size: 20px;
      }
    }

    .md-field-display {
      margin-bottom: 0px;
      padding-top: 0px;
      &:after {
        height: 0px;
      }
      .input-info {
        font-size: 20px;
      }
    }

    .amount-section {
      display: flex;
      flex-direction: column;

      margin-top: -12px;
    }

    .address-section {
      display: flex;
      flex-direction: row;

      margin: 0 48px 32px;

      .address-container {
        &.edit {
          flex: 2;

          padding-right: 64px;
        }
      }

      .btn-container {
        align-self: flex-end;
        flex: 1;

        .edit-form-btn {
          > button {
            width: 100%;
            height: 40px;
            margin: 8px 0 0;

            font-size: 24px;
          }

          #edit-confirm-btn {
            background-color: #28646e;
          }

          #edit-cancel-btn {
            background-color: #6e2828;
          }
        }
      }
    }

    .address-container {
      display: flex;
      flex-direction: column;

      width: 66%;
      margin: -12px 0 0;

      &.edit {
        margin-top: 12px;
      }

      .address-title {
        color: $like-dark-brown-1;

        font-size: 14px;
      }

      .md-field {
        min-height: 36px;
      }

      .address-field {
        margin-top: 16px;
        .input-display-hint {
          margin-top: -20px;
        }

        .md-has-value .input-display-hint {
          opacity: 0;
        }

        .md-focused .input-display-hint {
          opacity: 0;
        }
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

      width: $profile-icon-size;
      height: $profile-icon-size;
      margin-right: $profile-margin;
      margin-left: $profile-margin;

      border: 1px solid rgba(0,0,0, 0.2);
      border-radius: 50%;
    }

    .icon .md-button {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;

      width: 100%;
      height: 100%;
      margin: auto;
    }

    .icon .md-button:hover {
      color: white;
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
  }

  .section-title-wrapper {
    margin-left: 40px;
  }
}


.section-redeem-edit-mode {
  opacity: .3;
}

#redeemForm {
  margin-top: -20px;
  padding: 40px 40px 32px;

  background-color: $like-gray-1;

  .input-redeem-hint {
    font-size: 20px;
  }

  #form-btn {
    text-align: right;

    .md-button {
      margin: 24px 0;
    }

    #confirm-btn {
      width: calc(33.33% - 16px);
      height: 40px;

      background-color: $like-green;

      font-size: 24px;
    }
  }
}

body .md-button {
  border-radius: 0;
}

@media (max-width: 1024px) {
  .edit-form-container #editForm {
    > .md-layout {
      width: 100%;
      .user-container {
      }
    }
    .address-container {
      width: 100%;
    }
  }
}

</style>

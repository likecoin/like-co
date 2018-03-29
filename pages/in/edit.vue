<template>
  <div class="edit-form-container">
    <div class="lc-container-1">
      <div class="upper-left-corner lc-mobile-hide" />
      <div class="lc-container-2">

        <form
          id="editForm"
          class="lc-padding-bottom-32 lc-padding-bottom-0-mobile"
          @keydown.esc="onCancel"
          @submit.prevent="onSubmitEdit">

          <!-- BEGIN - User info section -->
          <div class="lc-container-3">
            <div class="lc-container-4">
              <section class="user-info-section">

                <div class="user-avatar-wrapper">
                  <img class="avatar" :src="avatarData" />
                  <md-button
                    :class="{ 'input-display-btn': !isProfileEdit }"
                    @click="openPicker">
                    <img :src="EditWhiteIcon" />
                  </md-button>
                  <input type="file" ref="inputFile" accept="image/*" @change="previewImage" />
                </div>

                <div class="user-identity">
                  <div :class="['likecoin-id', 'lc-tablet-hide', 'lc-font-size-20', { disabled: isProfileEdit }]">
                    <span class="user-id-label">
                      {{ $t('Edit.label.id') }}&nbsp;
                    </span>
                    <nuxt-link v-if="user" :to="{ name: 'id', params: { id: user } }">
                      {{ user }}
                    </nuxt-link>
                  </div>

                  <div @click="onEditDisplayName">
                    <md-field :class="['lc-margin-bottom-4', 'lc-padding-top-0', isProfileEdit ? 'md-field-edit-mode' : 'md-field-pre-edit']">
                      <md-input
                        ref="inputDisplayName"
                        class="input-display-name input-display"
                        v-model="displayName"
                        :disabled="!isProfileEdit"
                        required />
                      <md-button
                        :class="['lc-tablet-hide', { 'input-display-btn': !isProfileEdit }]"
                        @click="onEditDisplayName"
                        v-if="!isProfileEdit">
                        <img :src="EditIcon" />
                      </md-button>
                    </md-field>
                  </div>
                </div>

              </section>
            </div>
          </div>
          <!-- END - User info section -->

          <like-coin-amount
            class="likecoin-amount-section"
            :value="likeCoinValueStr"
            :isOpaque="isProfileEdit"
            :linkHref="!isProfileEdit ? getAmountHref : ''"
            :linkText="!isProfileEdit ? getAmountText : ''"
            @onTextClick="getAmountAction" />

          <input-dialog
            ref="inputDialog"
            :text="email"
            type="email"
            :title="$t('Dialog.emailInput.title')"
            :content="$t('Dialog.emailInput.content')"
            :label="$t('Dialog.emailInput.label')"
            @confirm="onInputDialogConfirm" />

          <div class="lc-container-3">
            <div class="lc-container-4">
              <div class="address-section">
                <div :class="['address-container', { edit: isProfileEdit }]">
                  <div class="address-field likecoin-id lc-tablet-show">
                    <div class="address-title">
                      {{ $t('Edit.label.id') }}
                    </div>
                    <nuxt-link v-if="user" :to="{ name: 'id', params: { id: user } }">
                      <div :class="['lc-font-size-20', { disabled: isProfileEdit }]">
                        {{ user }}
                      </div>
                    </nuxt-link>
                  </div>
                  <div class="address-field">
                    <div :class="['address-title', { disabled: isProfileEdit }]">
                      {{ $t('Edit.label.address') }}
                    </div>
                    <md-field class="md-field-display">
                      <md-input
                        :class="['input-info', { disabled: isProfileEdit }]"
                        v-model="wallet"
                        required
                        disabled />
                    </md-field>
                  </div>
                  <div class="address-field" @click="onEditEmail">
                    <div class="address-title">
                      {{ $t('Edit.label.email') }}
                      <span v-if="!isProfileEdit">
                        <span class="verified" v-if="getUserInfo.isEmailVerified">
                          <img :src="TickIcon" />
                          {{ $t('Edit.label.verified') }}
                        </span>
                        <span v-else-if="isVerifying">
                          {{ $t('Edit.label.verifying') }}
                        </span>
                        <span v-else-if="email">
                          ({{ $t('Edit.label.unverified') }})
                          <a href="" @click.prevent.stop="onVerifyEmail">
                            {{ $t('Edit.label.verifyEmail') }}
                          </a>
                        </span>
                      </span>
                    </div>
                    <md-field :class="(!getUserInfo.isEmailVerified && isProfileEdit) ? 'md-field-edit-mode' : 'md-field-pre-edit'">
                      <label class="input-display-hint lc-font-size-20">
                        {{ $t('Edit.label.addEmail') }}
                      </label>
                      <md-input
                        type="email"
                        class="input-display input-info"
                        v-model="email"
                        ref="inputEmail"
                        :disabled="getUserInfo.isEmailVerified || !isProfileEdit" />
                      <md-button
                        :class="{ 'input-display-btn': !isProfileEdit }"
                        @click="onEditEmail"
                        v-if="!getUserInfo.isEmailVerified && !isProfileEdit">
                        <img :src="EditIcon" />
                      </md-button>
                    </md-field>
                  </div>
                </div>

                <div v-if="isProfileEdit" class="btn-container">
                  <div class="edit-form-btn">
                    <material-button
                      type="submit"
                      form="editForm"
                      :disabled="getIsPopupBlocking">
                      {{ $t('General.button.confirm') }}
                    </material-button>
                  </div>
                  <div class="edit-form-btn lc-margin-top-8">
                    <material-button
                      id="edit-cancel-btn"
                      :disabled="getIsPopupBlocking"
                      @click="onCancel">
                      {{ $t('General.button.cancel') }}
                    </material-button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </form>
      </div>
    </div>

<!--     <transaction-history
      ref="txHistory"
      :address="wallet"
      :showTokensale="true"
      /> -->

    <div :class="['lc-margin-top-48', 'lc-mobile', { disabled: isProfileEdit }]" id="coupon">
      <section class="lc-container-1">

        <div class="lc-container-header">
          <div class="lc-container-2 lc-container-header-overlay">
            <div class="lc-container-3 lc-bg-gray-1" />
          </div>
          <div class="lc-container-2">
            <div class="lc-container-3">
              <div class="lc-container-4">
                <div class="lc-container-header-title">
                  <h1 class="lc-font-size-32 lc-mobile">
                    {{ $t('Edit.label.redeemCoin') }}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1 lc-padding-vertical-32 section-content">
            <div class="lc-container-4">
              <form id="redeemForm" v-on:submit.prevent="onSubmitCoupon">
                <md-field>
                  <label class="input-redeem-hint lc-font-size-20">
                    {{ $t('Edit.label.redeemCode') }}
                  </label>
                  <md-input
                    pattern="[2-9A-HJ-NP-Za-km-z]{8}"
                    v-model="couponCode"
                    :disabled="isProfileEdit"
                    :title="$t('Edit.label.validCodeRequired')"
                    required />
                </md-field>
                <div v-if="!isProfileEdit" id="form-btn" class="lc-padding-top-48">
                  <material-button
                    id="confirm-btn"
                    type="submit"
                    form="redeemForm"
                    :disabled="getIsInTransaction">
                    {{ $t('General.button.confirm') }}
                  </material-button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <claim-dialog
        ref="claimDialog"
        :couponCode="couponCode"
        :wallet="wallet" />
    </div>


    <div class="referral-form-container lc-margin-top-48 lc-mobile" id="referral">
      <div :class="{ disabled: isProfileEdit }">

        <section class="lc-container-1">
          <div class="lc-container-header">
            <div class="lc-container-2 lc-container-header-overlay">
              <div class="lc-container-3 lc-bg-gray-1" />
            </div>
            <div class="lc-container-2">
              <div class="lc-container-3">
                <div class="lc-container-4">
                  <div class="lc-container-header-title">
                    <h1 class="lc-font-size-32 lc-mobile">
                      {{ $t('Edit.referral.title') }}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="lc-container-2">
            <div class="lc-container-3 lc-bg-gray-1 lc-padding-vertical-32 section-content">
              <div class="lc-container-4">
                <referral-action
                  :user="user"
                  :pending="referralPending"
                  :verified="referralVerified"
                  :isEmailVerified="getUserInfo.isEmailVerified"
                  :isProfileEdit="isProfileEdit"
                  :isBlocked="getIsPopupBlocking"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <view-etherscan :address="wallet" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';

import EthHelper from '@/util/EthHelper';
import User from '@/util/User';
import { logTrackerEvent } from '@/util/EventLogger';
import LikeCoinAmount from '~/components/LikeCoinAmount';
import MaterialButton from '~/components/MaterialButton';
import ReferralAction from '~/components/ReferralAction';
import ClaimDialog from '~/components/dialogs/ClaimDialog';
import InputDialog from '~/components/dialogs/InputDialog';
// import TransactionHistory from '~/components/TransactionHistory';
import ViewEtherscan from '~/components/ViewEtherscan';

import { ONE_LIKE } from '@/constant';

import EditIcon from '@/assets/icons/edit.svg';
import EditWhiteIcon from '@/assets/icons/edit-white.svg';
import TickIcon from '@/assets/tokensale/tick.svg';

export default {
  name: 'Edit',
  layout: 'defaultWithHeader',
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
      EditIcon,
      EditWhiteIcon,
      TickIcon,
      canGetFreeLikeCoin: false,
      freeCoupon: '',
      referralPending: 0,
      referralVerified: 0,
    };
  },
  components: {
    ClaimDialog,
    InputDialog,
    LikeCoinAmount,
    MaterialButton,
    ReferralAction,
    // TransactionHistory,
    ViewEtherscan,
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getIsInTransaction',
      'getIsPopupBlocking',
      'getCurrentLocale',
      'getUserIsFetching',
      'getUserIsRegistered',
    ]),
    getAmountHref() {
      return this.canGetFreeLikeCoin ? '' : '';
    },
    getAmountText() {
      return this.canGetFreeLikeCoin ? this.$t('Edit.button.getFreeCoin') : this.$t('Edit.button.buyCoin');
    },
    getAmountAction() {
      return this.canGetFreeLikeCoin ? this.onGetCouponClick : this.onClickBuyLikeCoin;
    },
  },
  methods: {
    ...mapActions([
      'newUser',
      'setInfoMsg',
      'checkCoupon',
      'sendVerifyEmail',
      'sendCouponCodeEmail',
      'refreshUserInfo',
      'checkCanGetFreeLikeCoin',
      'fetchUserReferralStats',
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
      if (this.getUserInfo.isEmailVerified) return;
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
      this.updateLikeCoin();
      this.updateReferralStat();
      this.updateCanGetFreeLikeCoin(user);
      // this.$refs.txHistory.updateTokenSaleHistory();
    },
    async updateLikeCoin() {
      try {
        const balance = await EthHelper.queryLikeCoinBalance(this.wallet);
        this.likeCoinValueStr = new BigNumber(balance).dividedBy(ONE_LIKE).toFixed(4);
      } catch (err) {
        console.log(err);
      }
    },
    async updateReferralStat() {
      try {
        const { pending, verified } = await this.fetchUserReferralStats(this.user);
        this.referralPending = pending;
        this.referralVerified = verified;
      } catch (err) {
        console.log(err);
      }
    },
    async updateCanGetFreeLikeCoin(user) {
      try {
        this.canGetFreeLikeCoin = false;
        this.freeCoupon = '';
        if (user.referrer) {
          const res = await this.checkCanGetFreeLikeCoin(this.user);
          if (res.coupon) {
            this.canGetFreeLikeCoin = !res.isClaimed;
            this.freeCoupon = res.coupon;
          } else {
            this.canGetFreeLikeCoin = !user.isEmailVerified && !this.isVerifying;
          }
        }
      } catch (err) {
        console.log(err);
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
    async onVerifyEmail() {
      await this.sendVerifyEmail({ id: this.user, ref: this.$route.query.ref });
      logTrackerEvent(this, 'RegFlow', 'StartEmailVerify', 'click confirm after enter email and the email is valid', 1);
      this.setInfoMsg(this.$t('Edit.label.verifying'));
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
          locale: this.getCurrentLocale,
        };
        const data = await User.formatAndSignUserInfo(userInfo, this.$t('Sign.Message.editUser'));
        await this.newUser(data);
        this.$refs.inputDialog.showDialog = false;
        this.setInfoMsg(`${this.$t('Register.form.label.updatedInfo')}  <a href="/${this.user}">${this.$t('Register.form.label.viewPage')}</a>`);
        this.refreshUserInfo(this.user);
        this.isProfileEdit = false;
      } catch (err) {
        this.updateInfo();
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
    async onGetCouponClick() {
      if (!this.canGetFreeLikeCoin) {
        return;
      }
      logTrackerEvent(this, 'RegFlow', 'ClickGetFreeLikeCoin', 'click get free likecoin', 1);
      if (this.getUserInfo.isEmailVerified) {
        this.submitGetCoupon();
      } else {
        this.$refs.inputDialog.onInputText();
      }
    },
    onClickBuyLikeCoin() {
      this.$router.push({ name: 'in-tokensale' });
    },
    async onInputDialogConfirm(inputText) {
      if (this.email !== inputText) {
        this.email = inputText;
        return this.onSubmitEdit();
      }
      this.$refs.inputDialog.showDialog = false;
      if (this.getUserInfo.isEmailVerified) {
        return this.submitGetCoupon();
      }
      return this.onVerifyEmail();
    },
    async submitGetCoupon() {
      if (!this.canGetFreeLikeCoin || !this.freeCoupon) {
        return;
      }
      try {
        // directly claim
        this.couponCode = this.freeCoupon;
        await this.$refs.claimDialog.onDirectClaimCoupon({
          wallet: this.wallet,
          coupon: this.couponCode,
        });
        logTrackerEvent(this, 'RegFlow', 'GetRedPocketSuccessful', 'redeem the red pocket', 1);
      } catch (err) {
        console.error(err);
      }
    },
  },
  watch: {
    getUserIsFetching(f) {
      if (!f) {
        if (!this.getUserIsRegistered) {
          this.$router.push({ name: 'in-register' });
        } else {
          this.updateInfo();
        }
      }
    },
  },
  mounted() {
    const { hash } = document.location;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) element.scrollIntoView();
    }
    if (!this.getUserIsFetching) {
      if (!this.getUserIsRegistered) {
        this.$router.push({ name: 'in-register' });
      } else {
        if (this.$route.params.showEmail) {
          this.$nextTick(() => this.$refs.inputDialog.onInputText());
        }
        this.updateInfo();
      }
    }
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";
@import "~assets/default";

$profile-margin: 48px;
$profile-icon-size: 128px;
$profile-icon-mobile-size: 88px;

.verified {
  color: $like-green-2;

  .md-icon {
    color: $like-green-2;
  }
}

.edit-form-container {
  > .lc-container-1 {
    width: 100%;
  }

  .lc-container-header-title {
    margin: 0;

    @media (min-width: #{768px + 1px}) {
      width: calc(66.66% - 88px);
    }
  }

  #editForm {
    position: relative;

    .user-info-section {
      display: flex;
      align-items: center;
      flex-direction: row;

      @media (min-width: #{768px + 1px}) {
        width: 66.66%;
      }

      @media (max-width: 768px) {
        flex-direction: column;

        margin-bottom: 40px;
      }
    }

    .user-identity {
      display: flex;
      flex-direction: column;
      flex-grow: 1;

      @media (max-width: 768px) {
        align-items: center;
      }

      .user-id-label {
        color: $like-gray-5;
      }

      .input-display-name {
        @media (max-width: 768px) {
          text-align: center;
        }
      }
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
        &:after {
          display: none;
        }
      }
      &.md-field-edit-mode {
        &:after {
          height: 1px;
        }
      }

      .input-display-name {
        height: auto;

        color: $like-dark-brown-1;

        font-size: 42px;
        font-weight: 600;

        -webkit-text-fill-color: $like-dark-brown-1;

        @media (max-width: 768px) {
          font-size: 32px;
        }
      }

      .md-button {
        min-width: unset;
      }
    }

    .md-field-display {
      margin-bottom: 0px;
      padding-top: 0px;
      &:after {
        height: 0px;
      }
      .input-info {
        overflow: hidden;

        white-space: nowrap;
        text-overflow: ellipsis;

        font-weight: 400;
      }
    }

    .likecoin-amount-section {
      display: flex;
      flex-direction: column;

      margin-top: -12px;
    }

    .address-section {
      display: flex;
      flex-direction: row;

      @media (max-width: 768px) {
        flex-direction: column;

        margin-top: 12px;
      }

      .address-container {
        flex: 2;

        &.edit {
          @media (min-width: 769px) {
            padding-right: 64px;
          }
        }
      }

      .btn-container {
        align-self: flex-end;
        flex: 1;

        @media (max-width: 768px) {
          align-self: center;
          flex-direction: column;

          width: 256px;
          margin-top: 12px;
        }

        .edit-form-btn {
          > button {
            height: 40px;
            margin-left: 0;
          }

          #edit-cancel-btn {
            background-color: $like-gradient-3;
          }
        }
      }
    }

    .address-container {
      display: flex;
      flex-direction: column;

      margin: -12px 0 0;

      &.edit {
        margin-top: 12px;
      }

      .address-title {
        color: $like-dark-brown-1;
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

        &.likecoin-id {
          @media (min-width: 769px) {
            display: none;
          }
        }
      }
    }

    .user-avatar-wrapper {
      position: relative;
      z-index: 2;

      overflow: hidden;
      flex-shrink: 0;

      border: 1px solid rgba(0,0,0, 0.2);
      border-radius: 50%;

      @media (min-width: #{768px + 1px}) {
        width: $profile-icon-size;
        height: $profile-icon-size;
        margin-right: $profile-margin;
      }

      @media (max-width: 768px) {
        width: $profile-icon-mobile-size;
        height: $profile-icon-mobile-size;
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

        &:hover {
          color: $like-white;
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
    }
  }
}


#coupon {
  #redeemForm {
    :not(.md-focused) .input-redeem-hint {
      font-size: 20px;
    }

    #form-btn {
      text-align: center;

      #confirm-btn {
        width: 256px;
        height: 40px;
        margin: 0;
      }

      @media (min-width: 601px) {
        text-align: right;

        #confirm-btn {
          width: calc(33.33% - 16px);
        }
      }
    }
  }
}
</style>

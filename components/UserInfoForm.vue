<template>
  <form
    id="user-info-form"
    :class="{ editing: isEditing }"
    @keydown.esc="onCancel"
    @submit.prevent="onSubmitEdit">
    <div>

      <!-- BEGIN - User info section -->
      <div class="lc-container-3">
        <div class="lc-container-4">
          <section class="user-info-section">

            <div class="user-avatar-wrapper">
              <img class="avatar" :src="avatarData" />
              <md-button
                :class="{ 'input-display-btn': !isEditing }"
                @click="openPicker">
                <img :src="EditWhiteIcon" />
              </md-button>
              <input type="file" ref="inputFile" accept="image/*" @change="onChangeAvatar" />
            </div>

            <div class="user-identity">
              <div :class="['likecoin-id', 'lc-tablet-hide', 'lc-font-size-20', { disabled: isEditing }]">
                <span class="user-id-label">
                  {{ $t('Edit.label.id') }}&nbsp;
                </span>
                <nuxt-link v-if="user" :to="{ name: 'id', params: { id: user } }">
                  {{ user }}
                </nuxt-link>
              </div>

              <div @click="onEditDisplayName">
                <md-field :class="['lc-margin-bottom-4', 'lc-padding-top-0', isEditing ? 'md-field-edit-mode' : 'md-field-pre-edit']">
                  <md-input
                    ref="inputDisplayName"
                    class="input-display-name input-display"
                    v-model="displayName"
                    :disabled="!isEditing"
                    required />
                  <md-button
                    :class="['lc-tablet-hide', { 'input-display-btn': !isEditing }]"
                    @click="onEditDisplayName"
                    v-if="!isEditing">
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
        :isOpaque="isEditing"
        :linkHref="!isEditing ? getAmountHref : ''"
        @onTextClick="getAmountAction" />

      <div class="lc-container-3">
        <div class="lc-container-4">
          <div class="address-section">
            <div :class="['address-container', { edit: isEditing }]">
              <div :class="['address-field', 'likecoin-id', 'lc-tablet-show', { disabled: isEditing }]">
                <div class="address-title">
                  {{ $t('Edit.label.id') }}
                </div>
                <nuxt-link v-if="user" :to="{ name: 'id', params: { id: user } }">
                  <div class="lc-font-size-20">
                    {{ user }}
                  </div>
                </nuxt-link>
              </div>
              <div :class="['address-field', { disabled: isEditing }]">
                <div class="address-title">
                  {{ $t('Edit.label.address') }}
                </div>
                <md-field class="md-field-display">
                  <md-input
                    class="input-info"
                    v-model="wallet"
                    required
                    disabled />
                </md-field>
              </div>
              <div
                :class="['address-field', { disabled: getUserInfo.isEmailVerified && isEditing }]"
                @click="onEditEmail">
                <div class="address-title">
                  {{ $t('Edit.label.email') }}
                  <span v-if="!isEditing">
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
                <md-field
                  :class="['md-field-display', (!getUserInfo.isEmailVerified && isEditing) ? 'md-field-edit-mode' : 'md-field-pre-edit']">
                  <label class="input-display-hint lc-font-size-20">
                    {{ $t('Edit.label.addEmail') }}
                  </label>
                  <md-input
                    class="input-display input-info"
                    :pattern="W3C_EMAIL_REGEX"
                    v-model="email"
                    :title="$t('Register.form.error.emailFormat')"
                    ref="inputEmail"
                    :disabled="getUserInfo.isEmailVerified || !isEditing" />
                  <md-button
                    :class="{ 'input-display-btn': !isEditing }"
                    @click="onEditEmail"
                    v-if="!getUserInfo.isEmailVerified && !isEditing">
                    <img :src="EditIcon" />
                  </md-button>
                </md-field>
              </div>
            </div>

            <div v-if="isEditing" class="btn-container">
              <div class="edit-form-btn">
                <material-button
                  type="submit"
                  form="user-info-form"
                  :disabled="getIsPopupBlocking">
                  {{ $t('General.button.confirm') }}
                </material-button>
              </div>
              <div class="edit-form-btn">
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

    </div>
  </form>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';

import EthHelper from '@/util/EthHelper';
import User from '@/util/User';
import { logTrackerEvent } from '@/util/EventLogger';

import { ONE_LIKE, W3C_EMAIL_REGEX } from '@/constant';

import EditIcon from '@/assets/icons/edit.svg';
import EditWhiteIcon from '@/assets/icons/edit-white.svg';
import TickIcon from '@/assets/tokensale/tick.svg';

import LikeCoinAmount from '~/components/LikeCoinAmount';
import MaterialButton from '~/components/MaterialButton';
import ClaimDialog from '~/components/dialogs/ClaimDialog';

export default {
  name: 'Edit',
  data() {
    return {
      TickIcon,
      EditIcon,
      EditWhiteIcon,
      W3C_EMAIL_REGEX,
      avatarData: null,
      avatarFile: null,
      couponCode: '',
      displayName: '',
      email: '',
      freeCoupon: '',
      isEditing: false,
      isVerifying: false,
      likeCoinValueStr: '',
      user: '',
      wallet: '',
    };
  },
  components: {
    ClaimDialog,
    LikeCoinAmount,
    MaterialButton,
  },
  computed: {
    ...mapGetters([
      'getCurrentLocale',
      'getIsInTransaction',
      'getIsPopupBlocking',
      'getUserInfo',
      'getUserIsFetching',
      'getUserIsRegistered',
    ]),
    getAmountAction() {
      return this.onClickBuyLikeCoin;
    },
    getAmountHref() {
      return '';
    },
    getAmountText() {
      return this.$t('Edit.button.buyCoin');
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
      'fetchUserReferralStats',
      'onMissionClick',
    ]),
    openPicker() {
      this.isEditing = true;
      this.$refs.inputFile.click();
    },

    onEditDisplayName() {
      if (this.isEditing) {
        this.$nextTick(() => this.$refs.inputDisplayName.$el.focus());
        return;
      }
      this.isEditing = !this.isEditing;
      if (this.isEditing) {
        this.$nextTick(() => this.$refs.inputDisplayName.$el.focus());
      }
    },
    onEditEmail() {
      if (this.getUserInfo.isEmailVerified) return;
      if (this.isEditing) {
        this.$nextTick(() => this.$refs.inputEmail.$el.focus());
        return;
      }
      this.isEditing = !this.isEditing;
      if (this.isEditing) {
        this.$nextTick(() => this.$refs.inputEmail.$el.focus());
      }
    },
    onChangeAvatar(event) {
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
    onClickBuyLikeCoin() {
      this.$router.push({ name: 'in-tokensale' });
    },
    onCancel() {
      this.avatarFile = null;
      this.updateInfo();
      this.isEditing = false;
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
        this.setInfoMsg(`${this.$t('Register.form.label.updatedInfo')}  <a href="/${this.user}">${this.$t('Register.form.label.viewPage')}</a>`);
        this.refreshUserInfo(this.user);
        this.isEditing = false;
      } catch (err) {
        this.updateInfo();
        console.error(err);
      }
    },
    async onVerifyEmail() {
      await this.sendVerifyEmail({ id: this.user, ref: this.$route.query.ref });
      logTrackerEvent(this, 'RegFlow', 'StartEmailVerify', 'click confirm after enter email and the email is valid', 1);
      this.setInfoMsg(this.$t('Edit.label.verifying'));
      this.isVerifying = true;
    },
    async updateLikeCoin() {
      try {
        const balance = await EthHelper.queryLikeCoinBalance(this.wallet);
        this.likeCoinValueStr = new BigNumber(balance).dividedBy(ONE_LIKE).toFixed(4);
      } catch (err) {
        console.error(err);
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
    },
  },
  watch: {
    getUserIsFetching(value) {
      if (!value && this.getUserIsRegistered) {
        this.updateInfo();
      }
    },
  },
  mounted() {
    if (!this.getUserIsFetching && this.getUserIsRegistered) {
      this.updateInfo();
    }
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

$profile-margin: 48px;
$profile-icon-size: 128px;
$profile-icon-mobile-size: 88px;

#user-info-form {
  position: relative;

  // Editing overlay
  &:before {
    position: fixed;
    z-index: 1000;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    content: "";
    transition: opacity .25s ease-in-out;
    pointer-events: none;

    opacity: 0;
    background-color: rgba(255, 255, 255, 0.5);
  }

  &.editing {
    &:before {
      display: block;

      opacity: 1;
    }

    > div {
      position: relative;
      z-index: 1001;
    }
  };

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
        width: 100%;

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
          margin-bottom: 0;
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

      .md-disabled {
        padding-top: 0;
      }

      .md-has-value,
      .md-focused {
        .input-display-hint {
          opacity: 0;
          pointer-events: none;
        }
      }

      .verified {
        color: $like-green-2;

        .md-icon {
          color: $like-green-2;
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

input:disabled {
  opacity: 1;
}
</style>

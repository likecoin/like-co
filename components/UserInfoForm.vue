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
          <div class="form-wrapper">
            <section :class="['user-info-section', { edit: isEditing }]">

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


            <div v-if="isEditing" class="btn-container lc-margin-top-12">
              <div class="edit-form-btn">
                <md-button
                  class="md-likecoin"
                  type="submit"
                  form="user-info-form"
                  :disabled="getIsPopupBlocking">
                  {{ $t('General.button.confirm') }}
                </md-button>
              </div>
              <div class="edit-form-btn">
                <md-button
                  class="md-likecoin"
                  id="edit-cancel-btn"
                  :disabled="getIsPopupBlocking"
                  @click="onCancel">
                  {{ $t('General.button.cancel') }}
                </md-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- END - User info section -->

      <like-coin-amount
        class="likecoin-amount-section"
        :value="likeCoinValueStr"
        :isOpaque="isEditing"
        :linkText="getAmountText"
        :linkHref="!isEditing ? getAmountHref : ''"
        @onTextClick="getAmountAction" />

      <input-dialog
        ref="inputDialog"
        type="email"
        :pattern="W3C_EMAIL_REGEX"
        :text="email"
        :title="$t('Dialog.emailInput.title')"
        :content="$t('Dialog.emailInput.content')"
        :label="$t('Dialog.emailInput.label')"
        @submit="onInputDialogConfirm" />

      <div class="lc-container-3">
        <div class="lc-container-4">
          <div class="address-section">
            <div :class="['address-container', { edit: isEditing, disabled: isEditing }]">
              <div class="address-field likecoin-id lc-tablet-show">
                <div class="address-title">
                  {{ $t('Edit.label.id') }}
                </div>
                <nuxt-link v-if="user" :to="{ name: 'id', params: { id: user } }">
                  <div class="lc-font-size-20">
                    {{ user }}
                  </div>
                </nuxt-link>
              </div>
              <div class="address-field">
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
                class="address-field"
                @click="onEditEmail">
                <div class="address-title">
                  {{ $t('Edit.label.email') }}
                  <span>
                    <span class="verified" v-if="isUserEmailVerified">
                      <img :src="TickIcon" />
                      {{ $t('Edit.label.verified') }}
                    </span>
                    <span v-else-if="isVerifying">
                      ({{ $t('Edit.label.verifying') }})
                    </span>
                    <span v-else-if="email">
                      ({{ $t('Edit.label.unverified') }})
                    </span>
                  </span>
                </div>
                <md-field
                  v-if="!isUserEmailVerified"
                  class="md-field-display md-field-pre-edit">
                  <label class="input-display-hint lc-font-size-20">
                    {{ $t('Edit.label.addEmail') }}
                  </label>
                  <md-input
                    class="input-display input-info"
                    :pattern="W3C_EMAIL_REGEX"
                    v-model="email"
                    :title="$t('Register.form.error.emailFormat')"
                    ref="inputEmail"
                    disabled />
                </md-field>

                <md-checkbox
                  class="md-likecoin lc-margin-top-16"
                  v-model="isEmailEnabled"
                  @change="activateEdit">
                  {{ $t('Register.form.enableEmail') }}
                </md-checkbox>
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
import InputDialog from '~/components/dialogs/InputDialog';

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
      isEmailEnabled: false,
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
    InputDialog,
    LikeCoinAmount,
    MaterialButton,
  },
  computed: {
    ...mapGetters([
      'getCurrentLocale',
      'getIsInTransaction',
      'getIsPopupBlocking',
      'getUserInfo',
      'getUserIsReady',
      'getUserIsRegistered',
      'getMissionList',
    ]),
    getAmountAction() {
      return this.onClickBuyLikeCoin;
    },
    getAmountHref() {
      return '';
    },
    getAmountText() {
      return '';
    },
    isUserEmailVerified() {
      return this.getUserInfo.isEmailVerified;
    },
    verifyEmailMission() {
      return this.getMissionList.find(mission => mission.id === 'verifyEmail');
    },
  },
  methods: {
    ...mapActions([
      'newUser',
      'setInfoMsg',
      'sendVerifyEmail',
      'refreshUserInfo',
      'onMissionClick',
    ]),
    openPicker() {
      this.isEditing = true;
      this.$refs.inputFile.click();
    },
    activateEdit() {
      this.isEditing = true;
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
      if (this.isUserEmailVerified) return;

      if (this.verifyEmailMission) {
        // open mission dialog for verifyEmail directly
        this.onMissionClick({
          ...this.verifyEmailMission,
          isReferral: false,
        });
      } else {
        this.$refs.inputDialog.show();
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
          isEmailEnabled: this.isEmailEnabled,
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
    async onInputDialogConfirm(inputText) {
      if (this.email !== inputText) {
        this.email = inputText;
        await this.onSubmitEdit();
      }
      this.$refs.inputDialog.hide();
      if (!this.isUserEmailVerified) {
        return this.onVerifyEmail();
      }
      return () => {};
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
      this.isEmailEnabled = (user.isEmailEnabled !== false);
      this.updateLikeCoin();
    },
  },
  watch: {
    getUserIsReady(value) {
      if (value && this.getUserIsRegistered) {
        this.updateInfo();
      }
    },
  },
  mounted() {
    if (this.getUserIsReady && this.getUserIsRegistered) {
      if (this.$route.params.showEmail && !this.isUserEmailVerified) {
        this.$nextTick(() => this.$refs.inputDialog.show());
      }
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

  .form-wrapper {
    display: flex;
    flex-direction: row;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  .user-info-section {
    display: flex;
    align-items: center;
    flex-direction: row;

    @media (min-width: #{768px + 1px}) {
      flex: 2;
    }

    @media (max-width: 768px) {
      flex-direction: column;

      &:not(.edit) {
        margin-bottom: 40px;
      }
    }
  }

  .user-identity {
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    @media (min-width: 768 + 1px) {
      padding-right: 64px;
    }

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

  .btn-container {
    z-index: 2;

    flex: 1;

    @media (max-width: 768px) {
      align-self: center;
      flex-direction: column;

      width: 256px;
    }

    .edit-form-btn {
      > button {
        width: 100%;
        height: 40px;
        margin-bottom: 0;
        margin-left: 0;

        border-radius: 0;
      }

      #edit-cancel-btn {
        background-color: $like-gradient-3;
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

    margin-top: -16px;
  }

  .address-section {
    display: flex;
    flex-direction: row;

    margin-top: 12px;

    @media (max-width: 768px) {
      flex-direction: column;
    }

    .address-container {
      flex: 1;
    }
  }

  .address-container {
    display: flex;
    flex-direction: column;

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
          pointer-events: none;

          opacity: 0;
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

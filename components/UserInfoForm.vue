<template>
  <form id="user-info-form">
    <div>

      <!-- BEGIN - User info section -->
      <div class="lc-container-3">
        <div class="lc-container-4">
          <section class="user-info-section">

            <nuxt-link
              :to="{ name: 'in-settings' }"
              class="user-avatar-wrapper"
            >
              <lc-avatar
                :src="avatarData"
                :halo="avatarHalo"
                size="large"
              />
            </nuxt-link>

            <div class="user-identity">
              <div class="lc-tablet-hide lc-font-size-20">
                <span class="user-id-label">
                  {{ $t('Edit.label.id') }}&nbsp;
                </span>
                <nuxt-link
                  v-if="user"
                  v-bind="$testID('UserInfoForm-LikeCoinId')"
                  :to="{ name: 'id', params: { id: user } }"
                >
                  {{ user }}
                </nuxt-link>
              </div>

              <div
                :class="[
                  'user-info-form__display-name',
                  'lc-font-weight-600',
                  'lc-line-height-1_5'
                ]"
              >
                <nuxt-link
                  :to="{ name: 'in-settings' }"
                  v-bind="$testID('UserInfoForm-DisplayName')"
                  class="lc-color-like-dark-brown-1 lc-text-align-center"
                >
                  {{ displayName }}
                </nuxt-link>
                <nuxt-link
                  :to="{ name: 'in-settings' }"
                  class="user-info-form__edit-button"
                >
                  <md-button class="lc-tablet-hide">
                    <img :src="EditIcon">
                  </md-button>
                </nuxt-link>
              </div>
            </div>

            <!-- Civic Liker Info & CTA -->
            <div class="civic-liker-info">
              <div
                v-if="isCivicLiker || isCivicLikerTrial"
                :class="[
                  'civic-liker-info__chop',
                  {
                    'civic-liker-info__chop--clickable': isCivicLikerTrial || canRenewCivicLiker,
                  }
                ]"
                @click="onClickCivicLikerStamp"
              >
                <lc-chop-civic-liker
                  :date="civicLikerSince"
                  :is-flashing="canRenewCivicLiker"
                  size="140"
                  rotate-z="13"
                />
                <lc-chop-simple
                  v-if="isCivicLikerTrial || canRenewCivicLiker"
                  :text="canRenewCivicLiker ? 'EXPIRED' : 'TRIAL'"
                  :is-trial="isCivicLikerTrial"
                  class="civic-liker-status-stamp"
                  size="140"
                  rotate-z="-8"
                />
              </div>
              <div
                v-else
                class="civic-liker-info__chop"
              >
                <nuxt-link
                  :to="{ name: 'in-civic' }"
                  class="lc-font-weight-400 lc-underline"
                >
                  {{ $t('CivicLikerBeta.joinNow') }}
                </nuxt-link>
              </div>
              <civic-liker-cta
                :is-show-chop="false"
                class="lc-margin-top-40 lc-mobile-show"
                layout="column"
              />
            </div>

          </section>
        </div>
      </div>
      <!-- END - User info section -->

      <like-coin-amount
        v-if="wallet"
        :value="likeCoinValueStr"
        :linkText="$t('Home.Sale.button.earnCoin')"
        :linkTo="{ name: 'in-earn' }"
        class="likecoin-amount-section"
      />
      <!-- TODO: Temp hide before civic liker release
      <div
        v-else
        class="links"
      >
        <md-button
          :to="{ name: 'in-settings-button' }"
          class="link md-likecoin lc-text-align-center lc-font-weight-600 shadow"
        >{{ $t('Settings.button.becomeBacker') }}</md-button>
        <div
          class="desc"
        >
          {{ $t('Settings.label.backerDesc') }}
        </div>
      </div>
      -->

      <input-dialog
        ref="inputDialog"
        :pattern="W3C_EMAIL_REGEX"
        :text="email"
        :title="$t('Dialog.emailInput.title')"
        :content="$t('Dialog.emailInput.content')"
        :label="$t('Dialog.emailInput.label')"
        type="email"
        @submit="onInputDialogConfirm"
      />

      <div class="lc-container-3">
        <div class="lc-container-4">
          <div class="address-section">
            <div class="address-container">
              <div class="address-field lc-tablet-show">
                <div class="address-title">
                  {{ $t('Edit.label.id') }}
                </div>
                <nuxt-link
                  v-if="user"
                  :to="{ name: 'id', params: { id: user } }"
                >
                  <div class="lc-font-size-20">
                    {{ user }}
                  </div>
                </nuxt-link>
              </div>

              <div
                v-if="wallet"
                class="address-field"
              >
                <div class="address-title">
                  {{ $t('Settings.label.receiveLikeCoinLink') }}
                </div>
                <div class="receive-likecoin-link">
                  <nuxt-link
                    v-if="getUserInfo.user"
                    :to="{ name: 'id', params: { id: getUserInfo.user } }"
                    class="lc-font-size-20 lc-color-like-green"
                  >
                    {{ receiveLikeCoinLink }}
                  </nuxt-link>
                  <md-button
                    v-clipboard:copy="receiveLikeCoinLink"
                    v-clipboard:success="onCopyReceiveLikeCoinLink"
                    class="lc-font-size-12 lc-color-like-green"
                  >
                    {{ $t(`General.button.${hasCopiedReceiveLikeCoinLink ? 'copied' : 'copy'}`) }}
                  </md-button>
                </div>
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

import { logTrackerEvent } from '@/util/EventLogger';
import getTestAttribute from '@/util/test';
import User from '@/util/User';

import {
  W3C_EMAIL_REGEX,
  EXTERNAL_HOSTNAME,
} from '@/constant';

import EditIcon from '@/assets/icons/edit.svg';
import EditWhiteIcon from '@/assets/icons/edit-white.svg';

import CivicLikerCta from '~/components/CivicLiker/CTA';
import LikeCoinAmount from '~/components/LikeCoinAmount';
import InputDialog from '~/components/dialogs/InputDialog';

export default {
  name: 'user-info-form',
  components: {
    CivicLikerCta,
    InputDialog,
    LikeCoinAmount,
  },
  data() {
    return {
      EditIcon,
      EditWhiteIcon,
      W3C_EMAIL_REGEX,
      avatarData: null,
      displayName: '',
      email: '',
      isVerifying: false,
      user: '',
      wallet: '',
      hasCopiedReceiveLikeCoinLink: false,
    };
  },
  computed: {
    ...mapGetters([
      'getCurrentLocale',
      'getUserInfo',
      'getUserIsRegistered',
      'getUserLikeCoinAmountInBigNumber',
    ]),
    isCivicLiker() {
      return this.getUserInfo.isSubscribedCivicLiker;
    },
    isCivicLikerTrial() {
      return this.getUserInfo.isCivicLikerTrial;
    },
    canRenewCivicLiker() {
      return this.getUserInfo.isCivicLikerRenewalPeriod;
    },
    avatarHalo() {
      return User.getAvatarHaloType(this.getUserInfo);
    },
    civicLikerSince() {
      return new Date(this.getUserInfo.civicLikerSince);
    },
    isUserEmailVerified() {
      return this.getUserInfo.isEmailVerified;
    },
    likeCoinValueStr() {
      if (!this.wallet) {
        return 'No binded wallet';
      }
      return (this.getUserLikeCoinAmountInBigNumber || 0).toFixed(4);
    },
    receiveLikeCoinLink() {
      return `https://${EXTERNAL_HOSTNAME}/${this.getUserInfo.user}`;
    },
  },
  mounted() {
    if (this.getUserIsRegistered) {
      if (this.$route.params.showEmail && !this.isUserEmailVerified) {
        this.$nextTick(() => this.$refs.inputDialog.show());
      }
      this.updateInfo();
    }
  },
  methods: {
    ...mapActions([
      'updateUser',
      'setInfoMsg',
      'sendVerifyEmail',
      'refreshUserInfo',
      'onMissionClick',
      'queryLikeCoinWalletBalance',
    ]),
    onClickCivicLikerStamp() {
      if (this.isCivicLikerTrial || this.canRenewCivicLiker) {
        this.$router.push({ name: 'in-civic-register' });
      }
    },
    async onSubmitEdit() {
      try {
        const userInfo = {
          avatarFile: this.avatarFile,
          user: this.user,
          displayName: this.displayName,
          wallet: this.wallet || '',
          email: this.email,
          locale: this.getCurrentLocale,
        };
        await this.updateUser(userInfo);
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
    async updateInfo() {
      const user = this.getUserInfo;
      this.user = user.user;
      this.displayName = user.displayName;
      this.avatarData = user.avatar;
      this.wallet = user.wallet;
      this.email = user.email;
      this.isEmailEnabled = (user.isEmailEnabled !== false);
      this.queryLikeCoinWalletBalance();
    },
    onCopyReceiveLikeCoinLink() {
      this.hasCopiedReceiveLikeCoinLink = true;
    },
    getTestAttribute: getTestAttribute('userInfoForm'),
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

  .user-info-section {
    display: flex;
    align-items: center;
    flex-direction: row;

    @media (min-width: #{768px + 1px}) {
      flex: 2;
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

    @media (min-width: 768 + 1px) {
      padding-right: 64px;
    }

    @media (max-width: 768px) {
      align-items: center;
    }

    .user-id-label {
      color: $like-gray-5;
    }
  }

  .civic-liker-info {
    @media screen and (max-width: 768px) {
      margin-top: 32px;
    }

    &__chop {
      position: relative;
      z-index: 10;

      width: 272px;
      height: 100px;
      margin: 0 auto;

      border: 2px solid $like-gray-3;
      border-top: none;
      border-bottom: none;

      > * {
        position: absolute;
      }

      &--clickable {
        > * {
          cursor: pointer;
        }
      }

      .lc-chop-civic-liker {
        top: -24px;
        left: calc((100% - 156px) / 2);
      }

      .lc-chop-countdown {
        top: -24px;
        left: -4px;
      }

      .lc-chop-approved {
        right: -32px;
        bottom: -4px;
      }

      .civic-liker-status-stamp {
        bottom: -24px;
        left: -24px;
      }
    }

    a {
      position: absolute;
      top: calc(50% - 10px);
      right: 24px;
    }
  }

  .input-display-btn {
    opacity: 0;
    &:hover {
      opacity: 1;
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
  }

  .address-container {
    display: flex;
    flex-direction: column;

    width: 100%;

    @media (min-width: 768px + 1px) {
      width: 2 / 3 * 100%;
    }

    .address-title {
      color: $like-dark-brown-1;
    }

    .address-field {
      margin-top: 16px;
    }
  }

  .user-avatar-wrapper {
    position: relative;
    z-index: 2;

    flex-shrink: 0;

    @media (min-width: #{768px + 1px}) {
      margin-right: $profile-margin;
    }

    .lc-avatar {
      :global(.lc-avatar__content) {
        @media (min-width: #{768px + 1px}) {
          width: $profile-icon-size !important;
          height: $profile-icon-size !important;
        }

        @media (max-width: 768px) {
          width: $profile-icon-mobile-size !important;
          height: $profile-icon-mobile-size !important;
        }
      }
    }
  }
}

.receive-likecoin-link {
  display: flex;
  justify-content: space-between;

  width: 100%;

  a {
    word-wrap: break-word;

    @media (max-width: 600px) {
      width: 80%;
    }
  }

  .md-button {
    min-width: auto;
    height: 24px;
    margin: 0;
  }
}

.social-media-connect__setting-icon {
  width: 24px;
  min-width: auto;
  height: 24px;
  margin: -4px 0 0 16px;
}

.user-info-form {
  &__display-name {
    position: relative;

    a {
      display: inline-block;
      overflow: hidden;

      white-space: nowrap;
      text-decoration: none;
      text-overflow: ellipsis;

      font-size: 42px;

      @media (max-width: 768px) {
        width: 80vw;

        font-size: 32px;
      }

      &:hover {
        + .user-info-form__edit-button {
          opacity: 1;
        }
      }
    }
  }

  &__edit-button {
    position: absolute;
    top: 12px;
    left: -50px;

    display: flex;

    transition: opacity .2s ease-in-out !important;

    opacity: 0;

    &:hover {
      opacity: 1;
    }

    .md-button {
      min-width: 36px;
    }
  }
}

.links {
  z-index: 1;

  margin-top: -24px;

  @media (min-width: #{768px + 1px}) {
    align-self: flex-end;

    width: calc(33.33% - 40px);
    margin-top: -60px;
    margin-right: #{40px + 8px};
    margin-left: 66.6%;
  }

  @media (max-width: 768px) {
    align-self: center;

    width: 100%;

    margin-left: 0px;
    padding: 0 24px;

    text-align: center;
  }

  .link {
    width: 100%;
    margin: 0;

    transition: opacity .2s ease-in-out;

    background-image: $like-linear-gradient-2;
    &:not(:first-child) {
      margin-top: 8px;
    }

    &:hover {
      opacity: 0.8;
    }

    > a, span {
      text-decoration: underline;
    }
  }

  .desc {
    padding: 4px 8px;

    text-align: center;

    color: $like-gray-5;

    font-size: 12px;

    @media (max-width: 768px) {
      width: 100%;
    }
  }
}
</style>

<template>
  <div class="likecoin-settings__personal-tab">

    <div class="lc-container-1 lc-margin-top-48 lc-mobile">
      <div class="lc-container-2">
        <div class="lc-container-3 lc-padding-vertical-32 lc-bg-gray-1">
          <form
            id="account-setting-form"
            v-bind="getTestAttribute('accountSettingForm')"
            @submit.prevent="onSubmit"
          >
            <div class="profile-setting-page__account-setting">
              <div class="profile-setting-page__portrait">
                <img
                  v-if="avatar"
                  :src="avatar"
                >
                <md-button
                  class="lc-color-like-green lc-underline lc-font-weight-600"
                  @click="onClickEditAvatar"
                >
                  {{ $t('Settings.button.editPortrait') }}
                </md-button>
                <input
                  ref="avatarFile"
                  accept="image/*"
                  style="display: none"
                  type="file"
                  @change="onChangeAvatar"
                >
              </div>

              <div class="profile-setting-page__account-detail">
                <div class="profile-setting-page__field profile-setting-page__field--one-line">
                  <span class="title">
                    {{ $t('Edit.label.id') }}
                  </span>
                  <span class="content">
                    {{ getUserInfo.user }}
                  </span>
                </div>

                <div class="profile-setting-page__field profile-setting-page__field--one-line">
                  <span class="title">
                    {{ $t('Register.form.walletAddress') }}:
                  </span>
                  <span class="content">
                    {{ getUserInfo.wallet || 'No Binded Wallet' }}
                  </span>
                </div>

                <div class="profile-setting-page__field profile-setting-page__field--multi-line">
                  <span class="title">
                    {{ $t('Register.form.displayName') }}
                  </span>
                  <span class="content">
                    <md-field>
                      <md-input
                        v-model="displayName"
                        v-bind="getTestAttribute('userDisplayName')"
                        required
                      />
                    </md-field>
                  </span>
                </div>

                <div class="profile-setting-page__field profile-setting-page__field--multi-line">
                  <span class="title">
                    {{ $t('Register.form.email') }}
                    <span class="profile-setting-page__email-verify-status">
                      <span
                        v-if="getUserInfo.isEmailVerified"
                        class="verified"
                      >
                        <simple-svg
                          :filepath="TickIcon"
                          width="16px"
                          height="16px"
                        />
                        {{ $t('Edit.label.verified') }}
                      </span>
                      <span v-else-if="isVerifying">
                        ({{ $t('Edit.label.verifying') }})
                      </span>
                      <span v-else-if="email">
                        ({{ $t('Edit.label.unverified') }})
                      </span>
                    </span>
                  </span>
                  <span class="content">
                    <md-field>
                      <md-input
                        v-model="email"
                        :title="$t('Edit.label.validCodeRequired')"
                        :pattern="W3C_EMAIL_REGEX"
                        autocomplete="email"
                        required
                      />
                    </md-field>
                  </span>
                </div>
              </div>
            </div>
            <div class="profile-setting-page__confirm-btn lc-margin-top-8">
              <md-button
                :disabled="!hasUserDetailsChanged || disabled"
                v-bind="getTestAttribute('submitButton')"
                class="md-likecoin"
                form="account-setting-form"
                type="submit"
              >
                {{ $t('General.button.confirm') }}
              </md-button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <section class="lc-container-0 lc-margin-top-32">
      <div class="lc-container-1">
        <div class="lc-container-2">

          <div class="lc-container-3 lc-bg-gray-1 lc-padding-top-24 lc-padding-bottom-48">
            <div class="lc-container-4">
              <h1 class="lc-font-size-32">
                {{ $t('Edit.label.accountConnection') }}
              </h1>
              <p class="lc-margin-top-8 lc-color-gray-9b">
                {{ $t('Settings.label.accountConnection') }}
              </p>

              <social-media-connect
                :platforms="getUserSocialPlatforms"
                :username="getUserInfo.user"
                :is-show-legacy="false"
                class="lc-margin-top-24"
                type="large"
                @disconnect="onClickSocialMediaDisconnect"
              />
            </div>
          </div>

          <div class="lc-container-3 lc-bg-gray-1 lc-margin-top-8 lc-padding-vertical-24">
            <div class="lc-container-4">
              <external-links-panel />
            </div>
          </div>

        </div>
      </div>
    </section>

    <section
      v-if="getUserInfo.wallet"
      id="coupon"
      class="lc-container-0 lc-margin-top-48 lc-mobile"
    >
      <div class="lc-container-1">

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
          <div class="lc-container-3 lc-bg-gray-1 lc-padding-vertical-32">
            <div class="lc-container-4">
              <form
                id="redeemForm"
                @submit.prevent="onSubmitCoupon"
              >
                <div class="redeem-form__input-container">
                  <md-field>
                    <label class="lc-font-size-20">
                      {{ $t('Edit.label.redeemCode') }}
                    </label>
                    <md-input
                      v-model="couponCode"
                      v-bind="getTestAttribute('redeemFormInput')"
                      :title="$t('Edit.label.validCodeRequired')"
                      pattern="[2-9A-HJ-NP-Za-km-z]{8}"
                      required
                    />
                  </md-field>
                  <md-button
                    v-bind="getTestAttribute('redeemFormConfirmBtn')"
                    :disabled="getIsInTransaction"
                    class="md-likecoin"
                    type="submit"
                    form="redeemForm"
                  >
                    {{ $t('General.button.confirm') }}
                  </md-button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <claim-dialog
        ref="claimDialog"
        :couponCode="couponCode"
        :wallet="getUserInfo.wallet"
      />
    </section>

  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

import {
  W3C_EMAIL_REGEX,
} from '@/constant';
import getTestAttribute from '@/util/test';

import ClaimDialog from '~/components/dialogs/ClaimDialog';
import ExternalLinksPanel from '~/components/settings/ExternalLinksPanel';
import SocialMediaConnect from '~/components/SocialMediaConnect';

import TickIcon from '@/assets/tokensale/tick.svg';

export default {
  name: 'settings-index',
  components: {
    ClaimDialog,
    ExternalLinksPanel,
    SocialMediaConnect,
  },
  data() {
    return {
      avatar: '',
      avatarFile: null,
      couponCode: '',
      displayName: '',
      email: '',
      isEmailEnabled: false,
      isEmailPreviouslyEnabled: false,
      isVerifying: false,
      TickIcon,
      W3C_EMAIL_REGEX,
    };
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getUserIsRegistered',
      'getUserNeedAuth',
      'getUserSocialPlatforms',
      'getIsInTransaction',
    ]),
    disabled() {
      return this.isLoading || !this.getUserIsRegistered;
    },
    hasUserDetailsChanged() {
      return (
        !!this.avatarFile
        || this.getUserInfo.email !== this.email
        || this.getUserInfo.displayName !== this.displayName
      );
    },
  },
  watch: {
    getUserInfo(value) {
      if (value && this.getUserIsRegistered) {
        this.updateInfo();
      }
    },
  },
  mounted() {
    if (this.getUserIsRegistered) {
      this.updateInfo();
    }
  },
  methods: {
    ...mapActions([
      'updateUser',
      'refreshUserInfo',
      'sendVerifyEmail',
      'setInfoMsg',
      'fetchSocialListDetailsById',
      'unlinkSocialPlatform',
    ]),
    async updateInfo() {
      const user = this.getUserInfo;
      this.avatar = user.avatar;
      this.displayName = user.displayName;
      this.email = user.email;
      this.fetchSocialListDetailsById(user.user);
    },
    async onSubmit() {
      if (this.hasUserDetailsChanged) {
        try {
          const { avatarFile, displayName } = this;
          const { user, wallet = '' } = this.getUserInfo;
          const email = this.email.trim();
          const userInfo = {
            avatarFile,
            displayName,
            email,
            user,
            wallet,
          };
          const hasEmailChanged = this.getUserInfo.email !== email;

          await this.updateUser(userInfo);
          this.setInfoMsg(`${this.$t('Register.form.label.updatedInfo')}  <a href="/${user}">${this.$t('Register.form.label.viewPage')}</a>`);
          this.refreshUserInfo(user);

          if (hasEmailChanged) {
            await this.sendVerifyEmail({
              id: this.getUserInfo.user,
              ref: 'in-settings',
            });
            this.isVerifying = true;
          }
        } catch (err) {
          this.updateInfo();
          console.error(err);
        }
      }
    },
    onClickEditAvatar() {
      this.$refs.avatarFile.click();
    },
    onChangeAvatar(event) {
      const { files } = event.target;
      if (files && files[0]) {
        [this.avatarFile] = Object.values(files);
        const reader = new FileReader();
        reader.onload = (e) => {
          this.avatar = e.target.result;
        };
        reader.readAsDataURL(files[0]);
      }
    },
    onClickSocialMediaDisconnect(platform) {
      this.unlinkSocialPlatform({
        platform,
        payload: {
          user: this.getUserInfo.user,
        },
      });
    },
    async onSubmitCoupon() {
      try {
        await this.$refs.claimDialog.onSubmit();
      } catch (err) {
        console.error(err);
      }
    },
    getTestAttribute: getTestAttribute('inSettings'),
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";
@import "~assets/input";

.profile-setting-page {
  &__account-setting {
    display: flex;

    @media (max-width: 768px) {
      flex-direction: column;
    }

    .md-button {
      margin: 0;
    }
  }

  &__portrait {
    display: flex;
    align-items: center;
    flex-direction: column;
    flex-shrink: 0;

    img {
      width: 144px;
      height: 144px;

      border-radius: 50%;
      background-color: $like-white;

      object-fit: cover;
    }
  }

  &__account-detail {
    @media (min-width: 768px + 1px) {
      width: calc(100% - 176px);
      margin-left: 32px;
    }
  }

  &__field {
    display: flex;

    margin: 16px 0;

    .content {
      color: $like-gray-5;

      font-size: 20px;
    }

    &--one-line {
      flex-direction: row;

      @media (min-width: 768px + 1px) {
        flex-wrap: wrap;
      }

      @media (max-width: 768px) {
        flex-direction: column;
      }

      .title {
        min-width: 124px;
      }

      .content {
        word-wrap: break-word;
      }
    }

    &--multi-line {
      flex-direction: column;

      .md-field {
        min-height: auto;
        margin: 0;
        padding: 0;
      }

      .verified {
        display: inline-flex;

        transform: translateY(2px);

        color: $like-green-2;
      }
    }
  }

  &__email-verify-status {
    margin-left: 8px;

    font-weight: 600;

    .simple-svg-wrapper {
      margin-right: 4px;
    }
  }

  &__social {
    :global(ul) {
      flex: 1;
    }
  }

  &__confirm-btn {
    text-align: right;

    @media (max-width: 768px) {
      text-align: center;
    }
  }
}

.redeem-form__input-container {
  display: flex;

  @media (max-width: 600px) {
    flex-direction: column;
  }

  .md-button {
    @media (min-width: 600px + 1px) {
      max-height: 40px;
      margin-top: 12px;
      margin-left: 24px;
    }
  }
}
</style>

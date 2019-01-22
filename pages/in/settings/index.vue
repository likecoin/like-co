<template>
  <div class="likecoin-settings__personal-tab">

    <!-- Civic Liker CTA Section -->
    <div class="lc-container-1 lc-margin-top-48 lc-mobile">
      <div class="lc-container-2">
        <civic-liker-cta
          class="lc-bg-gray-1 lc-padding-top-24-mobile lc-padding-bottom-24-mobile"
        />
      </div>
    </div>

    <!-- User Info Form Section -->
    <div class="lc-container-1 lc-margin-top-16">
      <div class="lc-container-2">
        <div class="lc-container-3 lc-padding-vertical-32 lc-bg-gray-1">
          <form
            id="account-setting-form"
            v-bind="getTestAttribute('accountSettingForm')"
            @submit.prevent="onSubmit"
          >
            <div class="profile-setting-page__account-setting">
              <div class="profile-setting-page__portrait">
                <lc-avatar
                  v-if="avatar"
                  :src="avatar"
                  :halo="avatarHalo"
                  size="120"
                />
                <md-button
                  class="lc-color-like-green lc-margin-top-16 lc-underline lc-font-weight-600"
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
                  <span
                    v-if="getUserInfo.wallet"
                    class="content"
                  >
                    {{ getUserInfo.wallet }}
                  </span>
                  <nuxt-link
                    v-else
                    :to="{ name: 'in-earn', query: { action: 'start' } }"
                    class="content"
                  >
                    {{ $t('Settings.noBoundWallet') }}
                  </nuxt-link>
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

    <!-- Connections Section -->
    <section
      id="connect"
      class="lc-container-0 lc-margin-top-32"
    >
      <div class="lc-container-1">
        <div class="lc-container-2">

          <!-- Auth Connections -->
          <div class="lc-container-3 lc-bg-gray-1 lc-padding-top-32 lc-padding-bottom-48">
            <div class="lc-container-4">
              <h1 class="lc-font-size-32">
                {{ $t('AuthConnectList.title') }}
              </h1>
              <auth-connect-list
                :platforms="authPlatforms"
                :is-loading="getUserIsLoadingAuthPlaforms"
                class="lc-margin-top-32"
                @connect="onConnectAuth"
                @disconnect="onDisconnectAuth"
                @select-option="onSelectConnectOption"
              />
            </div>
          </div>

          <!-- Other Connections -->
          <div class="lc-container-3 lc-bg-gray-1 lc-margin-top-8 lc-padding-vertical-32">
            <div class="lc-container-4">
              <h2 class="lc-font-size-14 lc-font-weight-400">
                {{ $t('OtherConnectList.title') }}
              </h2>
              <p class="lc-margin-top-8 lc-color-gray-9b">
                {{ $t('OtherConnectList.description') }}
              </p>
              <other-connect-list
                :platforms="otherPlatforms"
                class="lc-margin-top-24"
                @connect="onConnectOtherPlatforms"
                @disconnect="onDisconnectOtherPlatforms"
                @select-option="onSelectConnectOption"
              />
            </div>
          </div>

          <!-- External Link -->
          <div class="lc-container-3 lc-bg-gray-1 lc-margin-top-8 lc-padding-vertical-32">
            <div class="lc-container-4">
              <external-links-panel />
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Redeem Code Section  -->
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
  LOGIN_CONNECTION_LIST,
  OTHER_CONNECTION_LIST,
} from '@/constant';

import { firebasePlatformSignIn } from '~/util/FirebaseApp';

import getTestAttribute from '@/util/test';
import User from '@/util/User';

import CivicLikerCta from '~/components/CivicLiker/CTA';
import ClaimDialog from '~/components/dialogs/ClaimDialog';
import AuthConnectList from '~/components/settings/AuthConnectList';
import OtherConnectList from '~/components/settings/OtherConnectList';
import ExternalLinksPanel from '~/components/settings/ExternalLinksPanel';

import TickIcon from '@/assets/tokensale/tick.svg';

export default {
  name: 'settings-index',
  components: {
    CivicLikerCta,
    ClaimDialog,
    AuthConnectList,
    OtherConnectList,
    ExternalLinksPanel,
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
      'getUserIsLoadingAuthPlaforms',
      'getUserAuthPlatforms',
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
    authPlatforms() {
      return LOGIN_CONNECTION_LIST.map(pid => this.injectPlatformData({
        ...this.getUserSocialPlatforms[pid],
        pid,
        isConnected: !!this.getUserAuthPlatforms[pid],
      }));
    },
    otherPlatforms() {
      return OTHER_CONNECTION_LIST.map(pid => this.injectPlatformData({
        ...this.getUserSocialPlatforms[pid],
        pid,
        isConnected: !!this.getUserSocialPlatforms[pid],
      }));
    },
    avatarHalo() {
      return User.getAvatarHaloType(this.getUserInfo);
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
      'fetchAuthPlatformsById',
      'linkUserAuthPlatform',
      'unlinkUserAuthPlatform',
      'fetchSocialListDetailsById',
      'fetchSocialPlatformLink',
      'linkSocialPlatform',
      'unlinkSocialPlatform',
      'selectFacebookPageLink',
    ]),
    getTestAttribute: getTestAttribute('inSettings'),
    injectPlatformData(platform) {
      if (!platform.isConnected) return platform;

      const { pid, id, pages = [] } = platform;
      let options = [];
      let selectedOption;

      if (pid === 'facebook') {
        // Inject Facebook pages as options
        options = options.concat([
          {
            value: id,
            text: this.$t('Facebook.personalProfile'),
          },
          ...pages.map(({ id: value, name }) => ({
            value,
            text: name,
          })),
        ]);

        // Show which Facebook page/account is currently shown in public
        selectedOption = id;
        pages.some((page) => {
          if (page.link === platform.url) {
            selectedOption = page.id;
            return true;
          }
          return false;
        });
      } else {
        // TODO: Inject non-Facebook options
        // options.push({
        //   value: 'show',
        //   text: this.$t('AuthConnectList.show'),
        // });

        selectedOption = platform.isPublic ? 'hide' : 'show';
      }

      // TODO: Inject common options
      // options.push({
      //   value: 'hide',
      //   text: this.$t('AuthConnectList.hide'),
      // });

      return {
        ...platform,
        options,
        selectedOption,
      };
    },
    async updateInfo() {
      const user = this.getUserInfo;
      this.avatar = user.avatar;
      this.displayName = user.displayName;
      this.email = user.email;
      this.fetchAuthPlatformsById(user.user);
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
    async onConnectAuth(pid) {
      const platform = this.getUserAuthPlatforms[pid];
      if (platform) return;

      switch (pid) {
        case 'facebook': {
          if (!window.FB) return;
          window.FB.login((response) => {
            if (response.authResponse.accessToken) {
              this.linkSocialPlatform({
                platform: 'facebook',
                payload: {
                  user: this.getUserInfo.user,
                  access_token: response.authResponse.accessToken,
                },
              });
            } else {
              // error case
            }
          }, { scope: 'public_profile,pages_show_list,user_link' });
          break;
        }
        case 'google':
        case 'twitter': {
          const {
            firebaseIdToken,
            accessToken,
            secret,
          } = await firebasePlatformSignIn(pid);
          this.linkUserAuthPlatform({
            platform: pid,
            payload: {
              user: this.getUserInfo.user,
              firebaseIdToken,
              accessToken,
              secret,
            },
          });
          break;
        }
        default:
          break;
      }
    },
    onDisconnectAuth(pid) {
      switch (pid) {
        case 'google':
        case 'twitter':
          this.unlinkUserAuthPlatform({ platform: pid });
          break;

        case 'facebook':
          this.onDisconnectOtherPlatforms(pid);
          break;

        default:
      }
    },
    async onConnectOtherPlatforms(pid) {
      switch (pid) {
        default: {
          const { url } = await this.fetchSocialPlatformLink({
            platform: pid,
            id: this.getUserInfo.user,
          });
          document.location = url;
          break;
        }
      }
    },
    onSelectConnectOption(pid, value) {
      switch (pid) {
        case 'facebook':
          this.selectFacebookPageLink({
            pageId: value,
            payload: {
              user: this.getUserInfo.user,
            },
          });
          break;

        default:
      }
    },
    onDisconnectOtherPlatforms(pid) {
      this.unlinkSocialPlatform({
        platform: pid,
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

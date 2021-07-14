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

                <div class="profile-setting-page__field profile-setting-page__field--multi-line">
                  <span class="title">
                    {{ $t('Register.form.displayName') }}
                  </span>
                  <span class="content">
                    <md-field>
                      <md-input
                        v-model="displayName"
                        v-bind="getTestAttribute('userDisplayName')"
                        :required="!getUserIsAuthCore"
                        :disabled="getUserIsAuthCore"
                      />
                      <md-button @click="focusAuthCore">
                        <span v-if="isShowEditInAuthCore">
                          {{ $t('Edit.label.editInAuthCore') }}
                        </span>
                        <md-icon>edit</md-icon>
                      </md-button>
                    </md-field>
                  </span>
                </div>
                <div
                  v-if="getUserHasWallet"
                  class="profile-setting-page__field profile-setting-page__field--one-line"
                >
                  <span class="title">
                    {{ $t('Register.form.walletAddress') }}:
                  </span>
                  <span
                    v-if="getUserInfo.cosmosWallet"
                    class="content"
                  >
                    {{ getUserInfo.cosmosWallet }}
                  </span>
                </div>
                <template v-if="!getUserIsAuthCore">
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
                </template>
              </div>
            </div>
            <div
              v-if="!getUserIsAuthCore"
              class="profile-setting-page__confirm-btn lc-margin-top-8"
            >
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
        <div ref="authcore" class="lc-container-2">
          <no-ssr>
            <div
              v-if="getAuthCoreNeedReAuth || getAuthCoreAccessToken"
              class="lc-container-3 lc-padding-vertical-32 lc-bg-gray-1"
            >
              <div class="lc-container-4">
                <h2 class="lc-font-size-14 lc-font-weight-400">
                  {{ $t('AuthCore.Settings.title') }}
                </h2>
                <div v-if="getAuthCoreNeedReAuth">
                  <md-button
                    class="md-likecoin"
                    @click="onClickAuthCoreReAuth"
                  >
                    {{ $t('AuthCore.button.reAuthNeeded') }}
                  </md-button>
                </div>
                <div
                  v-else-if="getAuthCoreAccessToken"
                >
                  <md-tabs
                    :md-active-tab="`authcore-${isShowAuthCoreProfile ? 'profile' : 'settings'}`"
                    @md-changed="onAuthCoreSettingTabsChanged"
                  >
                    <md-tab
                      id="authcore-profile"
                      :md-label="$t('AuthCore.button.profile')"
                    />
                    <md-tab
                      id="authcore-settings"
                      :md-label="$t('AuthCore.button.settings')"
                    />
                  </md-tabs>
                  <auth-core-settings
                    :access-token="getAuthCoreAccessToken"
                    :is-profile="isShowAuthCoreProfile"
                    :options="{ internal: true }"
                    :language="getCurrentLocale"
                    @profile-updated="onAuthCoreProfileUpdated"
                    @primary-contact-updated="onAuthCoreProfileUpdated"
                  />
                </div>
              </div>
            </div>
          </no-ssr>

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
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';
import AuthCoreSettings from '~/components/AuthCore/Settings';

import {
  W3C_EMAIL_REGEX,
  OTHER_CONNECTION_LIST,
} from '@/constant';

import getTestAttribute from '@/util/test';
import User from '@/util/User';

import CivicLikerCta from '~/components/CivicLiker/CTA';
import OtherConnectList from '~/components/settings/OtherConnectList';
import ExternalLinksPanel from '~/components/settings/ExternalLinksPanel';

import TickIcon from '@/assets/tokensale/tick.svg';

export default {
  name: 'settings-index',
  components: {
    CivicLikerCta,
    AuthCoreSettings,
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
      isShowEditInAuthCore: false,
      isShowAuthCoreProfile: true,
      isVerifying: false,
      TickIcon,
      W3C_EMAIL_REGEX,
    };
  },
  computed: {
    ...mapGetters([
      'getUserHasWallet',
      'getUserInfo',
      'getUserIsRegistered',
      'getCurrentLocale',
      'getUserAuthPlatforms',
      'getUserSocialPlatforms',
      'getUserIsAuthCore',
      'getAuthCoreNeedReAuth',
      'getAuthCoreAccessToken',
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
    if (this.getAuthCoreNeedReAuth) {
      this.setReAuthDialogShow(true);
    }
  },
  methods: {
    ...mapActions([
      'updateUser',
      'updateUserAvatar',
      'syncAuthCoreUser',
      'refreshUserInfo',
      'sendVerifyEmail',
      'setInfoMsg',
      'setReAuthDialogShow',
      'setErrorMsg',
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
    focusAuthCore() {
      this.isShowEditInAuthCore = true;
      const widget = this.$refs.authcore;
      if (widget) {
        this.$nextTick(() => {
          widget.scrollIntoView();
        });
      }
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
          const { displayName } = this;
          const email = this.email.trim();
          const {
            user,
            displayName: currentDisplayName,
            email: currentEmail,
          } = this.getUserInfo;
          const hasEmailChanged = this.getUserInfo.email !== email;
          const userInfo = {};
          if (displayName !== currentDisplayName) userInfo.displayName = displayName;
          if (email !== currentEmail) userInfo.email = email;

          await this.updateUser(userInfo);
          this.setInfoMsg(`${this.$t('Register.form.label.updatedInfo')}  <a href="/${user}">${this.$t('Register.form.label.viewPage')}</a>`);
          await this.refreshUserInfo(user);

          if (hasEmailChanged && !this.getUserInfo.isEmailVerified) {
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
    async updateAvatar() {
      if (this.hasUserDetailsChanged) {
        try {
          const { avatarFile } = this;
          if (avatarFile) {
            await this.updateUserAvatar({
              avatarFile,
            });
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
          if (this.getUserIsAuthCore) {
            this.$nextTick(() => this.updateAvatar());
          }
        };
        reader.readAsDataURL(files[0]);
      }
    },
    onAuthCoreSettingTabsChanged(id) {
      this.isShowAuthCoreProfile = id === 'authcore-profile';
    },
    onClickAuthCoreReAuth() {
      this.setReAuthDialogShow(true);
    },
    onAuthCoreProfileUpdated() {
      this.syncAuthCoreUser();
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
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";
@import "~assets/input";

.civic-liker-cta--renewal {
  padding: 24px;
}

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
    /deep/ ul {
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

<template>
  <div class="likecoin-settings__personal-tab">

    <section
      v-if="getUserInfo.email && !getUserInfo.isEmailVerified"
      class="lc-container-0 lc-margin-top-48 lc-margin-bottom-24"
    >
      <div class="lc-container-1">
        <div class="lc-container-2">
          <VerifyEmailCta :email-ref="'in'" />
        </div>
      </div>
    </section>

    <div
      v-if="getUserIsAuthCore"
      class="lc-container-1 lc-margin-top-24"
    >
      <div class="lc-container-2  md-layout md-alignment-center-right ">
        <md-switch
          v-model="isShowAuthCorePanel"
          :disabled="disabled"
          class="md-likecoin"
        >{{ $t('AuthCore.Settings.title') }}</md-switch>
      </div>
    </div>

    <!-- User Info Form Section -->
    <template v-if="isShowAuthCorePanel && getUserIsAuthCore">
      <!-- Connections Section -->
      <section
        id="connect"
        class="lc-container-0 lc-margin-top-24"
      >
        <div class="lc-container-1">
          <div class="lc-container-2">
            <no-ssr>
              <div
                v-if="getAuthCoreNeedReAuth || getAuthCoreAccessToken"
                class="lc-container-3 lc-padding-vertical-32 lc-bg-gray-1"
              >
                <div class="lc-container-4">
                  <h2 class="lc-font-size-14 lc-font-weight-400">
                    {{ $t('AuthCore.Settings.title') }}
                  </h2>
                  <div
                    v-if="getAuthCoreNeedReAuth"
                    :class="[
                      'md-layout',
                      'md-alignment-center-center',
                      'lc-margin-top-16',
                      'lc-padding-vertical-64',
                      'lc-bg-white',
                      'md-elevation-1',
                    ]"
                  >
                    <md-button
                      class="md-likecoin"
                      @click="onClickAuthCoreReAuth"
                    >
                      {{ $t('AuthCore.button.reAuthNeeded') }}
                    </md-button>
                  </div>
                  <div
                    v-else-if="getAuthCoreAccessToken"
                    ref="authcore"
                  >
                    <md-tabs
                      :md-active-tab="authCoreTabId"
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
                      v-if="isShowAuthCoreWidget"
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
    </template>

    <div
      v-else
      class="lc-container-1 lc-margin-top-24 lc-mobile"
    >
      <div class="lc-container-2">
        <ProfileSettingsForm
          class="lc-container-3 lc-bg-gray-1"
          :liker-id="getUserInfo.user"
          :wallet-address="getUserWalletAddress"
          :email="email"
          :display-name="displayName"
          :description="description"
          :avatar="avatar"
          @upload-avatar="handleAvatarChange"
          @update-email="handleV2UpdateEamil"
          @save="handleV2SaveProfile"
        />
      </div>
    </div>
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

import OtherConnectList from '~/components/settings/OtherConnectList';
import ExternalLinksPanel from '~/components/settings/ExternalLinksPanel';
import VerifyEmailCta from '~/components/VerifyEmailCta';
import ProfileSettingsForm from '~/components/v2/ProfileSettingsForm';

import TickIcon from '@/assets/tokensale/tick.svg';

export default {
  name: 'settings-index',
  components: {
    AuthCoreSettings,
    OtherConnectList,
    ExternalLinksPanel,
    VerifyEmailCta,
    ProfileSettingsForm,
  },
  data() {
    return {
      avatar: '',
      avatarFile: null,
      couponCode: '',
      displayName: '',
      description: '',
      email: '',
      isShowEditInAuthCore: false,
      isShowAuthCoreWidget: true,
      isShowAuthCoreProfile: true,
      isShowAuthCorePanel: false,
      authCoreTabId: 'authcore-profile',
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
      'getUserWalletAddress',
    ]),
    disabled() {
      return this.isLoading || !this.getUserIsRegistered;
    },
    hasUserAvatarChanged() {
      return !!this.avatarFile;
    },
    hasUserDetailsChanged() {
      return (
        this.getUserInfo.email !== this.email
        || this.getUserInfo.displayName !== this.displayName
        || this.getUserInfo.description !== this.description
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
      this.isShowEditInAuthCore = false;
      const widget = this.$refs.authcore;
      if (widget) {
        this.$nextTick(() => {
          widget.scrollIntoView();
        });
      } else {
        this.onClickAuthCoreReAuth();
      }
    },
    async updateInfo() {
      const user = this.getUserInfo;
      this.avatar = user.avatar;
      this.displayName = user.displayName;
      this.description = user.description;
      this.email = user.email;
      this.fetchAuthPlatformsById(user.user);
      this.fetchSocialListDetailsById(user.user);
    },
    async onSubmit() {
      await this.updateAvatarIfChanged();
      if (this.hasUserDetailsChanged) {
        try {
          const { displayName, description } = this;
          const email = this.email && this.email.trim();
          const {
            user,
            displayName: currentDisplayName,
            description: currentDescription,
            email: currentEmail,
          } = this.getUserInfo;
          const hasEmailChanged = this.getUserInfo.email !== email;
          const userInfo = {};
          if (displayName !== currentDisplayName) userInfo.displayName = displayName;
          if (description !== currentDescription) userInfo.description = description;
          if (email !== currentEmail) userInfo.email = email;

          await this.updateUser(userInfo);
          this.setInfoMsg(`${this.$t('Register.form.label.updatedInfo')}  <a href="/${user}">${this.$t('Register.form.label.viewPage')}</a>`);
          await this.refreshUserInfo();

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
    async updateAvatarIfChanged() {
      if (!this.hasUserAvatarChanged) return;
      try {
        const { avatarFile } = this;
        await this.updateUserAvatar({ avatarFile });
      } catch (err) {
        this.updateInfo();
        console.error(err);
      }
    },
    onClickEditAvatar() {
      this.$refs.avatarFile.click();
    },
    onChangeAvatar(event) {
      const { files } = event.target;
      if (files && files[0]) {
        this.handleAvatarChange(files[0]);
      }
    },
    handleAvatarChange(file) {
      this.avatarFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatar = e.target.result;
        this.updateAvatarIfChanged();
      };
      reader.readAsDataURL(file);
    },
    onAuthCoreSettingTabsChanged(id) {
      this.authCoreTabId = id;
      this.isShowAuthCoreWidget = (id === 'authcore-profile' || id === 'authcore-settings');
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
    handleV2UpdateEamil(email) {
      if (!email) return;
      this.email = email;
      this.onSubmit();
    },
    handleV2SaveProfile({ displayName, description }) {
      if (displayName) {
        this.displayName = displayName;
      }
      this.description = description;
      this.onSubmit();
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
}
</style>

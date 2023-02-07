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
          :is-user-auth-core="getUserIsAuthCore"
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

import { W3C_EMAIL_REGEX } from '@/constant';

import getTestAttribute from '@/util/test';
import User from '@/util/User';

import VerifyEmailCta from '~/components/VerifyEmailCta';
import ProfileSettingsForm from '~/components/v2/ProfileSettingsForm';

import TickIcon from '@/assets/tokensale/tick.svg';

export default {
  name: 'settings-index',
  components: {
    AuthCoreSettings,
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
    ]),
    getTestAttribute: getTestAttribute('inSettings'),
    async updateInfo() {
      const user = this.getUserInfo;
      this.avatar = user.avatar;
      this.displayName = user.displayName;
      this.description = user.description;
      this.email = user.email;
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
    handleV2UpdateEamil(email) {
      if (this.getUserIsAuthCore) {
        this.isShowAuthCorePanel = true;
        return;
      }
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

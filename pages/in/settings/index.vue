<template>
  <div>
    <div class="lc-container-1 lc-margin-top-40">
      <div class="lc-container-2">
        <div class="lc-container-3 lc-padding-vertical-24 lc-bg-like-gradient">
          <div class="profile-setting-page__receive-coin-link-wrapper">
            <p>
              {{ $t('Settings.label.receiveLikeCoinLink') }}
              <nuxt-link
                v-if="getUserInfo.user"
                :to="{ name: 'id', params: { id: getUserInfo.user } }"
                class="lc-font-size-20 lc-color-like-green"
              >
                {{ receiveLikeCoinLink }}
              </nuxt-link>
            </p>
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

    <div class="lc-container-1 lc-margin-top-16">
      <div class="lc-container-2">
        <div class="lc-container-3 lc-padding-vertical-32 lc-bg-gray-1">
          <form
            id="account-setting-form"
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
                    {{ getUserInfo.wallet }}
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
                class="md-likecoin"
                form="account-setting-form"
                type="submit"
              >
                {{ $t('General.button.confirm') }}
              </md-button>
            </div>
          </form>

          <div
            v-if="getUserInfo.user"
            class="profile-setting-page__account-connection"
          >
            <div class="profile-setting-page__field profile-setting-page__field--multi-line">
              <span class="lc-margin-top-8">
                {{ $t('Edit.label.accountConnection') }}
              </span>
              <span
                :class="[
                  'profile-setting-page__account-connection-detail',
                  'lc-margin-top-8',
                  'lc-color-gray-9b'
                ]"
              >
                {{ $t('Settings.label.accountConnection') }}
              </span>
            </div>
            <social-media-connect
              :platforms="getUserSocialPlatforms"
              :username="getUserInfo.user"
              type="large"
              @disconnect="onClickSocialMediaDisconnect"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

import User from '@/util/User';
import {
  EXTERNAL_HOSTNAME,
  W3C_EMAIL_REGEX,
} from '@/constant';

import SocialMediaConnect from '~/components/SocialMediaConnect';

import TickIcon from '@/assets/tokensale/tick.svg';

export default {
  name: 'settings-index',
  components: {
    SocialMediaConnect,
  },
  data() {
    return {
      avatar: '',
      avatarFile: null,
      displayName: '',
      email: '',
      hasCopiedReceiveLikeCoinLink: false,
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
      'getUserIsReady',
      'getUserIsRegistered',
      'getUserNeedAuth',
      'getUserNeedRegister',
      'getUserSocialPlatforms',
    ]),
    disabled() {
      return this.isLoading || !(this.getUserIsReady && this.getUserIsRegistered);
    },
    hasUserDetailsChanged() {
      return (
        !!this.avatarFile ||
        this.getUserInfo.email !== this.email ||
        this.getUserInfo.displayName !== this.displayName
      );
    },
    receiveLikeCoinLink() {
      return `https://${EXTERNAL_HOSTNAME}/${this.getUserInfo.user}`;
    },
  },
  watch: {
    getUserNeedRegister(value) {
      if (value) {
        this.$router.push({ name: 'in-register', query: { ref: 'in-settings', ...this.$route.query } });
      }
    },
    getUserNeedAuth(value) {
      if (value) {
        this.triggerLoginSign();
      }
    },
    getUserIsReady(value) {
      if (value && this.getUserIsRegistered) {
        this.updateInfo();
      }
    },
    getUserInfo(value) {
      if (value && this.getUserIsRegistered && this.getUserIsReady) {
        this.updateInfo();
      }
    },
  },
  mounted() {
    if (this.getUserNeedRegister) {
      this.$router.push({ name: 'in-register', query: { ref: 'in-settings', ...this.$route.query } });
    } else if (this.getUserNeedAuth) {
      this.triggerLoginSign();
    } else if (this.getUserIsReady && this.getUserIsRegistered) {
      this.updateInfo();
    }
  },
  methods: {
    ...mapActions([
      'fetchSocialListDetailsById',
      'loginUser',
      'newUser',
      'refreshUserInfo',
      'sendVerifyEmail',
      'setInfoMsg',
      'unlinkSocialPlatform',
    ]),
    async triggerLoginSign() {
      if (!(await this.loginUser())) this.$router.go(-1);
    },
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
          const { user, wallet } = this.getUserInfo;
          const email = this.email.trim();
          const userInfo = {
            avatarFile,
            displayName,
            email,
            user,
            wallet,
          };
          const hasEmailChanged = this.getUserInfo.email !== email;

          const data = await User.formatAndSignUserInfo(userInfo, this.$t('Sign.Message.editUser'));
          await this.newUser(data);
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
    onCopyReceiveLikeCoinLink() {
      this.hasCopiedReceiveLikeCoinLink = true;
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
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";
@import "~assets/input";

.profile-setting-page {
  &__receive-coin-link-wrapper {
    display: flex;
    align-items: center;

    @media (min-width: 768px + 1px) {
      flex-direction: row;
      justify-content: space-between;
    }
    @media (max-width: 768px) {
      flex-direction: column;
    }

    p {
      display: flex;

      @media (min-width: 768px + 1px) {
        align-items: center;
        flex-direction: row;

        a {
          margin-left: 16px;
        }
      }
      @media (max-width: 768px) {
        flex-direction: column;

        width: 100%;

        text-align: center;
      }
    }

    span {
      @media (min-width: 768px + 1px) {
        margin-left: 16px;
      }
      @media (max-width: 768px) {
        overflow: hidden;

        max-width: calc(100% - 24px);

        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    .md-button {
      min-width: auto;
      height: 24px;
      margin: 0;
    }
  }

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

  &__account-connection {
    @media (min-width: 768px + 1px) {
      margin-left: 176px;
    }
  }

  &__account-connection-detail {
    max-width: 416px;
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
</style>

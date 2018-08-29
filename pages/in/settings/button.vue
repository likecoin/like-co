<template>
  <section class="like-button-settings">

    <div class="lc-container-1 lc-padding-top-32">
      <div class="lc-container-2">

        <div class="lc-container-3">
          <div class="like-button-settings__header">
            <h1>{{ $t('Settings.label.earnByLikeButton') }}</h1>
            <md-button class="lc-color-like-green lc-underline">
              {{ $t('Settings.button.learnMore') }}
            </md-button>
          </div>

          <div class="like-button-settings__examples lc-margin-top-32">
            <div
              v-for="item in categoryItems"
              :key="item.id"
              class="like-button-settings__example"
            >
              <div class="like-button-settings__example-header">
                <simple-svg
                  :filepath="getIconPath(item.icon)"
                  :height="item.size"
                  :width="item.size"
                  fill="#4a4a4a"
                />
                <h1>
                  {{ $t(`Settings.label.${item.id}.title`) }}
                </h1>
              </div>
              <div class="like-button-settings__example-content">
                <span>
                  {{ $t(`Settings.label.${item.id}.content`) }}
                </span>

                <md-button
                  v-if="item.id === 'wordpress'"
                  :href="WORDPRESS_PLUGIN_URL"
                  class="md-likecoin outline"
                  rel="noopener noreferrer"
                  target="_blank"
                >{{ $t('Settings.button.install') }}</md-button>
                <div
                  v-else-if="item.id === 'medium'"
                  class="like-button-settings__medium-url"
                >https://button.like.co/{{ getUserInfo.user }}</div>
              </div>
            </div>
          </div>
        </div>


        <div class="lc-container-3 lc-margin-top-24">
          <div class="like-button-settings__header">
            <h1>{{ $t('Settings.label.yourLikeButton') }}</h1>
          </div>

          <!-- <div>
            <mock-like-button
              :id="getUserInfo.user"
              :avatar="getUserInfo.avatar"
              :display-name="getUserInfo.displayName"
              :platforms="getUserSocialPlatforms"
            />
          </div> -->

          <div class="like-button-settings__social-media-settings lc-flex lc-margin-top-24">
            <div>
              {{ $t('Settings.label.displaySocialMediaOn') }}
              <br>
              <md-field class="no-underline">
                <!-- <label for="movie">Movie</label> -->
                <md-select
                  v-model="displayLinkOption"
                  class="lc-likecoin"
                >
                  <md-option value="0">Medium only</md-option>
                  <md-option value="1">WordPress only</md-option>
                </md-select>
              </md-field>
            </div>

            <form
              id="like-button-settings-form"
              @submit.prevent="onSubmit"
            >
              <span>{{ $t('Settings.label.selectSocialMediaLink') }}</span>
              <div class="like-button-settings__social-media-platforms-icons">
                <social-media-icon
                  v-for="socialMedia in socialMediaList"
                  :key="socialMedia.id"
                  :id="socialMedia.id"
                  :is-public="
                    socialMediasIsPublicState[socialMedia.id] !== undefined
                      ? socialMediasIsPublicState[socialMedia.id]
                      : getUserSocialPlatforms[socialMedia.id].isPublic
                  "
                  @change="onSocialMediaPublicityChange"
                />
                <md-button
                  :to="{ name: 'in-settings' }"
                  class="like-button-settings__setting-icon md-icon-button"
                  type="button"
                >
                  <simple-svg
                    :filepath="SettingsIcon"
                    fill="#c0c0c0"
                    height="20px"
                    width="20px"
                  />
                </md-button>
              </div>
              <div class="lc-text-align-right">
                <md-button
                  :disabled="isConfirmButtonDisabled"
                  class="md-likecoin lc-margin-top-32"
                  form="like-button-settings-form"
                  type="submit"
                >
                  {{ $t('General.button.confirm') }}
                </md-button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script>
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';

import SocialMediaIcon from '@/components/settings/SocialMediaIcon';
import MockLikeButton from '@/components/embed/MockButton';

import { WORDPRESS_PLUGIN_URL, SOCIAL_MEDIA_LIST } from '@/constant/index';
import SettingsIcon from '@/assets/icons/settings.svg';

const iconFolder = require.context('../../../assets/icons/social-media/');

const categoryItems = [
  {
    id: 'wordpress',
    icon: 'wordpress-with-bg',
    size: '40px',
  },
  {
    id: 'medium',
    icon: 'medium-with-bg',
    size: '32px',
  },
];

export default {
  name: 'in-settings-button',
  components: {
    SocialMediaIcon,
    MockLikeButton,
  },
  data() {
    return {
      isEmailEnabled: false,
      isEmailPreviouslyEnabled: false,
      isLoading: false,
      categoryItems,
      WORDPRESS_PLUGIN_URL,
      SettingsIcon,
      socialMediasIsPublicState: {},
      displayLinkOption: 0,
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
    socialMediaList() {
      return SOCIAL_MEDIA_LIST
        .filter(({ id }) => !!this.getUserSocialPlatforms[id]);
    },
    isConfirmButtonDisabled() {
      return !Object.keys(this.socialMediasIsPublicState)
        .some(id => this.socialMediasIsPublicState[id] !== undefined);
    },
  },
  watch: {
    getUserNeedRegister(value) {
      if (value) {
        this.$router.push({ name: 'in-register', query: { ref: 'in-settings-others', ...this.$route.query } });
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
      'loginUser',
      'newUser',
      'refreshUserInfo',
      'setInfoMsg',
      'updateSocialPlatformIsPublic',
    ]),
    async triggerLoginSign() {
      if (!(await this.loginUser())) this.$router.go(-1);
    },
    async updateInfo() {
      const user = this.getUserInfo;
      this.isEmailEnabled = (user.isEmailEnabled !== false);
      this.isEmailPreviouslyEnabled = this.isEmailEnabled;
    },
    getIconPath(name) {
      try {
        return iconFolder(`./${name}.svg`);
      } catch (err) {
        return null;
      }
    },
    onSocialMediaPublicityChange({ id, value }) {
      if (this.socialMediasIsPublicState[id] !== undefined) {
        Vue.set(this.socialMediasIsPublicState, id, undefined);
      } else {
        Vue.set(this.socialMediasIsPublicState, id, value);
      }
    },
    async onSubmit() {
      await this.updateSocialPlatformIsPublic({
        platforms: this.socialMediasIsPublicState,
        user: this.getUserInfo.user,
      });

      this.socialMediasIsPublicState = {};
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.like-button-settings {
  .lc-container-3 {
    padding-bottom: 32px;

    background-color: $like-gray-1;
  }

  h1 {
    color: $like-dark-brown-2;

    font-size: 32px;
  }

  .md-field {
    margin: -12px 0 0;

    :global(input) {
      font-size: 14px;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding-top: 16px;
  }

  &__example {
    position: relative;

    display: flex;
    flex-direction: column;

    width: 50%;
    padding-left: 76px;

    &s {
      display: flex;

      @media (max-width: 768px) {
        flex-direction: column;
      }
    }

    &-header {
      display: flex;
      align-items: center;
    }

    .simple-svg-wrapper {
      position: absolute;
      left: 32px;
    }

    &-content {
      display: flex;
      flex-direction: column;

      padding-top: 8px;
      padding-right: 32px;

      color: $like-gray-5;

      span {
        min-height: 48px;
      }
    }

    .md-button {
      max-width: 256px;
      margin: 0;

      text-align: center;
    }

    &:nth-child(odd) {
      &:after {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;

        width: 2px;

        content: ' ';

        background-color: $gray-e6;
      }
    }
  }

  &__medium-url {
    padding: 12px 10px;

    text-align: center;
    word-break: break-all;

    color: $like-dark-brown-2;
    background-color: $gray-e6;

    font-family: menlo, monospace;
    font-size: 16px;
  }

  &__social-media-settings {
    > div:first-child {
      margin-right: 72px;
    }
  }

  &__social-media-platforms-icons {
    > * {
      margin: 6px 12px 0 0;
    }
  }

  #like-button-settings-form {
    flex: 1;
  }

  &__setting-icon {
    width: 28px;
    min-width: 28px;
    height: 28px;
  }
}
</style>

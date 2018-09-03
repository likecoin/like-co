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

          <div class="like-button-settings__examples">
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
                <textarea
                  v-else-if="item.id === 'medium'"
                  v-model="likeButtonUrl"
                  readonly
                  @focus="$event.target.select()"
                />
                <md-button
                  v-if="item.id === 'oice'"
                  :href="OICE_URL"
                  class="md-likecoin outline"
                  rel="noopener noreferrer"
                  target="_blank"
                >{{ $t('Settings.button.createStory') }}</md-button>
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
                  :platform="socialMedia"
                  :is-public="getSocialMediaIsPublic(socialMedia.id)"
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
                <div v-if="!isSubmittingForm">
                  <md-button
                    :disabled="isConfirmButtonDisabled"
                    class="md-likecoin lc-margin-top-32"
                    form="like-button-settings-form"
                    type="submit"
                  >
                    {{ $t('General.button.confirm') }}
                  </md-button>
                </div>
                <md-button
                  v-else
                  class="md-likecoin lc-margin-top-32"
                  disabled
                >
                  <md-progress-spinner
                    :md-diameter="24"
                    :md-stroke="2"
                    md-mode="indeterminate"
                  />
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

import {
  EXTERNAL_HOSTNAME,
  OICE_URL,
  SOCIAL_MEDIA_LIST,
  WORDPRESS_PLUGIN_URL,
} from '@/constant/index';
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
  {
    id: 'oice',
    icon: 'oice',
    size: '34px',
  },
];

export default {
  name: 'in-settings-button',
  components: {
    SocialMediaIcon,
  },
  data() {
    return {
      isEmailEnabled: false,
      isEmailPreviouslyEnabled: false,
      isSubmittingForm: false,
      categoryItems,
      OICE_URL,
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
      'getUserSocialLinks',
    ]),
    userLinkList() {
      const links = Object.keys(this.getUserSocialLinks).map(id => ({
        id,
        ...this.getUserSocialLinks[id],
        isExternalLink: true,
      }));
      links.sort((link1, link2) => link1.order - link2.order);
      return links;
    },
    socialMediaList() {
      return [
        ...SOCIAL_MEDIA_LIST.filter(({ id }) => !!this.getUserSocialPlatforms[id]),
        ...this.userLinkList,
      ];
    },
    publicSocialMedia() {
      const platforms = {};
      this.socialMediaList.forEach(({ id, ...data }) => {
        if (this.getSocialMediaIsPublic(id)) {
          platforms[id] = data;
        }
      });
      return platforms;
    },
    isConfirmButtonDisabled() {
      return this.isSubmittingForm
        || !Object.keys(this.socialMediasIsPublicState)
          .some(id => this.socialMediasIsPublicState[id] !== undefined);
    },
    likeButtonUrl() {
      if (!this.getUserInfo.user) return '';
      return `https://button.like.co/${this.getUserInfo.user}`;
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
      this.isSubmittingForm = true;

      await this.updateSocialPlatformIsPublic({
        platforms: this.socialMediasIsPublicState,
        user: this.getUserInfo.user,
      });

      this.isSubmittingForm = false;
      this.socialMediasIsPublicState = {};
    },
    getSocialMediaIsPublic(id) {
      if (this.socialMediasIsPublicState[id] !== undefined) {
        return this.socialMediasIsPublicState[id];
      }
      return (this.getUserSocialPlatforms[id] || this.getUserSocialLinks[id]).isPublic;
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

@mixin separator {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;

  width: 2px;

  content: ' ';

  background-color: $gray-e6;
}

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

  &__examples {
    display: flex;
    flex-wrap: wrap;

    @media (max-width: 600px) {
      flex-direction: column;
    }
  }

  &__example {
    position: relative;

    display: flex;
    flex-direction: column;
    flex-shrink: 0;

    width: 100%;
    margin-top: 24px;
    padding: 12px 0 12px 76px;

    @media (min-width: 600px + 1px) and (max-width: 1024px) {
      width: 50%;

      &:nth-child(odd):after {
        @include separator();
      }
    }
    @media (min-width: 1024px + 1px) {
      width: 33%;

      &:not(:last-child):after {
        @include separator();
      }
    }
    @media (max-width: 600px) {
      border-top: $border-style-2;
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

      padding: 8px 32px 0 0;

      color: $like-gray-5;

      span {
        min-height: 48px;
        margin-bottom: 8px;
      }
    }

    .md-button {
      min-width: unset;
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
  textarea {
    margin-left: -44px;
    padding: 12px 10px;

    resize: none;
    text-align: center;
    word-break: break-all;

    color: $like-dark-brown-2;
    border: none;
    outline: none;
    background-color: $gray-e6;

    font-family: menlo, 'Courier New', Courier, monospace;
    font-size: 16px;
  }

  &__social-media-settings {
    @media (max-width: 600px) {
      flex-direction: column;
    }

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

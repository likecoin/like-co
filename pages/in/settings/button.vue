<template>
  <section class="like-button-settings">
    <transition name="lc-transition-fade">
      <div
        v-if="isShowIntro"
        key="intro"
        class="lc-container-1"
      >
        <div class="lc-container-2">
          <div class="lc-container-3 lc-container-no-padding-mobile">
            <like-button-intro
              class="lc-margin-top-48"
              @start="onClickIntroStart"
            />
          </div>
        </div>
      </div>

      <div
        v-else-if="isShowIntro === false"
        key="settings"
        class="lc-container-1 lc-padding-top-32"
      >
        <div class="lc-container-2">

          <div class="lc-container-3 lc-bg-gray-1">
            <div class="like-button-settings__header">
              <h1>{{ $t('Settings.label.earnByLikeButton') }}</h1>
              <md-button
                class="lc-color-like-green lc-underline"
                @click="isShowIntro = true"
              >{{ $t('Settings.button.learnMore') }}</md-button>
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
                  <selectable-field
                    v-else-if="item.id === 'medium'"
                  >{{ likeButtonUrl }}</selectable-field>
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


          <div class="lc-container-3 lc-margin-top-24 lc-bg-gray-1">
            <div class="like-button-settings__header">
              <h1>{{ $t('Settings.label.yourLikeButton') }}</h1>
            </div>

            <div class="like-button-settings__preview-wrapper lc-margin-top-12">
              <div
                :class="[
                  'like-button-settings__preview-header',
                  'lc-padding-top-24',
                  'lc-padding-bottom-16',
                ]"
              >
                <div class="like-button-settings__preview-header--left">
                  <span class="lc-font-weight-600 lc-color-like-gray-5">
                    {{ $t('Settings.label.preview') }}
                  </span>
                  <md-field class="no-underline">
                    <md-select
                      v-model="previewOption"
                      class="lc-likecoin"
                    >
                      <md-option value="wp">
                        {{ $t('Settings.label.wordpressVersion') }}
                      </md-option>
                      <md-option value="medium">
                        {{ $t('Settings.label.mediumVersion') }}
                      </md-option>
                    </md-select>
                  </md-field>
                </div>
                <!-- ! Uncomment when more sizes are supported ! -->
                <!-- <div class="like-button-settings__preview-header--right">
                  <span class="like-button-settings__size--active">M</span>
                </div> -->
              </div>
              <no-ssr>
                <div class="like-button-settings__preview-content lc-text-align-center">
                  <iframe
                    v-if="getUserInfo.user"
                    ref="previewLikeButton"
                    :src="previewLikeButtonUrl"
                    class="lc-margin-top-64 lc-margin-bottom-32 lc-mobile"
                    frameborder="0"
                    @load="() => updatePreviewInfo()"
                  />
                </div>
              </no-ssr>
            </div>

            <div class="like-button-settings__social-media-settings lc-flex lc-margin-top-24">
              <div>
                {{ $t('Settings.label.displaySocialMediaOn') }}
                <br>
                <md-field class="no-underline">
                  <!-- <label for="movie">Movie</label> -->
                  <md-select
                    v-model="displaySocialMediaOption"
                    class="lc-likecoin"
                  >
                    <md-option
                      v-for="option in DISPLAY_SOCIAL_MEDIA_OPTIONS"
                      :key="option"
                      :value="option"
                    >{{ $t(`Settings.label.displayOption.${option}`) }}</md-option>
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
    </transition>
  </section>
</template>


<script>
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';

import LikeButtonIntro from '@/components/LikeButtonIntro';
import SelectableField from '@/components/SelectableField';
import SocialMediaIcon from '@/components/settings/SocialMediaIcon';

import {
  DISPLAY_SOCIAL_MEDIA_OPTIONS,
  EXTERNAL_HOSTNAME,
  OICE_URL,
  SOCIAL_MEDIA_LIST,
  WORDPRESS_PLUGIN_URL,
} from '@/constant/index';
import SettingsIcon from '@/assets/icons/settings.svg';

const iconFolder = require.context('@/assets/icons/social-media/');

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
    LikeButtonIntro,
    SelectableField,
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
      displaySocialMediaOption: null,
      previewOption: DISPLAY_SOCIAL_MEDIA_OPTIONS[1],
      DISPLAY_SOCIAL_MEDIA_OPTIONS,
      isShowIntro: undefined,
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
      'getUserSocialMeta',
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
    isUpdatedSocialMediasIsPublicState() {
      return Object.keys(this.socialMediasIsPublicState)
        .some(id => this.socialMediasIsPublicState[id] !== undefined);
    },
    isUpdatedDisplaySocialMediaOption() {
      return this.displaySocialMediaOption !== this.getUserSocialMeta.displaySocialMediaOption;
    },
    isConfirmButtonDisabled() {
      if (this.isSubmittingForm) return true;
      if (!this.isUpdatedSocialMediasIsPublicState && !this.isUpdatedDisplaySocialMediaOption) {
        return true;
      }
      return false;
    },
    likeButtonUrl() {
      if (!this.getUserInfo.user) return '';
      return `https://button.like.co/${this.getUserInfo.user}`;
    },
    previewLikeButtonUrl() {
      return `https://${EXTERNAL_HOSTNAME}/in/embed/${this.getUserInfo.user}/preview/button`;
    },
    shouldPreviewShowSocialMedia() {
      if (
        this.previewOption === this.displaySocialMediaOption
        || this.displaySocialMediaOption === 'all'
      ) {
        return true;
      }
      return false;
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
    getUserInfo(user) {
      this.updatePreviewInfo();
      this.setIsShowLikeButtonIntro(user);
    },
    getUserSocialPlatforms() {
      this.updatePreviewInfo();
    },
    getUserSocialMeta({ displaySocialMediaOption }) {
      this.displaySocialMediaOption = displaySocialMediaOption;
    },
    shouldPreviewShowSocialMedia() {
      this.updatePreviewInfo();
    },
  },
  mounted() {
    if (this.getUserNeedRegister) {
      this.$router.push({
        name: 'in-register',
        query: {
          ref: 'in-settings-button',
          ...this.$route.query,
        },
      });
    } else if (this.getUserNeedAuth) {
      this.triggerLoginSign();
    } else if (this.getUserIsReady && this.getUserIsRegistered) {
      this.updateInfo();
    }

    this.setIsShowLikeButtonIntro(this.getUserInfo);
    this.displaySocialMediaOption = this.getUserSocialMeta.displaySocialMediaOption;
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

      if (this.shouldPreviewShowSocialMedia) {
        this.updatePreviewInfo();
      }
    },
    async onSubmit() {
      this.isSubmittingForm = true;
      const payload = {
        user: this.getUserInfo.user,
      };
      if (this.isUpdatedSocialMediasIsPublicState) {
        payload.platforms = this.socialMediasIsPublicState;
      }
      if (this.isUpdatedDisplaySocialMediaOption) {
        payload.displaySocialMediaOption = this.displaySocialMediaOption;
      }
      await this.updateSocialPlatformIsPublic(payload);

      this.isSubmittingForm = false;
      this.socialMediasIsPublicState = {};
    },
    updatePreviewInfo(message = {
      user: this.getUserInfo,
      platforms: this.shouldPreviewShowSocialMedia ? this.publicSocialMedia : {},
    }) {
      if (this.$refs.previewLikeButton) {
        this.$refs.previewLikeButton.contentWindow.postMessage({
          message,
          type: 'updatePreviewInfo',
        }, '*');
      }
    },
    getSocialMediaIsPublic(id) {
      if (this.socialMediasIsPublicState[id] !== undefined) {
        return this.socialMediasIsPublicState[id];
      }
      return (this.getUserSocialPlatforms[id] || this.getUserSocialLinks[id]).isPublic;
    },
    setIsShowLikeButtonIntro(user) {
      const { isShowIntro } = this.$route.params;
      if (isShowIntro !== undefined) {
        this.isShowIntro = isShowIntro;
      } else if (user.read) {
        this.isShowIntro = !user.read.likebuttonIntro;
      }
    },
    onClickIntroStart() {
      this.isShowIntro = false;
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
      padding-bottom: 0;

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
  }

  .selectable-field {
    margin-left: -44px;
  }

  &__preview {
    &-wrapper {
      background-color: $like-white;

      iframe {
        user-select: none;

        @media (min-width: 600px + 1px) {
          width: 470px;
          height: 200px;
        }
        @media (max-width: 600px) {
          width: 300px;
          height: 140px;
        }
      }
    }

    &-header {
      display: flex;
      justify-content: space-between;

      padding: 0 32px;

      border-bottom: $border-style-2;

      @media (max-width: 600px) {
        padding: 0 12px;
      }

      > * {
        display: flex;
        align-items: center;
      }

      &--left {
        .md-field {
          margin-left: 16px;
        }
      }

      &--right {
        color: $gray-9b;
      }
    }
  }

  &__size--active {
    color: $like-gray-5;

    font-weight: 600;
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

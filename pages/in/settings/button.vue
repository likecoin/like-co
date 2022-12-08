<template>
  <section class="like-button-settings">
    <div class="lc-container-1 lc-padding-top-32">
      <div class="lc-container-2">

        <div class="lc-container-3 lc-bg-gray-1">
          <div class="like-button-settings__header">
            <h1>{{ $t('Settings.label.earnByLikeButton') }}</h1>
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
        </div>
      </div>
    </div>
  </section>
</template>


<script>
import { mapGetters } from 'vuex';

import {
  EXTERNAL_HOSTNAME,
  LIKE_BUTTON_POST_MESSAGE_TARGET_ORIGIN,
  WORDPRESS_PLUGIN_URL,
} from '@/constant/index';

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
];

export default {
  name: 'in-settings-button',
  data() {
    return {
      isEmailEnabled: false,
      isEmailPreviouslyEnabled: false,
      categoryItems,
      WORDPRESS_PLUGIN_URL,
    };
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getUserIsRegistered',
    ]),
    likeButtonUrl() {
      if (!this.getUserInfo.user) return '';
      return `https://button.like.co/${this.getUserInfo.user}`;
    },
    previewLikeButtonUrl() {
      return `https://button.${EXTERNAL_HOSTNAME}/in/embed/${this.getUserInfo.user}/button/preview`;
    },
  },
  watch: {
    getUserInfo() {
      this.updatePreviewInfo();
    },
  },
  mounted() {
    if (this.getUserIsRegistered) {
      this.updateInfo();
    }
  },
  methods: {
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
    updatePreviewInfo(content = {
      user: this.getUserInfo,
    }) {
      const { previewLikeButton: el } = this.$refs;
      if (el) {
        // Strip away any Vue.js reactive listener
        const message = JSON.parse(JSON.stringify({
          action: 'PREVIEW',
          content,
        }));
        el.contentWindow.postMessage(message, LIKE_BUTTON_POST_MESSAGE_TARGET_ORIGIN);
      }
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

    /deep/ input {
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

    @media (min-width: 600px) {
      width: 50%;

      &:nth-child(odd):after {
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

        span {
          flex-shrink: 0;
        }
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

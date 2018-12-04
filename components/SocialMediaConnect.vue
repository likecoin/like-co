<template>
  <div
    v-if="socialMediaList.length > 0"
    :class="[
      'social-media-connect',
      {
        'social-media-connect--center': !!center,
        'social-media-connect--colorful': !!colorful,
      },
    ]"
  >
    <div>

      <ul>
        <li
          v-for="socialMedia in socialMediaList"
          :key="socialMedia.id"
        >
          <div class="social-media-connect__button-wrapper">
            <button
              :class="[
                'social-media-connect__button',
                `social-media-connect__button--${socialMedia.id}`,
                `social-media-connect__button--${
                  getIsConnected(socialMedia) ? 'connected' : 'disconnected'
                }`,
              ]"
              :title="getSocialMediaTitle(socialMedia)"
              type="button"
              @click="onClick(socialMedia)"
            >
              <simple-svg
                :filepath="getIconPath(socialMedia.id)"
                height="36px"
                width="36px"
                fill="white"
              />
            </button>
          </div>
        </li>

      </ul>

    </div>
  </div>
</template>

<script>
import LikeCoinIcon from '~/assets/logo/icon.svg';

import {
  EMAIL_REGEX,
  SOCIAL_MEDIA_LIST,
} from '@/constant';

import { openURL } from '~/util/client';
import { logTrackerEvent } from '@/util/EventLogger';
import { getUrlWithPrefix } from '@/util/social';

const iconFolder = require.context('../assets/icons/social-media/');

export default {
  name: 'social-media-connect',
  props: {
    platforms: {
      type: Object,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    center: {
      type: [Boolean, String],
      default: false,
    },
    limit: {
      type: Number,
      default: undefined,
    },
    userLink: {
      type: String,
      default: undefined,
    },
    colorful: {
      type: [Boolean, String],
      default: false,
    },
  },
  computed: {
    socialMediaList() {
      const platforms = SOCIAL_MEDIA_LIST.filter(platform => this.getIsConnected(platform));

      const links = Object.keys(this.platforms)
        .filter(id => this.platforms[id].isExternalLink)
        .map(id => ({ id, url: this.platforms[id].url }));

      links.sort(({ id: id1 }, { id: id2 }) => (
        this.platforms[id1].order - this.platforms[id2].order
      ));

      return [...platforms, ...links].slice(0, this.limit);
    },
  },
  methods: {
    getIconPath(id) {
      try {
        const filePath = this.platforms[id] && this.platforms[id].isExternalLink
          ? `link/${this.platforms[id].iconType}`
          : id;
        return iconFolder(`./${filePath}.svg`);
      } catch (err) {
        return LikeCoinIcon;
      }
    },
    getIsConnected({ id, tier } = {}) {
      const platform = this.platforms[id];
      return (
        !!platform || (tier === 0 && (id === 'likecoin' && this.userLink))
      );
    },
    getSocialMediaUrl({ id }) {
      const platform = this.platforms[id];
      switch (id) {
        case 'likecoin':
          return this.userLink;
        default:
          if (platform && platform.url) {
            return getUrlWithPrefix(platform.url);
          }
          return null;
      }
    },
    getSocialMediaTitle({ id }) {
      const platform = this.platforms[id];
      return /link\d+/.test(id) ? platform.siteDisplayName : id;
    },
    async onClick(socialMedia) {
      const { id } = socialMedia;
      const platform = this.platforms[id];
      const isConnected = this.getIsConnected(socialMedia);
      if (isConnected) {
        const { url } = platform;
        if (url) {
          const isEmail = new RegExp(EMAIL_REGEX).test(url);
          let urlPath = this.getSocialMediaUrl(socialMedia);
          if (isEmail) {
            urlPath = `mailto:${url}`;
          }
          openURL(this, urlPath, '_blank');
          logTrackerEvent(this, 'LikeWidget', 'ClickSocialMedia', id, 1);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

.social-media-connect {
  > div {
    display: flex;
  }

  &--center > div {
    justify-content: center;
  }

  ul {
    display: flex;
    flex-wrap: wrap;

    margin: -10px -8px;
    padding: 0;

    list-style: none;

    > li {
      display: flex;
      flex-shrink: 0;

      padding: 8px 6px;
    }
  }

  &__button-wrapper {
    max-width: 100%;

    cursor: pointer;

    &:hover {
      .social-media-connect__button {
        background-color: darken($like-gray-5, 10);
      }
    }
    &:active {
      .social-media-connect__button {
        background-color: darken($like-gray-5, 20);
      }
    }
  }

  &__button {
    margin: 2px;

    cursor: pointer;
    transition: background-color .25s ease;

    border: none;
    border-radius: 50%;
    background-color: $like-gray-5;

    &--disconnected {
      background-color: $gray-c0;

      &:hover {
        background-color: darken($gray-c0, 20);
      }
      &:active {
        background-color: darken($gray-c0, 30);
      }
    }

    @each $key, $value in $platform-color-map {
      &--#{$key}#{&}--connected {
        &:hover,
        .social-media-connect--colorful & {
          background-color: $value;

          &:hover {
            background-color: lighten($value, 4);
          }
          &:active {
            background-color: darken($value, 2);
          }
        }
        &:active {
          background-color: darken($value, 10);
        }
      }
    }
  }
}

button[class*=social-media-connect__button--link] {
  background-color: transparent !important;
}
</style>

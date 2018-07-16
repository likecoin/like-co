<template>
  <div
    v-if="socialMediaList.length > 0"
    :class="[
      'social-media-connect',
      `social-media-connect--${type}`,
      {
        'social-media-connect--center': !!center,
      },
    ]"
  >
    <div>

      <ul>
        <li
          v-for="socialMedia in socialMediaList"
          :key="socialMedia.id"
        >
          <button
            :class="[
              'social-media-connect__button',
              `social-media-connect__button--${
                getIsConnected(socialMedia.id) ? 'connected' : 'disconnected'
              }`,
            ]"
            type="button"
            @click="onClickButton(socialMedia)"
          >
            <simple-svg
              :filepath="getIconPath(socialMedia.id)"
              fill="white"
              width="36px"
              height="36px"
            />
          </button>
        </li>

        <!-- Will not show until settings page is finished
        <li v-if="isMini">
          <md-button
            class="social-media-connect__add-button md-icon-button"
            type="button"
            :to="{ name: 'in-settings' }"
          >
            <simple-svg
              :filepath="getIconPath('add')"
              fill="#C0C0C0"
              width="22px"
              height="22px"
            />
          </md-button>
        </li>
        -->
      </ul>

    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import { openURL } from '~/util/client';

const TYPE = {
  READONLY: 'readonly',
  MINI: 'mini',
  LARGE: 'large',
};

const SOCIAL_MEDIA_LIST = [
  {
    id: 'facebook',
    tier: 1,
  },
  {
    id: 'flickr',
    tier: 1,
  },
  {
    id: 'medium',
    tier: 1,
  },
  {
    id: 'twitter',
    tier: 1,
  },
  {
    id: 'instagram',
    tier: 1,
  },
];

const iconFolder = require.context('../assets/icons/social-media/');

export default {
  name: 'social-media-connect',
  props: {
    type: {
      type: String,
      default: TYPE.READONLY,
      validator(value) {
        return !!TYPE[value.toUpperCase()];
      },
    },
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
  },
  computed: {
    isMini() {
      return this.type === TYPE.MINI;
    },
    socialMediaList() {
      return SOCIAL_MEDIA_LIST
        .filter(({ id, tier }) => {
          const isConnected = this.getIsConnected(id);
          return (
            (this.type === TYPE.READONLY && isConnected) ||
            (this.type === TYPE.MINI && (isConnected || tier === 1)) ||
            this.type === TYPE.LARGE
          );
        })
        .slice(0, this.limit);
    },
  },
  methods: {
    ...mapActions([
      'fetchSocialPlatformLink',
      'linkSocialPlatform',
    ]),
    getIconPath(id) {
      return iconFolder(`./${id}.svg`);
    },
    getIsConnected(id) {
      return !!this.platforms[id];
    },
    onClickButton(socialMedia) {
      const isConnected = this.getIsConnected(socialMedia.id);
      if (!isConnected) {
        this.connect(socialMedia);
      } else if (this.platforms[socialMedia.id].url) {
        openURL(
          this,
          this.platforms[socialMedia.id].url,
          '_blank',
          'noopener',
        );
      }
    },
    async connect(socialMedia) {
      switch (socialMedia.id) {
        case 'facebook': {
          if (!window.FB) return;
          window.FB.login((response) => {
            if (response.authResponse.accessToken) {
              this.linkSocialPlatform({
                platform: 'facebook',
                payload: {
                  user: this.username,
                  access_token: response.authResponse.accessToken,
                },
              });
            } else {
              // error case
            }
          }, { scope: 'public_profile,pages_show_list,user_link' });
          break;
        }
        default: {
          const { url } = await this.fetchSocialPlatformLink({
            platform: socialMedia.id,
            id: this.username,
          });
          document.location = url;
          break;
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
      padding: 8px 6px;
    }
  }


  &__button {
    margin: 2px;

    background-color: $like-gray-5;

    cursor: pointer;

    &:hover {
      background-color: darken($like-gray-5, 10);
    }
    &:active {
      background-color: darken($like-gray-5, 20);
    }

    transition: background-color .25s ease;

    border: none;
    border-radius: 50%;

    &--disconnected {
      background-color: $gray-c0;

      &:hover {
        background-color: darken($gray-c0, 20);
      }
      &:active {
        background-color: darken($gray-c0, 30);
      }
    }
  }

  &__add-button {
    margin: 0 -7px;
    padding: 7px;
  }
}
</style>

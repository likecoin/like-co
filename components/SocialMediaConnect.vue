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
          <div
            class="social-media-connect__button-wrapper"
          >
            <button
              :class="[
                'social-media-connect__button',
                `social-media-connect__button--${socialMedia.id}`,
                `social-media-connect__button--${
                  getIsConnected(socialMedia) ? 'connected' : 'disconnected'
                }`,
              ]"
              type="button"
              @click="onClickConnectButton(socialMedia)"
            >
              <simple-svg
                :filepath="getIconPath(socialMedia.id)"
                :height="iconSize"
                :width="iconSize"
                fill="white"
              />
            </button>
            <div
              v-if="isLarge"
              class="social-media-connect__label"
            >
              <i18n
                v-if="!getIsConnected(socialMedia.id)"
                class="social-media-connect__label--connect"
                path="SocialMediaConnect.button.connectToPlatform"
                @click="onClickConnectButton(socialMedia)"
              >
                <span place="platform">{{ socialMedia.id }}</span>
              </i18n>
              <p
                v-else
                class="social-media-connect__label--connected"
                @click="onClickConnectButton(socialMedia)"
              >
                <span>{{ getSocialMediaUserDisplayName(socialMedia.id) }}</span>
                <span>@{{ socialMedia.id }}</span>
              </p>
              <md-field
                v-if="isLarge && getIsConnected(socialMedia.id) && socialMedia.id === 'facebook'"
              >
                <span class="lc-color-gray-9b lc-font-size-12">
                  {{ $t('SocialMediaConnect.label.linkTo') }}
                </span>
                <md-select
                  v-if="linkedFacebookAc"
                  v-model="linkedFacebookAc"
                  @md-selected="onSelectFacebookPageLink"
                >
                  <md-option
                    v-for="page in facebookPages"
                    :key="page.id"
                    :value="page.id"
                  >
                    {{ page.name }}
                  </md-option>
                </md-select>
              </md-field>
            </div>
          </div>
          <md-button
            v-if="isLarge && getIsConnected(socialMedia.id)"
            class="md-icon-button"
            @click="onClickDisconnectButton(socialMedia)"
          >
            <simple-svg
              :filepath="DeleteIcon"
              height="24px"
              width="24px"
            />
          </md-button>
        </li>

        <!-- show until more platforms are supported
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
import { mapActions, mapGetters } from 'vuex';

import DeleteIcon from '~/assets/icons/cross.svg';

import { openURL } from '~/util/client';

const TYPE = {
  READONLY: 'readonly',
  MINI: 'mini',
  LARGE: 'large',
};

const SOCIAL_MEDIA_LIST = [
  {
    id: 'likecoin',
    tier: 0,
  },
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
  /*
  {
    id: 'instagram',
    tier: 1,
  },
  */
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
    userLink: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      DeleteIcon,
      linkedFacebookAc: null,
    };
  },
  computed: {
    isMini() {
      return this.type === TYPE.MINI;
    },
    isLarge() {
      return this.type === TYPE.LARGE;
    },
    iconSize() {
      return this.type === TYPE.LARGE ? '28px' : '36px';
    },
    socialMediaList() {
      return SOCIAL_MEDIA_LIST
        .filter((socialMedia) => {
          const { tier } = socialMedia;
          const isConnected = this.getIsConnected(socialMedia);
          return (
            (this.type === TYPE.READONLY && isConnected) ||
            (this.type === TYPE.MINI && (isConnected || tier === 1)) ||
            this.type === TYPE.LARGE
          );
        })
        .slice(0, this.limit);
    },
    facebookPages() {
      return [
        {
          id: this.platforms.facebook.id,
          name: this.$t('SocialMediaConnect.label.fbWall'),
        },
        ...(this.platforms.facebook.pages || []),
      ];
    },
    ...mapGetters(['getUserInfo']),
  },
  watch: {
    platforms: {
      handler(p) {
        this.updateSelectedFacebookPage(p);
      },
      deep: true,
    },
  },
  mounted() {
    this.updateSelectedFacebookPage(this.platforms);
  },
  methods: {
    ...mapActions([
      'fetchSocialPlatformLink',
      'linkSocialPlatform',
      'selectFacebookPageLink',
    ]),
    getIconPath(id) {
      return iconFolder(`./${id}.svg`);
    },
    getIsConnected({ id, tier }) {
      return !!this.platforms[id] || (
        tier === 0 && (id === 'likecoin' && this.userLink)
      );
    },
    getSocialMediaUserDisplayName(id) {
      return this.platforms[id].displayName;
    },
    onClickConnectButton(socialMedia) {
      const { id, tier } = socialMedia;
      const platform = this.platforms[id];
      const isConnected = !!platform || tier === 0;
      if (!isConnected) {
        this.connect(socialMedia);
      } else {
        let url;
        switch (id) {
          case 'likecoin':
            url = this.userLink;
            break;

          default:
            if (platform) ({ url } = platform);
            break;
        }
        if (url) openURL(this, url, '_blank', 'noopener');
      }
    },
    onClickDisconnectButton(socialMedia) {
      this.$emit('disconnect', socialMedia.id);
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
    async onSelectFacebookPageLink(pageId) {
      await this.selectFacebookPageLink({
        pageId,
        payload: {
          user: this.getUserInfo.user,
        },
      });
    },
    updateSelectedFacebookPage(platforms) {
      if (this.isLarge && platforms && platforms.facebook) {
        const { facebook } = platforms;
        let model = facebook.id;
        (facebook.pages || []).forEach((page) => {
          if (page.link === facebook.url) {
            model = page.id;
          }
        });
        // show which facebook page/ac is currently shown in public
        this.linkedFacebookAc = model;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

$hover-color-map: (
  likecoin: $like-green,
  facebook: #3b5998,
  flickr: #0063dc,
  instagram: #c7548a,
  medium: #231f20,
  twitter: #1ea1f2,
);

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

      .social-media-connect__label--connect {
        color: darken($like-gray-4, 10);
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

    @each $key, $value in $hover-color-map {
      &--#{$key}#{&}--connected {
        &:hover {
          background-color: $value;
        }
        &:active {
          background-color: darken($value, 10);
        }
      }
    }
  }

  &__add-button {
    margin: 0 -7px;
    padding: 7px;
  }

  &--large {
    li {
      width: 50%;

      @media (max-width: 600px) {
        width: 100%;
      }

      .md-icon-button {
        width: 24px;
        min-width: auto;
        height: 24px;
        margin-top: 3px;

        :global(.md-ripple) {
          padding: 0;
        }
      }
    }

    .social-media-connect {
      &__button-wrapper {
        display: inline-flex;
        align-items: center;
      }

      &__label {
        margin-left: 8px;

        p {
          overflow: hidden;

          cursor: pointer;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        &--connect {
          text-decoration: underline;

          color: $like-gray-4;

          span {
            text-transform: capitalize;
          }
        }

        &--connected {
          font-weight: 600;

          span:first-child {
            color: $like-green;
          }

          span:last-child {
            color: $gray-9b;
          }
        }
      }
    }
  }
}

.md-field {
  align-items: center;

  min-height: auto;
  margin: 0;
  padding-top: 0;

  &:before,
  &:after {
    content: none;
  }

  .md-menu {
    margin-left: 4px;

    :global(.md-input) {
      height: 24px;
      margin-top: -4px;
      padding-top: 4px;

      border-bottom: 1px solid $like-gray-5;

      font-size: 12px;
      font-weight: 600;

      -webkit-text-fill-color: $like-gray-5;
      &::placeholder {
        font-size: 12px;
      }
    }
  }

  :global(.md-icon) {
    width: 20px;
    min-width: auto;
    height: 20px;
  }
}
</style>

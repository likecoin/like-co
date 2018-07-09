<template>
  <div :class="[
    'social-media-connect',
    `social-media-connect--${type}`
  ]">
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
    tier: 2,
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
    user: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isMini() {
      return this.type === TYPE.MINI;
    },
    socialMediaList() {
      return SOCIAL_MEDIA_LIST.filter((socialMedia) => {
        if (this.type !== TYPE.LARGE && socialMedia.tier > 1) {
          return false;
        }
        return true;
      });
    },
  },
  methods: {
    getIconPath(id) {
      return iconFolder(`./${id}.svg`);
    },
    getIsConnected(id) {
      const key = `isConnected${id.charAt(0).toUpperCase() + id.slice(1)}`;
      return !!this.user[key];
    },
    onClickButton(socialMedia) {
      const isConnected = this.getIsConnected(socialMedia.id);
      if (isConnected) {
        this.connect(socialMedia);
      }
    },
    connect(socialMedia) {
      switch (socialMedia.id) {
        case 'facebook':
          // TODO
          break;
        default:
          break;
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

    transition: background-color .25s ease;

    border: none;
    border-radius: 50%;

    &--connected {
      background-color: $like-gray-5;
    }

    &--disconnected {
      cursor: pointer;

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

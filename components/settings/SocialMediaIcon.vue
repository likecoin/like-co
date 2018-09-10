<template>
  <div
    :class="[
      'social-media-icon',
      {
        'social-media-icon--on': isPublic !== isHovered,
        'social-media-icon--hover': isHovered,
      }
    ]"
  >
    <lc-tooltip :is-listen-to-click="false">
      <div
        slot="activator"
        :class="[
          'social-media-icon__icon-wrapper',
          {
            'social-media-icon__icon-wrapper--link': platform.isExternalLink,
          }
        ]"
        @mouseover="onHover(true)"
        @mouseleave="onHover(false)"
        @click="onClick"
      >
        <simple-svg
          :filepath="iconPath"
          :height="iconSize"
          :width="iconSize"
          class="social-media-icon__icon"
          fill="white"
        />
        <simple-svg
          :filepath="publicIconPath"
          :height="iconSize"
          :width="iconSize"
          class="social-media-icon__visibility"
          fill="white"
        />
      </div>

      <div
        v-if="platform.isExternalLink && !!platform.url"
        class="social-media-icon__tooltip-content"
      >
        {{ platform.url }}
      </div>
    </lc-tooltip>
  </div>
</template>

<script>
import LcTooltip from '@/components/settings/Tooltip';

import LikeCoinIcon from '@/assets/logo/icon.svg';

const iconFolder = require.context('../../assets/icons/social-media/');

export default {
  name: 'social-media-icon',
  components: {
    LcTooltip,
  },
  props: {
    platform: {
      type: Object,
      default: () => {},
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      iconSize: '28',
      isHovered: false,
    };
  },
  computed: {
    iconPath() {
      try {
        const filePath = this.platform && this.platform.isExternalLink
          ? `link/${this.platform.iconType}`
          : `${this.platform.id}`;
        return iconFolder(`./${filePath}.svg`);
      } catch (error) {
        return LikeCoinIcon;
      }
    },
    publicIconPath() {
      return iconFolder(`./switch-${this.isPublic ? 'off' : 'on'}.svg`);
    },
  },
  methods: {
    onHover(isHovered) {
      this.isHovered = isHovered;
    },
    onClick() {
      this.$emit('change', {
        id: this.platform.id,
        value: !this.isPublic,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

.social-media-icon {
  position: relative;

  display: inline-block;

  cursor: pointer;

  &__icon-wrapper {
    transition: opacity 0.2s ease-in-out;

    opacity: 0.2;
    border-radius: 50%;

    &:not(.social-media-icon__icon-wrapper--link) {
      background-color: $like-gray-5;
    }
  }

  &--on {
    .social-media-icon__icon-wrapper {
      opacity: 1;
    }
  }

  &--hover {
    .social-media-icon__icon {
      opacity: 0;
    }

    .social-media-icon__visibility {
      opacity: 1;
    }

    .social-media-icon__icon-wrapper--link {
      background-color: $like-gray-5;
    }
  }

  &__visibility {
    position: absolute;
    top: 0;
    left: 0;

    opacity: 0;
  }

  :global(.lc-tooltip__content) {
    top: 40px;

    padding: 4px 16px;
  }
}
</style>

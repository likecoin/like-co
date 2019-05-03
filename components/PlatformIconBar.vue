<template>
  <div
    :class="['icon-bar', size, { vertical: isVertical }]"
  >
    <md-button
      v-for="(platform, index) in platforms"
      :key="index"
      :href="platform.url"
      class="md-icon-button"
      target="_blank"
      rel="noopener noreferrer"
    >
      <simple-svg
        :filepath="imgUrl(`${platform.name}.svg`)"
        :width="iconSize"
        :height="iconSize"
        fill="white"
        stroke="transparent"
      />
    </md-button>
  </div>
</template>

<script>
import { EXTERNAL_HOSTNAME, LIKE_CO_PLATFORMS } from '@/constant';

const images = require.context('../assets/icons/');

export default {
  name: 'platform-icon-bar',
  props: {
    isVertical: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      validator(value) {
        return ['small', 'medium', 'large'].indexOf(value) !== -1;
      },
      default: 'small',
    },
  },
  data() {
    return {
      EXTERNAL_HOSTNAME,
      platforms: LIKE_CO_PLATFORMS,
    };
  },
  computed: {
    iconSize() {
      let size;
      switch (this.size) {
        case 'medium':
          size = 40;
          break;
        case 'large':
          size = 64;
          break;
        default:
          size = 28;
      }
      return `${size}px`;
    },
  },
  methods: {
    imgUrl(path) {
      return images(`./${path}`);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

$icon-size-large: 64px;

.icon-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;

  transition: opacity 0.75s ease-in;

  @media (max-width: 600px) {
    max-width: 210px;
  }

  &.hide {
    user-select: none;
    pointer-events: none !important;

    opacity: 0;
  }

  &.vertical {
    flex-direction: column;
    justify-content: center;
  }

  .md-icon-button {
    margin: 0 2px;

    &:last-child {
      margin-right: 0;
    }
    &:hover {
      /deep/ svg {
        opacity: .7;
      }
    }

    /deep/ .md-button-content {
      border-radius: 50%;
      background-color: $like-white;
    }

    /deep/ .md-ripple {
      padding: 0 6px;
    }

    /deep/ svg {
      transition: opacity .25s ease-in;
    }
  }

  .language {
    margin-left: 16px;

    cursor: pointer;

    color: $like-green;
  }

  /deep/ svg {
    fill: unset !important;
    stroke: unset !important;
  }
}

.md-icon-button {
  .medium.vertical & {
    margin: 8px 0;
  }
  .medium:not(.vertical) & {
    margin: 0 8px;
  }

  .large & {
    width: $icon-size-large;
    min-width: $icon-size-large;
    height: $icon-size-large;
  }
  .large:not(.vertical) & {
    margin: 0 10px;
  }
}
</style>

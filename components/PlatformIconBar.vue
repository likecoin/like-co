<template>
  <div :class="['icon-bar', size, { vertical: isVertical }]">
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
const images = require.context('../assets/icons/');

const platforms = [
  {
    name: 'telegram',
    url: 'https://t.me/likecoin',
  },
  {
    name: 'medium',
    url: 'https://medium.com/likecoin',
  },
  {
    name: 'github',
    url: 'https://github.com/likecoin/',
  },
  {
    name: 'twitter',
    url: 'https://twitter.com/likecoin_fdn',
  },
  {
    name: 'youtube',
    url: 'https://www.youtube.com/c/LikeCoin',
  },
  {
    name: 'facebook',
    url: 'https://www.facebook.com/likecoin.foundation',
  },
];

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
      platforms,
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

  @media (max-width: 600px) {
    max-width: 210px;
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
      :global(svg) {
        opacity: .7;
      }
    }

    :global(.md-button-content) {
      background-color: $like-white;
    }

    :global(.md-ripple) {
      padding: 0 6px;
    }

    :global(svg) {
      transition: opacity .25s ease-in;
    }
  }

  .language {
    margin-left: 16px;

    cursor: pointer;

    color: $like-green;
  }

  :global(svg) {
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

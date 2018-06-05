<template>
<div :class="['icon-bar', { vertical: isVertical }]">
  <md-button
    class="md-icon-button"
    v-for="(platform, index) in platforms"
    :key="index"
    :href="platform.url"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img :src="imgUrl(`${platform.name}.svg`)" />
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
  },
  data() {
    return {
      platforms,
    };
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

.icon-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    max-width: 210px;
  }

  &.vertical {
    justify-content: center;
    flex-direction: column;

    .md-icon-button {
      margin: 0;
    }
  }

  .md-icon-button {
    margin: 0 2px;

    &:last-child {
      margin-right: 0;
    }
    &:hover {
      opacity: .7;
    }

    :global(.md-ripple) {
      padding: 0 6px;
    }
  }

  .language {
    margin-left: 16px;
    cursor: pointer;
    color: $like-green;
  }
}
</style>

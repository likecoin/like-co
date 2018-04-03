<template>
<div class="icon-bar">
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
    name: 'twitter',
    url: 'https://twitter.com/likecoin_fdn',
  },
  {
    name: 'github',
    url: 'https://github.com/likecoin/',
  },
  {
    name: 'facebook',
    url: 'https://www.facebook.com/likecoin.foundation',
  },
];

export default {
  name: 'platform-icon-bar',
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

  .md-icon-button {
    &:last-child {
      margin-right: 0;
    }
    &:hover {
      opacity: .7;
    }
  }

  .language {
    margin-left: 16px;
    cursor: pointer;
    color: $like-green;
  }
}
</style>

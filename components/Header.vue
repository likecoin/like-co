<template>
  <div id="site-header">
    <nuxt-link class="title" :to="{ name: 'index' }">{{ title }}</nuxt-link>
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
      <!-- <a class="md-icon-button language">En</a> -->
    </div>

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
    url: 'https://www.facebook.com/groups/likecoin/',
  },
];

export default {
  name: 'site-header',
  data() {
    return {
      platforms,
      title: 'likecoin.store',
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
@import "../assets/index.scss";

#site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin: 48px 8px;

  .title {
    font-size: 18px;
    color: $like-green;
  }

  .icon-bar {
    display: flex;
    align-items: center;

    .md-icon-button {
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
}

@media (max-width: 768px) {
  #site-header {
    flex-direction: column;
    margin: 24px 0 12px;

    .title {
      display: none;
    }
  }
}
</style>

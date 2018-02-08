<template>
  <div id="site-header">
    <nuxt-link :class="`title ${isTest ? 'test' : ''}`" :to="{ name: 'index' }">
      LikeCoin Store
      <span class="sup">
        {{ isTest ? 'test' : 'beta' }}
      </span>
    </nuxt-link>
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
import { IS_TESTNET } from '@/constant';

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
      isTest: IS_TESTNET,
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
@import "../assets/index";

#site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin: 48px 8px;

  .title {
    font-size: 18px;
    color: $like-green;
    text-decoration: none;

    &.test {
      color: $like-red;
    }

    > .sup {
      vertical-align: super;
      font-size: 12px;
    }
  }

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

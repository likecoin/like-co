<template>
  <div class="avatar-grid-card">
    <div>

      <img v-lazy="avatar" />
      <h1>{{ title }}</h1>
      <h2>{{ subtitle }}</h2>
      <p class="description" v-html="description" />

      <div class="platforms" v-if="platforms">
        <md-button
          class="md-icon-button"
          target="_blank"
          rel="noopener noreferrer"
          v-for="({ key, value }, index) in platforms"
          :href="value"
          :key="key"
        >
          <img :alt="key" v-lazy="imgUrl(`icons/${key}-dark.svg`)" />
        </md-button>
      </div>
    </div>
  </div>
</template>


<script>
const images = require.context('../assets/');
const imgUrl = path => images(`./${path}`);


export default {
  name: 'avatar-grid-card',
  props: {
    avatar: String,
    title: String,
    subtitle: String,
    description: String,
    platforms: Object,
  },
  methods: {
    imgUrl,
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.avatar-grid-card {
  width: 100%;
  height: 100%;
  margin: auto;

  > div {
    width: inherit;
    height: inherit;
    padding: 18px 8px 32px;

    background-color: white;

    border-radius: 6px;

    > * {
      display: block;
    }

    img {
      width: 112px;
      height: 112px;
      margin: auto;

      border-radius: 50%;

      & + * {
        margin-top: 16px;
      }
    }

    h1 {
      line-height: 1.35;
      font-size: 20px;
      font-weight: 600;
    }

    h2 {
      color: $like-gray-4;
      line-height: 1.375;
      font-size: 16px;
      font-weight: 300;
    }

    h1,
    h2 {
      text-align: center;
    }

    .description {
      margin-top: 4px;

      text-align: center;

      color: $like-gray-4;

      font-size: 14px;
      font-weight: 300;
    }

    a,
    a:active {
      text-decoration: underline;

      color: $like-green;
    }

    .platforms {
      text-align: center;
      .md-button:hover {
        opacity: .7;
      }
    }
  }
}
</style>


<style lang="scss">
@import "~assets/variables";

.avatar-grid-card {
  > div {
    .description {
      a,
      a:active {
        text-decoration: underline;

        color: $like-green;
      }
    }
  }
}
</style>

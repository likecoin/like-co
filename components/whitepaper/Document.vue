<template>
  <div class="lc-document">
    <div class="title">{{ title }}</div>
    <img class="image" :src="imageSrc" />
    <ul class="language-list">
      <li
        v-for="link in linkSrc"
        :key="link.languageKey">
        <material-button @click="handleClick(link.src)">
          {{ $t(`Language.${link.languageKey}`) }}
        </material-button>
      </li>
    </ul>
  </div>
</template>

<script>
import MaterialButton from '~/components/MaterialButton';

export default {
  name: 'document',
  props: ['title', 'imageSrc', 'linkSrc'],
  components: {
    MaterialButton,
  },
  methods: {
    handleClick(link) {
      window.open(link, 'noopener');
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/index";

.lc-document {
  display: flex;
  flex-direction: column;
  justify-content: center;

  width: 100%;
  padding-bottom: 28px;

  background-color: $like-gray-1;

  .title {
    display: flex;
    align-items: center;
    justify-content: center;

    height: 48px;
    margin: -24px 50px 0;

  	background-color: $like-light-blue;

    font-size: 32px;
    font-weight: 300;
  }

  .image {
    margin: 24px 0;
  }

  .language-list {
    list-style: none;

    li {
      display: flex;
      justify-content: center;

      margin: 4px;
    }
  }

  .md-button {
    width: 256px;
    height: 40px;

    box-shadow: none;
  }
}
</style>

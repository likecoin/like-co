<template>
  <div class="lc-document">
    <div class="lc-document-wrapper">
      <div class="title">{{ title }}</div>
      <img class="image" :src="imageSrc" />
      <ul class="language-list lc-margin-vertical-32 lc-mobile">
        <li
          v-for="link in mainLocaleSrc"
          :key="link.languageKey">
          <material-button @click="handleClick(link.src)">
            {{ $t(`Language.${link.languageKey}`) }}
          </material-button>
        </li>
      </ul>
    </div>

    <div
      class="other-languages-list"
      v-if="otherLocaleSrc.length > 0">
      <ul class="language-list lc-margin-vertical-32 lc-mobile">
        <li
          v-for="link in otherLocaleSrc"
          :key="link.languageKey">
          <material-button @click="handleClick(link.src)">
            {{ $t(`Language.${link.languageKey}`) }}
          </material-button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import MaterialButton from '~/components/MaterialButton';

export default {
  name: 'document',
  props: ['title', 'imageSrc', 'linkSrc', 'mainLocales'],
  components: {
    MaterialButton,
  },
  computed: {
    mainLocaleSrc() {
      return this.linkSrc.filter(src => this.mainLocales.includes(src.languageKey));
    },
    otherLocaleSrc() {
      return this.linkSrc.filter(src => !this.mainLocales.includes(src.languageKey));
    },
  },
  methods: {
    handleClick(link) {
      this.$emit('click');
      window.open(link, 'noopener');
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

.lc-document {
  .lc-document-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;

    width: 100%;

    background-color: $like-gray-1;

  }
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
    margin-top: 24px;
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

  .other-languages-list {
    margin-top: 8px;
    background-color: $like-gray-1;
  }
}
</style>

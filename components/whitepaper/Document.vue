<template>
  <div class="lc-document">
    <div class="lc-container-header">
      <div class="lc-container-header-overlay">
        <div class="lc-container-3 lc-bg-gray-1 lc-mobile-hide" />
      </div>
      <div class="lc-container-2">
        <div class="lc-container-header-title">
          <h1 class="lc-font-size-32 lc-mobile">
            {{ title }}
          </h1>
        </div>
      </div>
    </div>

    <div class="lc-document-wrapper lc-padding-top-24 lc-bg-gray-1">
      <img :src="imageSrc">
      <ul class="language-list lc-padding-vertical-24 lc-mobile">
        <li
          v-for="link in mainLocaleSrc"
          :key="link.languageKey"
        >
          <material-button @click="handleClick(link.src)">
            {{ $t(`Language.${link.languageKey}`) }}
          </material-button>
        </li>
      </ul>
    </div>

    <div
      v-if="otherLocaleSrc.length > 0"
      class="other-languages-list"
    >
      <ul class="language-list lc-padding-vertical-24 lc-mobile">
        <li
          v-for="link in otherLocaleSrc"
          :key="link.languageKey"
        >
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
  components: {
    MaterialButton,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    imageSrc: {
      type: String,
      default: '',
    },
    linkSrc: {
      type: Array,
      default: () => [],
    },
    mainLocales: {
      type: Array,
      default: () => [],
    },
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
  .lc-container-header-title {
    @media (min-width: #{768px + 1px}) {
      margin: 0 !important;
    }
  }

  .lc-document-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;

    width: 100%;
  }

  .language-list {
    list-style: none;

    li {
      display: flex;
      justify-content: center;

      padding: 0 8px;
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

<template>
  <md-menu
    class="language-switch"
    md-size="small"
    md-align-trigger>

    <md-button class="md-icon-button md-dense" md-menu-trigger>
      <simple-svg
        :filepath="I18nIcon"
        width="24px"
        height="24px"
        :fill="color"
        stroke="transparent"
        />
    </md-button>

    <md-menu-content>

      <md-menu-item
        v-for="locale in locales"
        :key="locale"
        @click="onChangeLanguage(locale)">
        {{ $t(`Language.${locale}`) }}
      </md-menu-item>

    </md-menu-content>
  </md-menu>
</template>


<script>
import { mapActions } from 'vuex';
import I18nIcon from '@/assets/icons/i18n.svg';


export default {
  name: 'language-switch',
  props: {
    color: {
      type: String,
      default: 'black',
    },
  },
  data() {
    return {
      I18nIcon,
      locales: Object.keys(this.$i18n.messages),
    };
  },
  methods: {
    ...mapActions([
      'setLocale',
    ]),
    onChangeLanguage(locale) {
      this.$i18n.locale = locale;
      this.setLocale(locale);
    },
  },
};
</script>


<style lang="scss" scoped>
@import "../assets/index";

.simple-svg-wrapper {
  display: flex;
  align-items: center;
}

.language-switch {
  margin: 0 6px;

  cursor: pointer;

  > .md-button {
    background-color: transparent;

    overflow: hidden;
    border-radius: 50%;
  }
}

.md-menu-content {
  z-index: 30;

  :global(.md-list) {
    padding: 0;
  }
  :global(.md-button) {
    margin: 0;
  }
}

@media (max-width: 600px) {
  .language-switch {
    > .md-button {
      font-size: 20px;
    }
  }
}
</style>

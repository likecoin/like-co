<template>
  <md-menu
    class="language-switch"
    md-size="small"
    md-align-trigger
  >

    <div
      class="button-wrapper"
      md-menu-trigger
    >
      <label v-if="isShowLabel">
        {{ $t(`Language.${$i18n.locale}`) }}
      </label>

      <md-button class="md-icon-button md-dense">
        <simple-svg
          :filepath="I18nIcon"
          :fill="color"
          width="24px"
          height="24px"
          stroke="transparent"
        />
      </md-button>
    </div>

    <md-menu-content>

      <md-menu-item
        v-for="locale in locales"
        :key="locale"
        @click="onChangeLanguage(locale)"
      >
        {{ $t(`Language.${locale}`) }}
      </md-menu-item>

    </md-menu-content>
  </md-menu>
</template>


<script>
import { mapActions } from 'vuex';
import { supportedLocales } from '@/locales';
import I18nIcon from '@/assets/icons/i18n.svg';


export default {
  name: 'language-switch',
  props: {
    isShowLabel: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'black',
    },
  },
  data() {
    return {
      I18nIcon,
      locales: supportedLocales,
    };
  },
  methods: {
    ...mapActions([
      'setLocale',
    ]),
    onChangeLanguage(locale) {
      this.$i18n.loadLanguageAsync(locale);
      this.$cookie.set('language', locale, { expires: '1M', secure: true });
      this.setLocale(locale);
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.simple-svg-wrapper {
  display: flex;
  align-items: center;
}

.language-switch {
  .button-wrapper {
    display: flex;
    align-items: center;

    cursor: pointer;
    user-select: none;
  }

  .md-button {
    overflow: hidden;

    border-radius: 50%;
    background-color: transparent;
  }

  .md-icon-button {
    margin: 0;
  }
}

.md-menu-content {
  z-index: 30;

  /deep/ .md-list {
    padding: 0;
  }
  /deep/ .md-button {
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

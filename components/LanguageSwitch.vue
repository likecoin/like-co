<template>
  <md-menu
    :class="['language-switch', className]"
    md-size="small"
    md-align-trigger>
    <md-button md-menu-trigger>
      <img class="icon" :src="I18nIcon" />
    </md-button>

    <md-menu-content>

      <md-menu-item
        v-for="locale in locales"
        :key="locale.code"
        @click="onChangeLanguage(locale.code)">
        {{ $t(`Language.${locale.code}`) }}
      </md-menu-item>

    </md-menu-content>
  </md-menu>
</template>


<script>
import { mapActions } from 'vuex';
import I18nIcon from '../assets/icons/i18n.svg';

const LOCALES = [
  {
    code: 'en',
  },
  {
    code: 'zh',
  },
];

export default {
  name: 'language-switch',
  props: ['className'],
  data() {
    return {
      I18nIcon,
      locales: LOCALES,
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

.language-switch {
  margin: 0 6px;

  cursor: pointer;

  .icon {
    width: 32px;
    height: 32px;
  }

  > .md-button {
    min-width: 40px;
    height: 40px;
    width: 40px;

    color: $like-green;

    overflow: hidden;
    border-radius: 50%;
  }
}

.md-menu-content {
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

import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters([
      'getCurrentLocale',
      'getCurrentLocaleISO',
      'getCurrentOgLocale',
    ]),
  },
  head() {
    return {
      htmlAttrs: {
        lang: this.getCurrentLocaleISO,
      },
      bodyAttrs: {
        'lc-lang': this.getCurrentLocale,
      },
      meta: [
        {
          hid: 'og_locale',
          property: 'og:locale',
          content: this.getCurrentOgLocale,
        },
      ],
    };
  },
};

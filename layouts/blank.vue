<template>
  <div class="lc-layout">
    <tool-bars />

    <div class="lc-page-wrapper">

      <header class="lc-page-header">
        <div class="lc-container-0">
          <div class="lc-container-1">
            <div class="lc-container-2">
              <site-header />
            </div>
          </div>
        </div>
      </header>

      <div class="lc-page-content">
        <nuxt />
      </div>

      <footer class="lc-page-footer">
        <div class="lc-container-0">
          <my-footer />
        </div>
      </footer>

    </div>

  </div>
</template>


<script>
import { mapGetters } from 'vuex';

import MyFooter from '~/components/footer/Footer';
import SiteHeader from '~/components/header/HeaderMin';
import ToolBars from '~/components/toolbars/ToolBars';

export default {
  components: {
    MyFooter,
    SiteHeader,
    ToolBars,
  },
  computed: {
    ...mapGetters([
      'getCurrentLocale',
      'getCurrentLocaleISO',
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
    };
  },
};
</script>

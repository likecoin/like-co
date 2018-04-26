<template>
  <div class="lc-page-wrapper with-sliding-menu">
    <tool-bars :disableError="getIfDisableError" />

    <sliding-menu />

    <header class="lc-page-header">
      <div class="lc-container-0">
        <div class="lc-container-1">
          <div class="underlay lc-mobile-hide" />
          <div class="lc-container-2">
            <site-header/>
          </div>
        </div>
      </div>
    </header>

    <div class="lc-page-content">
      <nuxt/>
    </div>

    <footer class="lc-page-footer">
      <div class="lc-container-0">
        <my-footer/>
      </div>
    </footer>

  </div>
</template>


<script>
import { mapGetters } from 'vuex';

import MyFooter from '~/components/footer/Footer';
import SiteHeader from '~/components/header/HeaderWithMenuButton';
import SlidingMenu from '~/components/SlidingMenu/index';
import ToolBars from '~/components/toolbars/ToolBars';

import { getToolbarsDisableError } from '~/constant';

export default {
  components: {
    MyFooter,
    SiteHeader,
    SlidingMenu,
    ToolBars,
  },
  computed: {
    ...mapGetters([
      'getCurrentLocale',
      'getCurrentLocaleISO',
    ]),
    getIfDisableError() {
      return getToolbarsDisableError(this.$route.name);
    },
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

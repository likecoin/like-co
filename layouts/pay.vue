<template>
  <div class="lc-layout">
    <tool-bars :disableError="getIfDisableError" />

    <div class="lc-page-wrapper lc-narrow with-sliding-menu">

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
import ToolBars from '~/components/toolbars/ToolBars';

import { getToolbarsDisableError } from '~/constant';


export default {
  components: {
    MyFooter,
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

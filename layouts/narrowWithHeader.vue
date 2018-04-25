<template>
  <div class="lc-page-wrapper lc-narrow with-sliding-menu">
    <tool-bars :disableError="getIfDisableError" />

    <sliding-menu />

    <header class="lc-page-header">
      <div class="lc-container-0">

        <div class="lc-container-1 lc-narrow-page-header-overlay">
          <div class="lc-container-2">
            <div class="lc-container-3 lc-bg-gray-1" />
          </div>
        </div>

        <div class="lc-container-1">
          <div class="lc-container-2">
            <site-header :showLogin="true" />
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
    ]),
    getIfDisableError() {
      return getToolbarsDisableError(this.$route.name);
    },
  },
  head() {
    return {
      bodyAttrs: {
        'lc-lang': this.getCurrentLocale,
      },
    };
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";
@import "~assets/default";

.lc-page-header {
  position: relative;

  .lc-container-2 #site-header {
    padding-right: 0;
    padding-left: 0;
  }

  .header-bg {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    pointer-events: none;

    .lc-container-3 {
      background-color: $like-gray-1;
    }
  }
}
</style>

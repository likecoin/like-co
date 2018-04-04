<template>
  <div
    :class="[
      'lc-page-wrapper',
      'with-sliding-menu',
      {
        'slide-menu-open': getIsSlidingMenuOpen,
      },
    ]">

    <div class="slide-menu-wrapper">
      <sliding-menu />
    </div>

    <header class="lc-page-header">

      <div class="lc-container-0 header-bg lc-narrow">
        <div class="lc-container-1">
          <div class="lc-container-2">
            <div class="lc-container-3" />
          </div>
        </div>
      </div>

      <div class="lc-container-0">
        <div class="lc-container-1">
          <div class="underlay gray lc-mobile-hide" />
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

    <tool-bars :disableError="getIfDisableError" />
  </div>
</template>


<script>
import { mapGetters } from 'vuex';

import MyFooter from '~/components/footer/Footer';
import SiteHeader from '~/components/header/Header';
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
      'getIsSlidingMenuOpen',
    ]),
    getIfDisableError() {
      return getToolbarsDisableError(this.$route.name);
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";
@import "~assets/default";

.lc-page-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  min-height: 100%;

  .lc-page-footer {
    padding: 0;
  }

  .lc-page-content {
    flex: 1;
  }
}

.lc-container-2 #site-header {
  padding-right: 0;
  padding-left: 0;
}
</style>

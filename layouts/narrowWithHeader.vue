<template>
  <div class="lc-layout">
    <tool-bars />

    <div class="lc-page-wrapper lc-narrow with-sliding-menu">

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
import localeMixin from '~/mixins/locale';

import MyFooter from '~/components/footer/Footer';
import SiteHeader from '~/components/header/HeaderWithMenuButton';
import SlidingMenu from '~/components/SlidingMenu/index';
import ToolBars from '~/components/toolbars/ToolBars';


export default {
  components: {
    MyFooter,
    SiteHeader,
    SlidingMenu,
    ToolBars,
  },
  mixins: [localeMixin],
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

<template>
  <div class="lc-page-wrapper">
    <tool-bars :disableError="['web3', 'testnet', 'locked']" />
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
import SiteHeader from '~/components/header/Header';
import MyFooter from '~/components/footer/Footer';
import ToolBars from '~/components/toolbars/ToolBars';

export default {
  components: {
    SiteHeader,
    MyFooter,
    ToolBars,
  },
};
</script>


<style lang="scss" scoped>
@import "../assets/index";
@import "../assets/default";

.lc-page-wrapper {
  display: flex;
  flex-direction: column;

  height: 100%;

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

  .lc-page-content {
    flex: 1;
  }

  .lc-page-footer {
    padding: 0;
  }
}
</style>

<template>
  <div class="lc-page-wrapper with-sliding-menu">
    <tool-bars :disableError="getIfDisableError" />

    <sliding-menu />

    <header class="lc-page-header">
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

      <div class="lc-container-1">
        <div class="underlay gray lc-mobile-hide" />
        <div class="lc-container-2 lc-padding-bottom-8">
          <user-info-form />
        </div>
      </div>

      <!-- BEGIN - Tab bar section -->
      <div class="lc-container-1">
        <div class="underlay gray" />
        <md-tabs class="lc-tabs lc-container-2 lc-width-2-3 md-transparent" md-sync-route>

          <template slot="md-tab"  slot-scope="{ tab }">
            <span class="lc-tab-item-label">{{ tab.label }}</span>
          </template>

          <md-tab
            id="overview-tab"
            :md-label="$t('In.tab.overview')"
            to="/in" />
          <md-tab
            id="bonus-tab"
            :md-label="$t('In.tab.bonus')"
            to="/in/bonus" />
          <md-tab
            id="history-tab"
            :md-label="$t('In.tab.history')"
            to="/in/bonus/history" />

        </md-tabs>
      </div>
      <!-- END - Tab bar section -->

      <div class="tab-wrapper">
        <nuxt/>
      </div>
    </div>

    <footer class="lc-page-footer">
      <div class="lc-container-0">
        <my-footer/>
      </div>
    </footer>

    <mission-dialog />
  </div>
</template>


<script>
import MissionDialog from '@/components/dialogs/MissionDialog';
import MyFooter from '~/components/footer/Footer';
import SiteHeader from '~/components/header/HeaderWithMenuButton';
import SlidingMenu from '~/components/SlidingMenu/index';
import ToolBars from '~/components/toolbars/ToolBars';
import UserInfoForm from '~/components/UserInfoForm';

import { getToolbarsDisableError } from '~/constant';

export default {
  components: {
    MissionDialog,
    MyFooter,
    SiteHeader,
    SlidingMenu,
    ToolBars,
    UserInfoForm,
  },
  computed: {
    getIfDisableError() {
      return getToolbarsDisableError(this.$route.name);
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.lc-tabs {
  padding-right: 0;

  color: $like-gray-4;

  :global(.md-button) {
    flex-grow: 1;

    max-width: none;
  }

  :global(.md-tabs-indicator) {
    height: 3px;

    background-color: transparent;

    &::before {
      position: relative;

      display: block;

      width: 24px;
      height: 3px;
      margin: auto;

      content: " ";

      background-color: $like-green;
    }
  }
}

.lc-tab-item-label {
  font-size: 14px;
  font-weight: 600;

  a:not(.md-active) & {
    color: $like-gray-4;
  }
}

.tab-wrapper {
  &.disabled {
    user-select: none;
    pointer-events: none;

    opacity: 0.2;
  }
}
</style>

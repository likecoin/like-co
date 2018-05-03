<template>
  <div class="lc-layout">
    <tool-bars :disableError="getIfDisableError" />

    <div class="lc-page-wrapper with-sliding-menu">

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
          <md-tabs
            class="lc-tabs lc-container-2 lc-width-2-3 md-transparent"
            :md-active-tab="$route.name">

            <template slot="md-tab"  slot-scope="{ tab }">
              <span :class="['lc-tab-item-label', { new: tab.data.isNew }]">
                {{ tab.label }}
              </span>
            </template>

            <md-tab
              id="in"
              :md-label="$t('In.tab.overview')"
              to="/in" />
            <md-tab
              id="in-bonus"
              :md-label="$t('In.tab.bonus')"
              :md-template-data="{ isNew: hasNewInvitee }"
              to="/in/bonus" />
            <md-tab
              id="in-bonus-history"
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

    </div>

    <mission-dialog />

  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';
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
    hasNewInvitee() {
      return this.getReferralMissionList.some(referral => !referral.seen);
    },
    ...mapGetters([
      'getCurrentLocale',
      'getCurrentLocaleISO',
      'getReferralMissionList',
      'getUserNeedAuth',
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
  methods: {
    ...mapActions([
      'loginUser',
    ]),
  },
  watch: {
    getUserNeedAuth(a) {
      if (a) {
        this.loginUser();
      }
    },
  },
  mounted() {
    if (this.getUserNeedAuth) {
      this.loginUser();
    }
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
  position: relative;

  font-size: 14px;
  font-weight: 600;

  a:not(.md-active) & {
    color: $like-gray-4;
  }

  &.new:before {
    position: absolute;
    top: 50%;
    bottom: 0;
    left: -16px;

    width: 6px;
    height: 6px;
    margin-top: 1px;

    content: " ";
    transform: translateY(-50%);

    border-radius: 50%;
    background-color: #ff5151;
    box-shadow: 0 0 6px 0 #FF4949;
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

<template>
  <div class="lc-layout">
    <tool-bars />

    <div class="lc-page-wrapper with-sliding-menu">

      <sliding-menu />

      <header class="lc-page-header">
        <div class="lc-container-0">
          <div class="lc-container-1">
            <div class="underlay gray lc-mobile-hide" />
            <div class="lc-container-2">
              <site-header />
            </div>
          </div>
        </div>
      </header>

      <div class="lc-page-content">

        <div class="lc-container-1">
          <div class="underlay gray lc-mobile-hide" />
          <div class="lc-container-2 lc-padding-bottom-40">
            <user-info-form />
          </div>
        </div>

        <!-- BEGIN - Tab bar section -->
        <div
          v-if="getUserHasWallet"
          class="lc-container-1"
        >
          <div class="underlay gray" />
          <md-tabs
            :md-active-tab="$route.name"
            class="lc-tabs lc-container-2 lc-width-2-3 md-transparent"
          >

            <template
              slot-scope="{ tab }"
              slot="md-tab"
            >
              <span :class="['lc-tab-item-label', { new: tab.data.isNew }]">
                {{ tab.label }}
              </span>
            </template>

            <md-tab
              id="in"
              :md-label="$t('In.tab.overview')"
              to="/in"
            />
            <md-tab
              id="in-bonus"
              :md-label="$t('In.tab.bonus')"
              :md-template-data="{ isNew: hasNewInvitee }"
              to="/in/bonus"
            />
            <md-tab
              id="in-tx-history"
              :md-label="$t('In.tab.txHistory')"
              to="/in/tx/history"
            />

          </md-tabs>
        </div>
        <!-- END - Tab bar section -->

        <div class="tab-wrapper">
          <nuxt />
        </div>
      </div>

      <footer class="lc-page-footer">
        <div class="lc-container-0">
          <my-footer />
        </div>
      </footer>

    </div>

    <mission-dialog />
    <prompt-notification-dialog />

  </div>
</template>


<script>
import { mapGetters } from 'vuex';

import localeMixin from '~/mixins/locale';

import MissionDialog from '@/components/dialogs/MissionDialog';
import PromptNotificationDialog from '@/components/dialogs/PromptNotificationDialog';
import MyFooter from '~/components/footer/Footer';
import SiteHeader from '~/components/header/HeaderWithMenuButton';
import SlidingMenu from '~/components/SlidingMenu/index';
import ToolBars from '~/components/toolbars/ToolBars';
import UserInfoForm from '~/components/UserInfoForm';

export default {
  components: {
    MissionDialog,
    PromptNotificationDialog,
    MyFooter,
    SiteHeader,
    SlidingMenu,
    ToolBars,
    UserInfoForm,
  },
  middleware: 'authenticated',
  mixins: [localeMixin],
  computed: {
    hasNewInvitee() {
      return this.getReferralMissionList.some(referral => !referral.seen);
    },
    ...mapGetters([
      'getReferralMissionList',
      'getUserHasWallet',
    ]),
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.lc-tabs {
  padding-right: 0;

  color: $like-gray-4;

  /deep/ .md-button {
    flex-grow: 1;

    max-width: none;
  }

  /deep/ .md-tabs-indicator {
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

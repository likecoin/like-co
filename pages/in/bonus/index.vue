<template>
  <div class="bonus-tab">

    <!-- Description -->
    <div class="lc-container-0">
      <div class="lc-container-1">
        <div class="lc-container-2">
          <div class="lc-container-3">
            <div class="lc-container-4">
              <div class="lc-width-2-3 lc-margin-top-32 lc-padding-vertical-8 lc-font-size-18 lc-color-like-gray-4 lc-mobile">
                {{ $t('BonusPage.label.description') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- BEGIN - LikeCoin Bonus Section -->
    <section class="likecoin-bonus-section lc-margin-top-48 lc-mobile">
      <div class="lc-container-0">
        <div class="lc-container-1">

          <div class="lc-container-header">
            <div class="lc-container-2 lc-container-header-overlay">
              <div class="lc-container-3 lc-bg-gray-1" />
            </div>
            <div class="lc-container-2">
              <div class="lc-container-3">
                <div class="lc-container-4">
                  <div class="lc-container-header-title">
                    <h1 class="lc-font-size-32 lc-mobile">
                      {{ $t('BonusPage.header.likeCoinBonus') }}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="lc-container-2">
            <div class="lc-container-3 lc-bg-gray-1 lc-padding-vertical-32 section-content">
              <div class="lc-container-4">
                <mission-list :missions="getMissionList" @click="onMissionClick"/>
              </div>
            </div>
          </div>

          <div class="lc-container-2 lc-margin-top-4" id="invitees-task">
            <div class="lc-container-3 lc-bg-gray-1 lc-padding-vertical-32 section-content">
              <div class="lc-container-4">

                <invitee-mission-grid-list :invitees="getReferralMissionList" @click="onMissionClick" />

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
    <!-- END - LikeCoin Bonus Section -->

    <!-- BEGIN - Referral Section -->
    <section class="referral-form-section lc-margin-top-48 lc-mobile" id="referral">
      <div class="lc-container-0">
        <div class="lc-container-1">

          <div class="lc-container-header">
            <div class="lc-container-2 lc-container-header-overlay">
              <div class="lc-container-3 lc-bg-gray-1" />
            </div>
            <div class="lc-container-2">
              <div class="lc-container-3">
                <div class="lc-container-4">
                  <div class="lc-container-header-title">
                    <h1 class="lc-font-size-32 lc-mobile">
                      {{ $t('Edit.referral.title') }}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="lc-container-2">
            <div class="lc-container-3 lc-bg-gray-1 lc-padding-vertical-32 section-content">
              <div class="lc-container-4">

                <div
                  v-if="!getUserInfo.isEmailVerified"
                  class="lc-font-size-20 lc-color-like-gray-4 lc-mobile">
                  {{ $t('Edit.referral.verifyEmailFirst') }}
                </div>

                <div v-else>
                  <div class="md-layout referral-action">
                    <div class="md-layout-item md-medium-size-50 md-small-size-100 lc-margin-bottom-16 lc-font-size-20 lc-color-like-gray-4 lc-mobile">
                      {{ $t('Edit.referral.description') }}
                    </div>

                    <div class="md-layout-item md-medium-size-50 md-small-size-100 lc-margin-bottom-16-mobile">
                      <referral-stats
                        :pending="referralPending"
                        :verified="referralVerified"
                      />
                    </div>
                  </div>

                  <invite-friend-form
                    :is-full-width="true"
                    @invite="onInvite" />
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
    <!-- END - Referral Section -->

  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

import InviteFriendForm from '~/components/forms/InviteFriendForm';
import InviteeMissionGridList from '@/components/Mission/InviteeGridList';
import MissionList from '@/components/Mission/List';
import ReferralStats from '@/components/ReferralStats';

import { logTrackerEvent } from '@/util/EventLogger';

export default {
  name: 'bonus-index',
  data() {
    return {
      referralPending: 0,
      referralVerified: 0,
      user: '',
    };
  },
  components: {
    InviteFriendForm,
    InviteeMissionGridList,
    MissionList,
    ReferralStats,
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getUserIsFetching',
      'getUserIsRegistered',
      'getMissionList',
      'getReferralMissionList',
    ]),
  },
  methods: {
    ...mapActions([
      'fetchUserReferralStats',
      'onMissionClick',
    ]),
    async updateInfo() {
      const user = this.getUserInfo;
      this.user = user.user;
      this.updateReferralStat();
    },
    async updateReferralStat() {
      try {
        const { pending, verified } = await this.fetchUserReferralStats(this.user);
        this.referralPending = pending;
        this.referralVerified = verified;
      } catch (err) {
        console.log(err);
      }
    },
    onInvite(type) {
      switch (type) {
        case 'email':
          logTrackerEvent(this, 'Referral', 'ClickGetFreeLikeCoin', 'email invite', 1);
          break;
        case 'url':
          logTrackerEvent(this, 'Referral', 'sendInvitation', 'copy invite link', 1);
          break;
        case 'facebook':
          logTrackerEvent(this, 'Referral', 'sendInvitation', 'fb share invite', 1);
          break;
        case 'twitter':
          logTrackerEvent(this, 'Referral', 'sendInvitation', 'twitter invite', 1);
          break;
        default:
      }
    },
  },
  watch: {
    getUserIsFetching(f) {
      if (!f) {
        if (this.getUserIsRegistered) {
          this.updateInfo();
        }
      }
    },
  },
  mounted() {
    if (!this.getUserIsFetching) {
      if (this.getUserIsRegistered) {
        this.updateInfo();
      }
    }
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.bonus-tab {
}
</style>

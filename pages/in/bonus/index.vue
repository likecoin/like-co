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
                <mission-list :missions="missions" />
              </div>
            </div>
          </div>

          <div class="lc-container-2 lc-margin-top-4" id="invitees-task">
            <div class="lc-container-3 lc-bg-gray-1 lc-padding-vertical-32 section-content">
              <div class="lc-container-4">
                <invitee-mission-list
                  :missions="missions"
                  username="joshkiu"
                  :is-new="true" />
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
                <referral-action
                  :user="user"
                  :pending="referralPending"
                  :verified="referralVerified"
                  :isEmailVerified="getUserInfo.isEmailVerified"
                  :isBlocked="getIsPopupBlocking"
                />
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

import InviteeMissionList from '@/components/Mission/InviteeList';
import MissionList from '@/components/Mission/List';
import ReferralAction from '@/components/ReferralAction';

const MISSIONS = [
  {
    id: '1',
    title: 'Invite 20000 Friends to Join Token Sale',
    reward: '100000000000 LIKE',
    state: 'active',
    isNew: true,
  },
  {
    id: '2',
    title: 'Invite Friends',
    reward: '8 LIKE <span class="small">(each)</span>',
    state: 'completed',
  },
  {
    id: '3',
    title: 'Join Token Sale',
    reward: '100 LIKE',
    state: 'completed',
  },
  {
    id: '4',
    title: 'Invite Friends to Join Token Sale',
    reward: '2.5% <span class="small">bonus</span>',
    state: 'active',
    isNew: true,
  },
  {
    id: '5',
    title: 'Getting Start',
    reward: '3 LIKE',
    state: 'active',
  },
  {
    id: '6',
    title: 'Invite Friends',
    reward: '8 LIKE <span class="small">(each)</span>',
    state: 'completed',
  },
  {
    id: '7',
    title: 'Join Token Sale',
    reward: '100 LIKE',
    state: 'completed',
  },
  {
    id: '8',
    title: 'Invite Friends to Join Token Sale',
    reward: '2.5% <span class="small">bonus</span>',
    state: 'active',
  },
];

export default {
  name: 'bonus-index',
  data() {
    return {
      referralPending: 0,
      referralVerified: 0,
      missions: MISSIONS,
      user: '',
    };
  },
  components: {
    InviteeMissionList,
    MissionList,
    ReferralAction,
  },
  computed: {
    ...mapGetters([
      'getIsPopupBlocking',
      'getUserInfo',
      'getUserIsFetching',
      'getUserIsRegistered',
    ]),
  },
  methods: {
    ...mapActions([
      'fetchUserReferralStats',
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

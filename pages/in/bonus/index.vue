<template>
  <div
    v-if="getUserInfo.wallet"
    class="bonus-tab"
  >

    <section
      v-if="isShowReferralSection"
      class="lc-container-0"
    >
      <div class="lc-container-1">
        <div class="lc-container-2">
          <div class="lc-container-3">
            <div
              class="lc-container-4
              lc-width-2-3
              lc-margin-top-32
              lc-padding-vertical-8
              lc-font-size-18
              lc-color-like-gray-4
              lc-mobile"
            >
              {{ $t('BonusPage.label.description') }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BEGIN - LikeCoin Bonus Amount Section -->
    <section class="lc-container-0">
      <div class="lc-container-1">
        <div class="lc-container-2">

          <div class="lc-container-3">
            <div class="lc-container-4">
              <h2
                class="lc-padding-vertical-16
                lc-font-size-14
                lc-font-weight-400
                lc-text-align-center-mobile"
              >
                {{ $t('BonusPage.label.earned') }}
              </h2>
            </div>
          </div>

          <div class="earned-bonus-amount-section lc-container-3">
            <div class="lc-container-4">
              <span class="like-bonus-amount">{{ likeBonusAmountStr }}</span>
              <span class="like-bonus-label">{{ $t('BonusPage.label.likeBonus') }}</span>
            </div>
          </div>

        </div>
      </div>
    </section>
    <!-- END - LikeCoin Bonus Amount Section -->

    <!-- BEGIN - Mission Section -->
    <section
      id="earn"
      class="likecoin-bonus-section lc-margin-top-48 lc-mobile"
    >
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
                    <div
                      v-if="getIsFetchedMissions"
                      class="lc-container-header-button-wrapper lc-mobile-hide"
                    >
                      <refresh-button
                        :is-refreshing="getIsFetchingMissions"
                        @click="updateInfo"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            id="my-mission"
            class="lc-container-2"
          >
            <div
              class="lc-container-3
              lc-container-no-padding-mobile
              lc-bg-gray-1
              lc-padding-vertical-32
              section-content"
            >
              <div class="lc-container-4 lc-container-no-padding-mobile">
                <mission-list
                  :missions="getMissionList"
                  :is-loading="getIsFetchingMissions || !getIsFetchedMissions"
                  :empty-placeholder="$t('BonusPage.placeholder.emptyMission')"
                  swipper-id="my-mission"
                  @click="onMissionClick"
                />
              </div>
            </div>
          </div>

          <!-- BEGIN - Invitee missions -->
          <div
            v-if="!getIsFetchingMissions
              && getIsFetchedMissions
              && getReferralMissionList
            && getReferralMissionList.length > 0"
            id="invitee-mission"
            class="lc-container-2 lc-margin-top-4"
          >

            <div class="lc-container-3 lc-padding-top-32 lc-bg-gray-1">
              <div class="lc-container-4">
                <header>
                  <div>
                    <h2 class="lc-font-size-14 lc-color-like-gray-4 lc-margin-bottom-4">
                      {{ $t('BonusPage.header.inviteeMission') }}
                    </h2>
                    <p class="lc-font-size-14 lc-bg-gray-9b">
                      {{ $t('BonusPage.label.inviteeMissionDescription') }}
                    </p>
                  </div>
                </header>
              </div>
            </div>

            <div
              class="lc-container-3
              lc-container-no-padding-mobile
              lc-bg-gray-1
              lc-padding-bottom-32
              section-content"
            >
              <div class="lc-container-4 lc-container-no-padding-mobile">
                <invitee-mission-grid-list
                  :invitees="getReferralMissionList"
                  swiper-id="invitee-mission"
                  @click="onReferralMissionClick"
                  @seen="onReferralSeen"
                />
              </div>
            </div>

          </div>
          <!-- END - Invitee missions -->

          <div
            class="lc-container-3
            lc-margin-top-24
            lc-flex
            lc-justify-content-center
            lc-mobile-show"
          >
            <refresh-button
              :is-refreshing="getIsFetchingMissions"
              :is-outline="true"
              @click="updateInfo"
            />
          </div>

        </div>
      </div>
    </section>
    <!-- END - Mission Section -->

    <!-- BEGIN - Referral Section -->
    <section
      v-if="isShowReferralSection"
      id="referral"
      class="referral-form-section lc-margin-top-48 lc-mobile"
    >
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
                  class="lc-font-size-20 lc-color-like-gray-4 lc-mobile"
                >
                  {{ $t('Edit.referral.verifyEmailFirst') }}
                </div>

                <div v-else>
                  <div class="md-layout referral-action">
                    <div
                      class="md-layout-item
                      md-medium-size-50
                      md-small-size-100
                      lc-margin-bottom-16
                      lc-font-size-20
                      lc-color-like-gray-4
                      lc-mobile"
                    >
                      {{ $t('Edit.referral.description') }}
                    </div>

                    <div
                      class="md-layout-item
                      md-medium-size-50
                      md-small-size-100
                      lc-margin-bottom-16-mobile"
                    >
                      <referral-stats
                        :pending="referralPending"
                        :verified="referralVerified"
                      />
                    </div>
                  </div>

                  <invite-friend-form
                    :is-full-width="true"
                    @invite="onInvite"
                  />
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
    <!-- END - Referral Section -->

    <!-- BEGIN - Completed Bonus Section -->
    <section class="lc-margin-top-48 lc-mobile">
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
                      {{ $t('BonusPage.HistoryTab.header.completedBonus') }}
                    </h1>
                    <div
                      v-if="getIsFetchedMissionHistory"
                      class="lc-container-header-button-wrapper lc-mobile-hide"
                    >
                      <refresh-button
                        :is-refreshing="getIsFetchingMissionHistory"
                        @click="refreshHistory"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="lc-container-2">
            <div class="lc-container-3 lc-bg-gray-1 lc-padding-vertical-32 section-content">
              <div class="lc-container-4">
                <mission-list
                  :missions="getMissionHistorylist"
                  :is-grid="true"
                  :is-swippable="false"
                  :is-loading="getIsFetchingMissionHistory || !getIsFetchedMissionHistory"
                  :empty-placeholder="$t('BonusPage.HistoryTab.label.emptyHistoryPlaceholder')"
                />
              </div>
            </div>

            <div
              class="lc-container-3
              lc-margin-top-24
              lc-flex
              lc-justify-content-center
              lc-mobile-show"
            >
              <refresh-button
                :is-refreshing="getIsFetchingMissionHistory"
                :is-outline="true"
                @click="refreshHistory"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
    <!-- END - Completed Bonus Section -->

  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

import InviteFriendForm from '~/components/forms/InviteFriendForm';
import InviteeMissionGridList from '@/components/Mission/InviteeGridList';
import MissionList from '@/components/Mission/List';
import ReferralStats from '@/components/ReferralStats';
import RefreshButton from '~/components/RefreshButton';

import { logTrackerEvent } from '@/util/EventLogger';

export default {
  name: 'bonus-index',
  components: {
    InviteFriendForm,
    InviteeMissionGridList,
    MissionList,
    ReferralStats,
    RefreshButton,
  },
  data() {
    return {
      likeBonusAmountStr: '',
      referralPending: 0,
      referralVerified: 0,
      user: '',
      isShowReferralSection: false,
    };
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getUserIsRegistered',

      'getMissionList',
      'getIsFetchedMissions',
      'getIsFetchingMissions',
      'getReferralMissionList',
      'getSelectedMission',

      'getMissionHistorylist',
      'getIsFetchedMissionHistory',
      'getIsFetchingMissionHistory',
    ]),
  },
  watch: {
    getMissionList(list) {
      if (list.length > 0) {
        const { selectedMission } = this.$route.query;
        const mission = list.find(m => m.id === selectedMission);
        if (selectedMission) {
          if (mission) {
            this.onMissionClick(mission);
          } else {
            this.fetchSelectedMission({
              missionId: this.$route.query.selectedMission,
              userMissionList: list.map(l => l.id),
            });
          }
        }
      }
    },
    getSelectedMission(mission) {
      if (mission) {
        this.onMissionClickFromUrl(mission);
      }
    },
  },
  mounted() {
    const { hash } = document.location;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) element.scrollIntoView();
    }

    if (this.getUserIsRegistered) {
      this.updateInfo();
    }
  },
  methods: {
    ...mapActions([
      'fetchSelectedMission',
      'fetchUserReferralStats',
      'fetchUserTotalBonus',
      'refreshMissionList',
      'refreshMissionHistoryList',
      'onMissionClick',
      'onMissionClickFromUrl',
      'onReferralMissionClick',
      'onReferralSeen',
    ]),
    async updateInfo() {
      const user = this.getUserInfo;
      this.user = user.user;
      this.updateReferralStat();
      this.updateLikeBonus();
      this.refreshMissionList(user.user);
      this.refreshHistory();
    },
    async updateLikeBonus() {
      try {
        this.likeBonusAmountStr = await this.fetchUserTotalBonus(this.getUserInfo.user);
      } catch (err) {
        console.log(err);
      }
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
    refreshHistory() {
      this.refreshMissionHistoryList(this.getUserInfo.user);
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
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.earned-bonus-amount-section {
  @media (max-width: 600px) {
    padding-right: 0;
    padding-left: 0;
  }

  > div {
    display: flex;
    align-items: center;

    font-weight: 300;

    @media (max-width: 768px) {
      align-items: stretch;
      flex-direction: column;
    }

    @media (max-width: 600px) {
      padding-right: 0;
      padding-left: 0;
    }
  }

  .like-bonus-amount {
    min-height: 98px;
    padding: 0 12px;

    text-align: center;

    color: $like-gray-5;
    background-image: linear-gradient(240deg, #d2f0f0, #f0e6b4);

    font-size: 56px;
    line-height: 98px;

    @media (max-width: 1024px - 1px) {
      min-height: 72px;

      font-size: 42px;
      line-height: 72px;
    }

    @media (min-width: 768px + 1px) {
      width: calc(100% * 2 / 3);
    }

    @media (min-width: 600px + 1px) {
      border-radius: 8px;
    }
  }

  .like-bonus-label {
    font-size: 42px;
    line-height: 1.1;

    @media (max-width: 1024px - 1px) {
      font-size: 32px;
    }

    @media (min-width: 768px + 1px) {
      margin-left: 8px;
      padding-left: 24px;
    }

    @media (max-width: 768px) {
      margin: 8px 0;

      text-align: center;
    }
  }
}

.referral-form-section {
  min-height: 400px;
}

#invitee-mission {
  header {
    @mixin invitee-mission-header($percent) {
      &::after {
        width: calc(#{100% - $percent} - 16px);
      }

      > div {
        max-width: $percent;
      }
    }

    position: relative;

    &::after {
      display: block;

      height: 1px;

      content: " ";

      background-color: #E6E6E6;
    }

    > div {
      width: 100%;
    }

    @media (min-width: 1366px + 1px) {
      @include invitee-mission-header(25%);
    }

    @media (min-width: 960px + 1px) and (max-width: 1366px) {
      @include invitee-mission-header(1 / 3 * 100%);
    }

    @media (min-width: 600px + 1px) {
      &::after {
        position: absolute;
        top: 50%;
        right: 0;

        margin-right: 8px;
        margin-left: 8px;
      }

      @media (max-width: 960px) {
        @include invitee-mission-header(50%);
      }
    }

    @media (max-width: 600px) {
      &::after {
        position: relative;

        margin-top: 16px;
      }
    }
  }
}

</style>

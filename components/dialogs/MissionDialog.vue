<template>
  <div class="mission-dialog">
    <base-dialog
      ref="dialog"
      :class="['with-icon', { upcoming: isUpcomingMission }]"
      :isShowCloseButton="true">

      <div slot="header-center" class="lc-section-header-icon lc-dialog-icon lc-raised-icon">
        <mission-icon :mission-id="missionId" />
      </div>

      <transition name="lc-transition-default" mode="out-in">
        <div
          v-if="!shouldShowDesktopOnly && !isCompleted && isCustomLayout"
          key="custom"
          class="mission-dialog-content">

          <twitter-mission
            v-if="missionId === 'twitter'"
            :userId="getUserInfo.user"
            @cancel="onDismiss"
            @complete="onCompleteMission" />

        </div>
        <div
          v-else
          key="generic"
          class="mission-dialog-content">

          <div class="lc-dialog-container-1">
            <div class="reward-label">
              {{ mission.isReferral ? mission.referralReward : mission.reward }}
            </div>

            <h1 class="title-label">{{ title }}</h1>

            <div class="description" v-if="description" v-html="description" />
            <div class="description" v-if="subDescription" v-html="subDescription" />
          </div>

          <mission-completed-banner
            v-if="isCompleted"
            class="lc-margin-top-32 lc-mobile"
            @click="onDismiss" />

          <div v-else-if="shouldShowDesktopOnly" class="lc-dialog-container-1">
            <simple-svg
              class="lc-color-like-green lc-margin-vertical-16"
              :filepath="RequiredDesktopIcon"
              width="290px"
              height="270px"
              fill="currentColor"
              stroke="transparent" />

            <p class="lc-color-like-gray-4 lc-color-like-gray-4 lc-margin-vertical-16">
              {{ $t('Mission.common.label.pleaseUseDesktop') }}
            </p>

            <div class="lc-text-align-center">
              <a
                class="lc-font-size-16 lc-underline"
                href="https://help.like.co/likecoin-faq/newbies/accessing-my-likecoin-id-on-a-computer-which-is-previously-registered-on-mobile" target="_blank">
                {{ $t('Mission.common.button.desktopFAQ') }}
              </a>
            </div>

            <div class="lc-button-group lc-margin-top-16">
              <md-button class="md-likecoin lc-cancel" @click="onDismiss">
              {{ $t('General.button.cancel') }}
              </md-button>
            </div>
          </div>

          <div
            v-else
            class="lc-dialog-container-1 lc-margin-top-24 lc-mobile">
            <!-- BEGIN - Getting Start Section -->
            <div
              v-if="mission.id === 'gettingStart'"
              class="getting-start-form">

              <task-list
                :tasks="getTasks"
                @click="onClickGettingStartTask" />

              <div class="lc-button-group">
                <md-button class="md-likecoin" @click="onDismiss">
                {{ $t('General.button.ok') }}
                </md-button>
              </div>

            </div>
            <!-- END - Getting Start Section -->

            <!-- BEGIN - Verify Email Section -->
            <div
              v-else-if="!isReferral && missionId === 'verifyEmail'"
              class="verify-email-form">

              <verify-email-form
                ref="form"
                :email="this.getUserInfo.email"
                :label="$t('Dialog.emailInput.label')"
                @cancel="onDismiss"
                @submit="onVerifyEmail"/>

            </div>
            <!-- END - Verify Email Section -->

            <!-- BEGIN - Invitee Verify Email Section -->
            <div
              v-else-if="isReferral && missionId === 'verifyEmail'"
              class="verify-email-form">

              <div class="lc-button-group">
                <md-button
                  class="md-likecoin"
                  @click="onDismiss">
                  {{ $t('General.button.ok') }}
                </md-button>
              </div>

            </div>
            <!-- END - Verify Email Section -->

            <!-- BEGIN - Invite Friend Section -->
            <invite-friend-form
              v-else-if="mission.id === 'inviteFriend'"
              class="lc-margin-top-24"
              form-id="mission-invite-friend-form"
              @invite="onInviteFriend" />
            <!-- END - Invite Friend Section -->

            <!-- BEGIN - Join Token Sale Section -->
            <div
              v-else-if="!isReferral && isJoinTokenSaleMission"
              class="join-tokensale-form">

              <div class="lc-button-group">
                <md-button
                  class="md-likecoin"
                  @click="$router.push({ name: 'in-tokensale' })"
                >
                  {{ $t(`Home.Sale.button.${this.isUpcomingMission ? 'prepareToJoin' : 'joinNow'}`) }}
                </md-button>
                <br />
                <md-button
                  class="md-likecoin lc-cancel"
                  @click="onDismiss">
                  {{ $t('General.button.cancel') }}
                </md-button>
              </div>

            </div>
            <!-- END - Join Token Sale Section -->

            <!-- BEGIN - Invitee Join Token Sale Section -->
            <div
              v-else-if="isReferral && isJoinTokenSaleMission"
              class="join-tokensale-form">

              <div class="lc-button-group">
                <md-button
                  class="md-likecoin"
                  @click="onDismiss">
                  {{ $t('General.button.ok') }}
                </md-button>
              </div>

            </div>
            <!-- END - Join Token Sale Section -->

            <!-- BEGIN - Invite Token Sale Section -->
            <div
              v-else-if="missionId === 'inviteTokenSale'"
              class="invite-tokensale-form">

              <div class="lc-button-group">
                <md-button
                  class="md-likecoin"
                  @click="onDismiss">
                  {{ $t('General.button.ok') }}
                </md-button>
              </div>

            </div>
            <!-- END - Invite Token Sale Section -->
          </div>

        </div>
      </transition>

    </base-dialog>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';
import moment from 'moment';

import BaseDialog from '~/components/dialogs/BaseDialog';
import InviteFriendForm from '~/components/forms/InviteFriendForm';
import VerifyEmailForm from '~/components/forms/VerifyEmailForm';
import MissionCompletedBanner from '~/components/Mission/CompletedBanner';
import MissionIcon from '~/components/Mission/Icon';
import TaskList from '~/components/Mission/TaskList';
import TwitterMission from '~/components/dialogs/MissionDialogContent/Twitter';
import { GETTING_STARTED_TASKS } from '@/constant';

import { logTrackerEvent } from '@/util/EventLogger';
import { openURL, checkIsMobileClient } from '@/util/client';

import LinkIcon from '@/assets/icons/fillable/link.svg';
import FacebookIcon from '@/assets/icons/fillable/facebook.svg';
import TwitterIcon from '@/assets/icons/fillable/twitter.svg';
import RequiredDesktopIcon from '@/assets/mission/misc/required-desktop.svg';

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
  name: 'mission-dialog',
  components: {
    BaseDialog,
    InviteFriendForm,
    VerifyEmailForm,
    MissionCompletedBanner,
    MissionIcon,
    TwitterMission,
    TaskList,
  },
  data() {
    return {
      GETTING_STARTED_TASKS,
      FacebookIcon,
      LinkIcon,
      TwitterIcon,
      RequiredDesktopIcon,
      isReferral: false,
      isCompleted: false,
      invitee: '',
    };
  },
  computed: {
    ...mapGetters([
      'getPopupMission',
      'getMissionById',
      'getUserInfo',
    ]),
    mission() {
      return this.getMissionById(this.getPopupMission.id) || {};
    },
    isCustomLayout() {
      switch (this.missionId) {
        case 'twitter':
          return true;
        default:
          return false;
      }
    },
    title() {
      return this.$t(`Mission.${this.missionId}.title`);
    },
    description() {
      if (this.shouldShowDesktopOnly) {
        return this.$t('Mission.common.label.desktopRequired');
      }

      const referralPostfix = this.isReferral ? 'Referral' : '';
      const { invitee } = this;
      return `
        ${this.mission.upcoming ? this.$t(
    'Mission.common.label.upcomingDate',
    { upcoming: moment.utc(this.mission.upcoming).local().format('D-M-YYYY') },
  )
    : ''}
        ${this.$t(`Mission.${this.missionId}${referralPostfix}.description`, { invitee })}
      `;
    },
    subDescription() {
      if (
        !this.shouldShowDesktopOnly
        && this.hasReferrer
        && this.missionId === 'joinTokenSale'
      ) {
        return this.$t('Mission.joinTokenSale.subDescription');
      }
      return null;
    },
    missionId() {
      return this.mission.id || this.getPopupMission.id;
    },
    shouldShowDesktopOnly() {
      return this.mission.isDesktopOnly && checkIsMobileClient();
    },
    isJoinTokenSaleMission() {
      return (this.missionId === 'joinTokenSale' || this.missionId === 'refereeTokenSale');
    },
    getTasks() {
      return GETTING_STARTED_TASKS.map(id => ({
        id,
        title: this.$t(`Mission.${this.missionId}.${id}`),
        state: this.mission[id] ? 'completed' : 'active',
      }));
    },
    hasReferrer() {
      return this.getUserInfo.referrer;
    },
    isUpcomingMission() {
      return this.mission.upcoming;
    },
  },
  methods: {
    ...mapActions([
      'postStepMission',
      'refreshMissionList',
      'onMissionClick',
    ]),
    show() {
      this.$refs.dialog.show();
    },
    hide() {
      this.$refs.dialog.hide();
    },
    refreshMissions() {
      this.refreshMissionList(this.getUserInfo.user);
    },
    onVerifyEmail() {
      // TODO
      this.hide();
    },
    onInviteFriend(type) {
      switch (type) {
        case 'email':
          logTrackerEvent(this, 'Mission', 'ClickGetFreeLikeCoin', 'email invite', 1);
          break;
        case 'url':
          logTrackerEvent(this, 'Mission', 'sendInvitation', 'copy invite link', 1);
          break;
        case 'facebook':
          logTrackerEvent(this, 'Mission', 'sendInvitation', 'fb share invite', 1);
          break;
        case 'twitter':
          logTrackerEvent(this, 'Mission', 'sendInvitation', 'twitter invite', 1);
          break;
        default:
      }
    },
    async onClickGettingStartTask(t) {
      /* post first due to trust problem */
      await Promise.race([
        this.postStepMission({
          user: this.getUserInfo.user,
          missionId: this.missionId,
          taskId: t.id,
        }),
        // magic time to allow popup and xhr call without being blocked
        timeout(23),
      ]);

      switch (t.id) {
        case 'taskPaymentPage':
          openURL(this, `/${this.getUserInfo.user}`, 'payment-page');
          break;

        case 'taskOnepager': {
          openURL(this, '/in/whitepaper', 'onpager-page');
          break;
        }

        case 'taskVideo': {
          let link = 'https://youtu.be/';
          switch (this.$i18n.locale) {
            case 'cn':
              link += '344nFHa7fC0';
              break;
            case 'zh':
              if (window.navigator.language === 'zh-HK') {
                link += 'MCeXL2WpK10';
              } else {
                link += '344nFHa7fC0';
              }
              break;
            case 'ja':
              link += 'YbMTQ3F1isU';
              break;
            case 'ru':
              link += 'MXkcdOg3Hkk';
              break;
            default:
              link += '28spMOgMs3o';
          }
          openURL(this, link, 'youtube');
          break;
        }

        case 'taskSocial': {
          let link = 'https://twitter.com/likecoin_fdn';
          switch (this.$i18n.locale) {
            case 'zh':
              link = 'https://www.facebook.com/LikeCoin.Foundation';
              break;
            default:
          }
          openURL(this, link, 'social-group');
          break;
        }
        default:
      }
    },
    async onCompleteMission() {
      this.hide();
      await this.onMissionClick({
        ...this.mission,
        done: true,
      });
      this.refreshMissions();
    },
    onDismiss() {
      this.hide();
    },
  },
  watch: {
    getPopupMission(m) {
      if (m) {
        const { invitee, isReferral, isCompleted } = m;
        this.invitee = invitee;
        this.isReferral = isReferral;
        this.isCompleted = !!isCompleted;
        this.show();
      }
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.lc-dialog-icon {
  .upcoming & {
    background: #e6e6e6;
  }

  @media (max-width: 600px) {
    padding: 2px;
  }

  .mission-icon {
    color: $like-green;

    .upcoming & {
      color: #9b9b9b;
    }
  }
}

.title-label {
  color: $like-dark-brown-2;

  font-size: 32px;
  font-weight: 300;

  &:not(:last-child){
    margin-bottom: 8px;
  }
}

.reward-label {
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;

  color: $like-green;

  font-size: 20px;
  font-weight: 600;

  &:not(:last-child) {
    margin-bottom: 12px;
  }

  .small {
    font-size: 12px;
  }

  .upcoming & {
    color: $like-gray-4;
  }
}

.description {
  color: $like-gray-4;

  font-size: 16px;

  &:not(:last-child) {
    margin-bottom: 32px;
  }
}

.md-dialog.upcoming {
  :global(.lc-dialog-header::before) {
    background-image: linear-gradient(266deg, #ececec, #c0c0c0);
  }
}
</style>

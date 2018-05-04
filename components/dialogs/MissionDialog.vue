<template>
  <div class="mission-dialog">
    <base-dialog
      ref="dialog"
      :class="['with-icon', { upcoming: isUpcomingMission }]"
      :isShowCloseButton="true">

      <template slot="header-center">
        <div class="lc-dialog-icon lc-raised-icon">
          <mission-icon :mission-id="missionId" />
        </div>
      </template>

      <div class="mission-dialog-content">

        <div class="lc-dialog-container-1">
          <div class="reward-label">
            {{ mission.isReferral ? mission.referralReward : mission.reward }}
          </div>

          <h1 class="title-label">{{ title }}</h1>

          <div class="description" v-html="description" />
          <div class="description" v-if="subDescription" v-html="subDescription" />
        </div>

        <mission-completed-banner
          v-if="isCompleted"
          class="lc-margin-top-32"
          @click="onDismiss" />
        <div v-else class="lc-dialog-container-1">
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
import { GETTING_STARTED_TASKS } from '@/constant';

import { logTrackerEvent } from '@/util/EventLogger';

import LinkIcon from '@/assets/icons/fillable/link.svg';
import FacebookIcon from '@/assets/icons/fillable/facebook.svg';
import TwitterIcon from '@/assets/icons/fillable/twitter.svg';

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
    TaskList,
  },
  data() {
    return {
      GETTING_STARTED_TASKS,
      FacebookIcon,
      LinkIcon,
      TwitterIcon,
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
      'getWeb3Type',
    ]),
    mission() {
      return this.getMissionById(this.getPopupMission.id) || {};
    },
    title() {
      return this.$t(`Mission.${this.missionId}.title`);
    },
    description() {
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
      if (this.hasReferrer && this.missionId === 'joinTokenSale') {
        return this.$t('Mission.joinTokenSale.subDescription');
      }
      return null;
    },
    missionId() {
      return this.mission.id || this.getPopupMission.id;
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
    isTrust() {
      return this.getWeb3Type === 'window' && window.web3 && window.web3.currentProvider.isTrust;
    },
  },
  methods: {
    ...mapActions([
      'postStepMission',
    ]),
    show() {
      this.$refs.dialog.show();
    },
    hide() {
      this.$refs.dialog.hide();
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
    openURL(url, name) {
      if (this.isTrust) {
        window.location.assign(url);
      } else {
        window.open(url, name || '_blank');
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
          this.openURL(`/${this.getUserInfo.user}`, 'payment-page');
          break;

        case 'taskOnepager': {
          this.openURL('/in/whitepaper', 'onpager-page');
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
          this.openURL(link, 'youtube');
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
          this.openURL(link, 'social-group');
          break;
        }
        default:
      }
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

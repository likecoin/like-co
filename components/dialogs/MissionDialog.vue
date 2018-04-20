<template>
  <div class="mission-dialog">
    <base-dialog ref="dialog" class="with-icon">

      <div slot="header-center" class="lc-dialog-icon">
        <mission-icon :mission-id="missionId" />
      </div>

      <div class="lc-dialog-container-1">
        <div class="mission-dialog-content">

          <div class="reward-label">
            {{ mission.isReferral ? mission.referralReward : mission.reward }}
          </div>

          <h1 class="title-label">{{ title }}</h1>

          <div class="description" v-html="description" />

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
                @click="$router.to({ name: 'in-tokensale' })"
              >
                {{ $t('Home.Sale.button.joinNow') }}
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
    title() {
      return this.$t(`Mission.${this.missionId}.title`);
    },
    description() {
      const referralPostfix = this.isReferral ? 'Referral' : '';
      const { invitee } = this;
      return this.$t(`Mission.${this.missionId}${referralPostfix}.description`, { invitee });
    },
    missionId() {
      return this.mission.id;
    },
    isJoinTokenSaleMission() {
      return (this.missionId === 'joinTokenSale' || this.missionId === 'refereeTokenSale');
    },
    getTasks() {
      return GETTING_STARTED_TASKS.map(id => ({
        id,
        title: `Mission.${this.missionId}.${id}`,
        state: this.mission[id] ? 'completed' : 'active',
      }));
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
    async onClickGettingStartTask(t) {
      switch (t.id) {
        case 'taskPaymentPage':
          window.open(`/${this.getUserInfo.displayName}`, 'payment-page');
          break;

        case 'taskVideo': {
          let link = 'https://youtu.be/';
          switch (this.$i18n.locale) {
            case 'cn':
            case 'zh':
              link += '344nFHa7fC0';
              break;
            case 'ja':
              link += 'YbMTQ3F1isU';
              break;
            default:
              link += '28spMOgMs3o';
          }
          window.open(link, 'youtube');
          break;
        }

        case 'taskTelegram': {
          let link = 'https://t.me/likecoin';
          switch (this.$i18n.locale) {
            case 'ja':
              link += '_jp';
              break;
            case 'ru':
              link += '_ru';
              break;
            case 'ko':
              link += '_kr';
              break;
            default:
          }
          window.open(link, 'telegram-group');
          break;
        }

        default:
      }
      await this.postStepMission({
        user: this.getUserInfo.user,
        missionId: this.missionId,
        taskId: t.id,
      });
    },
    onDismiss() {
      this.hide();
    },
  },
  watch: {
    getPopupMission(m) {
      if (m) {
        const { invitee, isReferral } = m;
        this.invitee = invitee;
        this.isReferral = isReferral;
        this.show();
      }
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.lc-dialog-icon {
  padding: 4px;

  border-radius: 50%;
  background-image: linear-gradient(252deg, #d2f0f0, #f0e6b4);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.7);

  @media (max-width: 600px) {
    padding: 2px;
  }

  > img {
    border-radius: 50%;
    background-color: white;
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
}

.description {
  color: $like-gray-4;

  font-size: 16px;

  &:not(:last-child) {
    margin-bottom: 32px;
  }
}

</style>

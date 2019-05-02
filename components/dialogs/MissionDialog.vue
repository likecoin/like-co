<template>
  <div class="mission-dialog">
    <base-dialog
      ref="dialog"
      :class="[
        {
          upcoming: isUpcomingMission,
          'with-icon': !isUnfinishedAndExpired,
        }
      ]"
      :isShowCloseButton="true"
      @update:isShow="onDialogUpdate($event)"
    >
      <div
        v-if="!isUnfinishedAndExpired"
        slot="header-center"
        class="lc-section-header-icon lc-dialog-icon lc-raised-icon"
      >
        <mission-icon :mission-id="missionId" />
      </div>

      <transition
        name="lc-transition-default"
        mode="out-in"
      >
        <div
          v-if="!shouldShowDesktopOnly && isCustomLayout && !isCompleted"
          key="custom"
          class="mission-dialog-content"
        >

          <quote-tweet-mission
            v-if="missionId === 'twitter'"
            :userId="getUserInfo.user"
            @cancel="onDismiss"
            @complete="onCompleteMission"
          />

          <retweet-mission
            v-else-if="missionId === 'twitterBitmart'"
            :user-id="getUserInfo.user"
            :mission-id="missionId"
            tweet-url="https://twitter.com/BitMartExchange/status/1010271556742807552"
            @cancel="onDismiss"
            @complete="onCompleteMission"
          />

          <connect-oice-mission
            v-else-if="missionId === 'registerOice'"
            :user-id="getUserInfo.user"
            @cancel="onDismiss"
            @complete="onCompleteMission"
          />

        </div>
        <div
          v-else
          key="generic"
          class="mission-dialog-content"
        >

          <div class="lc-dialog-container-1">
            <div
              v-if="reward"
              class="reward-label"
            >
              {{ reward }}
            </div>

            <h1 class="title-label">{{ title }}</h1>

            <div v-if="isUnfinishedAndExpired">
              <i18n
                class="description"
                path="Mission.notFound.description"
                tag="div"
              >
                <div
                  place="bonusPage"
                  @click="onDismiss"
                >
                  <nuxt-link
                    :to="{ name: 'in-bonus' }"
                    class="lc-font-weight-600 lc-color-like-green lc-underline"
                  >{{
                    $t('Mission.notFound.bonusPage')
                  }}</nuxt-link>
                </div>
              </i18n>
            </div>
            <div v-else-if="isMissionRequired">
              <i18n
                :path="`Mission.missionRequired.${mission.require[0]}.description`"
                class="description"
                tag="div"
              >
                <span
                  class="lc-font-weight-600 lc-color-like-dark-brown-2"
                  place="bonusTask"
                >{{
                  $t(`Mission.${mission.id}.title`)
                }}</span>
              </i18n>
            </div>
            <div
              v-else-if="description"
              class="description"
              v-html="description"
            />

            <div
              v-if="subDescription"
              class="description"
              v-html="subDescription"
            />
          </div>

          <mission-completed-banner
            v-if="isCompleted || mission.isClaimed && !mission.staying"
            :animated="isCompleted"
            :isClaimed="mission.isClaimed"
            class="lc-margin-top-32 lc-mobile"
            @click="onDismiss"
          />

          <div
            v-else-if="shouldShowDesktopOnly"
            class="lc-dialog-container-1"
          >
            <simple-svg
              :filepath="RequiredDesktopIcon"
              class="lc-color-like-green lc-margin-vertical-16"
              width="290px"
              height="270px"
              fill="currentColor"
              stroke="transparent"
            />

            <p class="lc-color-like-gray-4 lc-color-like-gray-4 lc-margin-vertical-16">
              {{ $t('Mission.common.label.pleaseUseDesktop') }}
            </p>

            <div class="lc-text-align-center">
              <a
                class="lc-font-size-16 lc-underline"
                href="https://help.like.co/likecoin-faq/newbies/accessing-my-likecoin-id-on-a-computer-which-is-previously-registered-on-mobile"
                target="_blank"
              >
                {{ $t('Mission.common.button.desktopFAQ') }}
              </a>
            </div>

            <div class="lc-button-group lc-margin-top-16">
              <md-button
                class="md-likecoin lc-cancel"
                @click="onDismiss"
              >
                {{ $t('General.button.cancel') }}
              </md-button>
            </div>
          </div>

          <div
            v-else
            class="lc-dialog-container-1 lc-margin-top-24 lc-mobile"
          >

            <!-- BEGIN - Mission Not Found Section -->
            <div
              v-if="mission.isExpired"
            >

              <div class="lc-button-group">
                <md-button
                  class="md-likecoin"
                  @click="onDismiss"
                >
                  {{ $t('General.button.ok') }}
                </md-button>
              </div>

            </div>
            <!-- END - Mission Not Found Section -->

            <!-- BEGIN - Required Other Mission Section -->
            <div
              v-else-if="isMissionRequired"
            >

              <div class="lc-button-group">
                <md-button
                  class="md-likecoin"
                  @click="onClickNextMission"
                >
                  {{ $t('General.button.next') }}
                </md-button>
              </div>

            </div>
            <!-- END - Required Other Mission Section -->

            <!-- BEGIN - Getting Start Section -->
            <div
              v-else-if="mission.id === 'gettingStart'"
              class="getting-start-form"
            >

              <task-list
                :tasks="getTasks"
                @click="onClickGettingStartTask"
              />

              <div class="lc-button-group">
                <md-button
                  class="md-likecoin"
                  @click="onDismiss"
                >
                  {{ $t('General.button.ok') }}
                </md-button>
              </div>

            </div>
            <!-- END - Getting Start Section -->

            <!-- BEGIN - Verify Email Section -->
            <div
              v-else-if="!isReferral && missionId === 'verifyEmail' && !bonusCooldown"
              class="verify-email-form"
            >

              <verify-email-form
                ref="form"
                :email="getUserInfo.email"
                :label="$t('Dialog.emailInput.label')"
                @cancel="onDismiss"
                @submit="onVerifyEmail"
              />

            </div>
            <!-- END - Verify Email Section -->

            <!-- BEGIN - Verify Email with bonusCooldown Section -->
            <div
              v-else-if="!isReferral && missionId === 'verifyEmail' && bonusCooldown"
            >
              <mission-bonus-countdown
                :bonus-cooldown="bonusCooldown"
                @finish="onCompleteMission"
              />
            </div>
            <!-- END - Verify Email with bonusCooldown Section -->

            <!-- BEGIN - Invitee Verify Email Section -->
            <div
              v-else-if="isReferral && missionId === 'verifyEmail' && !bonusCooldown"
              class="verify-email-form"
            >

              <div class="lc-button-group">
                <md-button
                  class="md-likecoin"
                  @click="onDismiss"
                >
                  {{ $t('General.button.ok') }}
                </md-button>
              </div>

            </div>
            <!-- END - Invitee Verify Email Section -->

            <!-- BEGIN - Invitee with bonusCooldown Verify Email Section -->
            <div
              v-else-if="isReferral && missionId === 'verifyEmail' && bonusCooldown"
            >
              <mission-bonus-countdown
                :id="invitee.id"
                :bonus-cooldown="bonusCooldown"
                :display-name="invitee.displayName"
                @finish="onCompleteMission"
              />
            </div>
            <!-- END - Invitee with bonusCooldown Verify Email Section -->

            <!-- BEGIN - Invite Friend Section -->
            <invite-friend-form
              v-else-if="isShowInviteMoreFriend || mission.id === 'inviteFriend' && !bonusCooldown"
              class="lc-margin-top-24"
              form-id="mission-invite-friend-form"
              @invite="onInviteFriend"
            />
            <!-- END - Invite Friend Section -->

            <!-- BEGIN - Invite Friend With bonusCooldown Section -->
            <div
              v-else-if="mission.id === 'inviteFriend' && bonusCooldown"
            >
              <mission-bonus-countdown
                :id="getProxyMissionRefereeId(mission.id)"
                :bonus-cooldown="bonusCooldown"
                :display-name="getRefereeDisplayName(getProxyMissionRefereeId(mission.id))"
                @finish="onCompleteMission"
              />

              <div class="lc-text-align-center">
                <md-button
                  class="lc-color-like-green lc-underline"
                  @click="isShowInviteMoreFriend = true"
                >
                  {{ $t('Mission.inviteFriend.button.invite') }}
                </md-button>
              </div>
            </div>
            <!-- END - Invite Friend With bonusCooldown Section -->

            <!-- BEGIN - Join Token Sale Section -->
            <div
              v-else-if="!isReferral && isJoinTokenSaleMission"
              class="join-tokensale-form"
            >

              <div class="lc-button-group">
                <md-button
                  class="md-likecoin"
                  @click="$router.push({ name: 'in-tokensale' })"
                >
                  {{ $t(`Home.Sale.button.${isUpcomingMission
                    ? 'prepareToJoin' : 'joinNow'}`) }}
                </md-button>
                <br>
                <md-button
                  class="md-likecoin lc-cancel"
                  @click="onDismiss"
                >
                  {{ $t('General.button.cancel') }}
                </md-button>
              </div>

            </div>
            <!-- END - Join Token Sale Section -->

            <!-- BEGIN - Invitee Join Token Sale Section -->
            <div
              v-else-if="isReferral && isJoinTokenSaleMission"
              class="join-tokensale-form"
            >

              <div class="lc-button-group">
                <md-button
                  class="md-likecoin"
                  @click="onDismiss"
                >
                  {{ $t('General.button.ok') }}
                </md-button>
              </div>

            </div>
            <!-- END - Join Token Sale Section -->

            <!-- BEGIN - Invite Token Sale Section -->
            <div
              v-else-if="missionId === 'inviteTokenSale'"
              class="invite-tokensale-form"
            >

              <div class="lc-button-group">
                <md-button
                  class="md-likecoin"
                  @click="onDismiss"
                >
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
import format from 'date-fns/format';

import BaseDialog from '~/components/dialogs/BaseDialog';
import InviteFriendForm from '~/components/forms/InviteFriendForm';
import MissionCompletedBanner from '~/components/Mission/CompletedBanner';
import MissionIcon from '~/components/Mission/Icon';
import QuoteTweetMission from '~/components/dialogs/MissionDialogContent/QuoteTweet';
import RetweetMission from '~/components/dialogs/MissionDialogContent/Retweet';
import ConnectOiceMission from '~/components/dialogs/MissionDialogContent/ConnectOice';
import TaskList from '~/components/Mission/TaskList';
import VerifyEmailForm from '~/components/forms/VerifyEmailForm';
import { GETTING_STARTED_TASKS } from '@/constant';
import MissionBonusCountdown from '~/components/dialogs/MissionDialogContent/BonusCountdown';

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
    MissionCompletedBanner,
    MissionIcon,
    QuoteTweetMission,
    RetweetMission,
    ConnectOiceMission,
    TaskList,
    VerifyEmailForm,
    MissionBonusCountdown,
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
      isShowInviteMoreFriend: false,
      invitee: '',
      bonusCooldown: 0,
    };
  },
  computed: {
    ...mapGetters([
      'getPopupMission',
      'getMissionById',
      'getUserInfo',
      'getMissionList',
      'getSelectedMission',
      'getProxyMissionDetails',
      'getRefereeDisplayName',
    ]),
    mission() {
      return (
        this.getMissionById(this.getPopupMission.id)
        || this.getSelectedMission
        || {}
      );
    },
    isCustomLayout() {
      return /(^twitter.*|registerOice)/.test(this.missionId);
    },
    reward() {
      if (this.mission.isFromUrl) return '';
      return this.mission.isReferral ? this.mission.referralReward : this.mission.reward;
    },
    title() {
      if (this.isUnfinishedAndExpired) {
        return this.$t('Mission.notFound.title');
      }
      if (this.isMissionRequired) {
        return this.$t(`Mission.missionRequired.${this.mission.require[0]}.title`);
      }
      if (this.bonusCooldown) {
        switch (this.mission.id) {
          case 'verifyEmail':
            return this.$t('Mission.verifyEmail.cooldown.title');
          default:
            return null;
        }
      }
      return this.$t(`Mission.${this.missionId}.title`);
    },
    description() {
      if (this.mission.isFromUrl) {
        return '';
      }
      if (this.shouldShowDesktopOnly) {
        return this.$t('Mission.common.label.desktopRequired');
      }

      if (this.bonusCooldown) {
        if (!(this.mission.id === 'inviteFriend' && this.isShowInviteMoreFriend)) {
          return '';
        }
      }

      const referralPostfix = this.isReferral ? 'Referral' : '';
      let localeParams;
      if (referralPostfix) {
        localeParams = {
          invitee: this.invitee.displayName,
        };
      }
      return `
        ${this.mission.upcoming ? this.$t(
    'Mission.common.label.upcomingDate',
    { upcoming: format(this.mission.upcoming, 'D-M-YYYY') },
  )
    : ''}
        ${this.$t(`Mission.${this.missionId}${referralPostfix}.description`, localeParams)}
      `;
    },
    subDescription() {
      if (this.mission.isExpired) return null;
      if (this.hasReferrer && this.missionId === 'joinTokenSale') {
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
    isUnfinishedAndExpired() {
      return this.mission.isExpired && !this.mission.isClaimed;
    },
    isMissionRequired() {
      return this.mission.isMissionRequired && this.mission.require.length > 0;
    },
  },
  watch: {
    getPopupMission(m) {
      if (m) {
        const {
          invitee, isReferral, isCompleted, bonusCooldown,
        } = m;
        this.invitee = invitee;
        this.isReferral = isReferral;
        this.isCompleted = !!isCompleted;
        this.bonusCooldown = bonusCooldown;
        this.isShowInviteMoreFriend = false;
        this.show();
      }
    },
  },
  methods: {
    ...mapActions([
      'postStepMission',
      'refreshMissionList',
      'onMissionClick',
      'setPromptNotificationDialog',
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
      // in case referee mission is not in user's mission list
      const mission = Object.keys(this.mission) > 0 ? this.mission : this.getPopupMission;
      await this.onMissionClick({
        ...mission,
        done: true,
      });
      this.refreshMissions();
    },
    onDismiss() {
      this.hide();
      const isMissionDialogShow = false;
      this.onDialogUpdate(isMissionDialogShow);
    },
    onDialogUpdate(isMissionDialogShow) {
      if (this.getUserInfo.isEmailEnabled === false && !isMissionDialogShow && this.isCompleted) {
        this.setPromptNotificationDialog(true);
      }
    },
    onClickNextMission() {
      const mission = this.getMissionList.find(m => m.id === this.mission.require[0]);
      if (mission) {
        this.onMissionClick({
          ...mission,
        });
      } else {
        this.hide();
      }
    },
    getProxyMissionRefereeId(missionId) {
      const proxyMission = this.getProxyMissionDetails(missionId);
      return proxyMission ? proxyMission.earliestInvitee.id : null;
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

  > div:not([place='']) {
    display: inline;
  }
}

.md-dialog.upcoming {
  /deep/ .lc-dialog-header::before {
    background-image: linear-gradient(266deg, #ececec, #c0c0c0);
  }
}

.mission-dialog-content {
  /deep/ .instruction-image {
    display: block;

    min-width: 418px;
    padding: 16px 16px 24px;

    img {
      border: solid 2px #E6E6E6;
      border-radius: 8px;
      background-color: $like-gray-1;
    }

    @media (max-width: 600px) {
      min-width: 100%;
    }
  }
}
</style>

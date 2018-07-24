<template>
  <div :class="['mission-item', layout, state, mission.id]">
    <div>

      <div
        class="mission-card"
        @click="$emit('click')"
      >
        <div class="mission-action-button">
          <mission-state-icon
            :layout="layout"
            :state="state"
          />
        </div>

        <div class="mission-card-container">
          <h2
            class="reward-label"
            v-html="reward"
          />
          <mission-icon
            :mission-id="mission.id"
            class="mission-icon"
          />
          <h1 class="title-label"><span>{{ title }}</span></h1>
        </div>
      </div>

      <span
        v-if="isNew"
        class="item-label new"
      />
      <span
        v-if="isUpcoming"
        class="item-label upcoming"
      />

    </div>
  </div>
</template>


<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';

import MissionIcon from '@/components/Mission/Icon';
import MissionStateIcon from '@/components/Mission/StateIcon';

import { ONE_LIKE } from '@/constant';

export default {
  name: 'mission-item',
  components: {
    MissionIcon,
    MissionStateIcon,
  },
  props: {
    layout: {
      type: String,
      validator(value) {
        return ['small', 'large', 'fluid'].indexOf(value) !== -1;
      },
      default: 'fluid',
    },
    mission: {
      type: Object,
      default: () => ({}),
    },
    isReferral: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters([
      'getProxyMissionReward',
      'getMissionHistoryReward',
      'getUserInfo',
    ]),
    isHistory() {
      return (this.mission || {}).isHistory;
    },
    title() {
      return this.$t(`Mission.${this.mission.id}.title`);
    },
    isNew() {
      if (this.isHistory || this.mission.upcoming) return false;
      if (this.isReferral) {
        return !!this.mission.pendingReferralBonus;
      } else if (this.mission.isProxy) {
        return !this.mission.seen || !!this.getProxyMissionReward(this.mission.id);
      }
      return !this.mission.seen && !this.mission.done;
    },
    isUpcoming() {
      return this.mission.upcoming;
    },
    reward() {
      if (this.isHistory && this.getMissionHistoryReward(this.mission.id)) {
        /* history api return toFixed(4) so no need div(ONE_LIKE) */
        return `${this.getMissionHistoryReward(this.mission.id).toFixed(2)} LIKE`;
      }
      if (this.isReferral) {
        if (this.mission.pendingReferralBonus) {
          return `${new BigNumber(this.mission.pendingReferralBonus).div(ONE_LIKE).toFixed(2)} LIKE`;
        }
        return this.mission.referralReward;
      }
      if (this.mission.isProxy && this.getProxyMissionReward(this.mission.id)) {
        return `${this.getProxyMissionReward(this.mission.id)} LIKE`;
      }
      if (this.getUserInfo.referrer) {
        /* joinTokenSale HACK */
        if (this.mission.id === 'joinTokenSale' && this.mission.done) {
          let reward = Number.parseInt(this.mission.reward, 10);
          const extra = this.getProxyMissionReward('refereeTokenSale');
          if (extra) reward += Number.parseInt(extra, 10);
          return `${reward} LIKE`;
        }
        if (this.mission.refereeReward) {
          return this.mission.refereeReward;
        } else if (this.mission.refereeExtraReward) {
          return `${this.mission.reward} + ${this.mission.refereeExtraReward}`;
        }
      }
      return this.mission.reward;
    },
    state() {
      if (this.isHistory) return 'claimed';
      if (this.isReferral) {
        if (this.mission.pendingReferralBonus) return 'completed';
        return this.mission.done ? 'claimed' : 'active';
      }
      if (this.mission.upcoming && Date.now() < this.mission.upcoming) return 'upcoming';
      if (this.mission.isProxy) {
        return this.getProxyMissionReward(this.mission.id) ? 'completed' : 'active';
      }
      if (this.mission.isClaimed) return 'claimed';
      if (this.mission.done) return 'completed';
      return (this.mission.status === 'pending') ? 'pending' : 'active';
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

@mixin large-mission-item {
  > div {
    display: block;

    padding-bottom: 26px;
  }

  .mission-card-container {
    display: block;

    text-align: center;

    color: $like-green;
  }

  &:not(.claimed) {
    .mission-card {
      .mission-action-button::before {
        position: absolute;
        z-index: 0;
        right: 0;
        bottom: 0;
        left: 0;

        height: 100%;

        content: "";
        transition: box-shadow .2s ease-in-out;

        border-bottom-right-radius: 50%;
        border-bottom-left-radius: 50%;
        box-shadow: 0 0 0 0 transparent;

        clip-path: polygon(-50% 50%, 150% 50%, 150% 150%, 0% 150%);
      }
    }

    &:not(.completed) {
      .mission-card {
        &:hover {
          box-shadow: 0 3px 20px 2px #00000020;

          .mission-action-button::before {
            box-shadow: 0 5px 20px 0 #00000025;
          }
        }

        &:active {
          .mission-action-button::before {
            box-shadow: 0 1px 3px 0 #00000040;
          }
        }
      }
    }
  }

  &.completed {
    .mission-card {
      background-image: linear-gradient(215deg, #D2F0F0, #F0E6B4);
      box-shadow: 0 0 3px 1px rgba(240, 238, 156, 0.8);

      &::before {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;

        margin: 4px;

        content: "";

        border-radius: 4px;
        background-color: $like-white;
      }

      &:not(:hover):not(:active) {
        .mission-action-button {
          @keyframes completed-mission-action-button-shaking {
            0%, 50% {
              transform: rotateZ(0deg);
            }
            70% {
              transform: rotateZ(-3deg);
            }
            85% {
              transform: rotateZ(6deg);
            }
            100% {
              transform: rotateZ(-12deg);
            }
          }

          transform-origin: center top;
          animation-name: completed-mission-action-button-shaking;
          animation-duration: 1s;
          animation-timing-function: ease-in;
          animation-iteration-count: infinite;
          animation-direction: alternate;
        }
      }

      &:hover:not(:active) {
        box-shadow: 0 0 16px 2px rgba(240, 238, 156, 0.8);

        .mission-action-button::before {
          box-shadow: 0 0 16px 4px rgb(240, 238, 156);
        }
      }
    }
  }

  .title-label {
    height: 52px;

    color: $like-dark-brown-2;

    font-size: 20px;
    line-height: 54px;

    > span {
      line-height: 22px;
    }
  }

  .reward-label {
    height: 28px;

    text-align: center;

    font-size: 20px;
    line-height: 28px;

    :global(.small) {
      font-size: 12px;
    }
  }

  &.fluid {
    &.claimed {
      .reward-label {
        color: currentColor;
      }
    }
  }

  .mission-icon {
    width: 96px;
    height: 96px;
    margin: 16px auto 8px;

    color: $like-green;
  }
  &.upcoming .mission-icon {
    color: #9B9B9B;
  }

  .mission-action-button {
    bottom: -26px;
    left: calc(50% - 26px);
  }

  .item-label {
    right: 0;
    bottom: 0;

    margin-bottom: 4px;

    &::after {
      font-size: 12px;
      font-weight: 600;
      line-height: 1;
    }

    &.new {
      margin-right: 8px;

      &::after {
        content: "NEW";
      }
    }

    &.upcoming {
      margin-right: 16px;

      &::after {
        content: "SOON";
      }
    }
  }
}

@mixin small-mission-item {
  .mission-card {
    width: 100%;
    padding: 4px 10px 4px 40px;

    user-select: none;

    border-radius: 4px;
  }

  .mission-action-button {
    top: calc(50% - 32px / 2);
    left: 4px;
  }

  .item-label.new {
    top: 50%;
    left: -20px;

    transform: translateY(-50%);
  }

  .mission-icon {
    display: none;
  }

  &.completed {
    .mission-card {
      transition: transform .15s ease-in,
                  box-shadow .15s ease-in;

      color: white;
      background-color: $like-green-2;
    }
  }

  &.active,
  &.pending {
    .reward-label {
      color: $like-green;
    }
  }

  &.claimed {
    .mission-card {
      cursor: auto;

      color: #9B9B9B;
      background-color: #EFEFEF;
    }
  }
}

.mission-item {
  width: 100%;

  > div {
    position: relative;

    display: flex;
  }

  &:not(.claimed) {
    .mission-card {
      cursor: pointer;
      transition: transform .2s ease-in-out,
                  box-shadow .2s ease-in-out;

      &:hover {
        box-shadow: 0 3px 28px 0 #00000030;
      }

      &:active {
        transform: translateY(1px);

        box-shadow: 0 1px 3px 0 #00000040;
      }
    }
  }

  &.claimed {
    pointer-events: none;
  }

  &.small {
    @include small-mission-item();
  }

  &.large {
    @include large-mission-item();
  }

  &.fluid {
    @media (min-width: 600px + 1px) {
      @include large-mission-item();
    }

    @media (max-width: 600px) {
      @include small-mission-item();
    }
  }
}

.mission-card-container {
  position: relative;

  display: flex;
  align-items: center;
}

.mission-card {
  position: relative;

  box-sizing: border-box;
  padding: 16px 4px 40px;

  border-radius: 8px;
  background-color: white;
}

.title-label {
  overflow: hidden;
  flex: 2;
  order: 2;

  height: 40px;

  color: currentColor;

  font-size: 14px;
  font-weight: 600;
  line-height: 38px;

  > span {
    display: inline-block;

    vertical-align: middle;

    line-height: 20px;
  }
}

.reward-label {
  overflow: hidden;
  flex: 1;
  order: 3;

  text-align: right;
  white-space: nowrap;
  text-overflow: ellipsis;

  color: currentColor;

  font-size: 12px;
  font-weight: 600;
}

.upcoming {
  .title-label,
  .reward-label {
    color: $like-gray-4 !important;
  }
}

.mission-action-button {
  position: absolute;
}

.item-label {
  position: absolute;

  display: flex;
  align-items: center;

  color: #ff5151;

  &.new:before {
    width: 6px;
    height: 6px;
    margin: 3px 6px;

    content: " ";

    border-radius: 50%;
    background-color: currentColor;
    box-shadow: 0 0 6px 0 #FF4949;
  }

  &.upcoming {
    color: #9b9b9b;
  }
}
</style>

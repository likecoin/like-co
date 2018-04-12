<template>
  <div :class="['mission-item', state]" @click="$emit('click')">
    <div>

      <div class="mission-card">
        <div class="action-button-wrapper">
          <div class="action-button" />
        </div>

        <div class="mission-card-container">
          <h2 class="reward-label" v-html="reward" />
          <img class="mission-icon" :src="icon || LikeCoinIcon" />
          <h1 class="title-label"><span>{{ title }}</span></h1>
        </div>
      </div>

      <span v-if="isNew" class="new-label" />

    </div>
  </div>
</template>


<script>
import LikeCoinIcon from '@/assets/like-coin.svg';

export default {
  name: 'mission-item',
  props: {
    title: {
      type: String,
    },
    reward: {
      type: String,
    },
    icon: {
      type: String,
    },
    state: {
      type: String,
      default: 'active',
    },
    isNew: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      LikeCoinIcon,
    };
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.mission-item {
  width: 100%;

  > div {
    position: relative;

    display: flex;

    @media (min-width: 600px + 1px) {
      .large & {
        display: block;

        padding-bottom: 26px;
      }
    }
  }
}

.mission-card-container {
  position: relative;

  display: flex;
  align-items: center;

  @media (min-width: 600px + 1px) {
    .large & {
      display: block;

      text-align: center;
    }
  }
}

.mission-card {
  padding: 16px 4px 32px;

  border-radius: 8px;
  background-color: white;

  @mixin mission-card() {
    width: 100%;
    padding: 4px 10px 4px 40px;

    cursor: pointer;
    user-select: none;

    border-radius: 4px;
  }

  @mixin mission-card-completed() {
    transition: transform .15s ease-in,
                box-shadow .15s ease-in;

    color: white;
    background-color: $like-green-2;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);

    &:hover {
      transform: translateY(-2px);

      box-shadow: 0 4px 6px 1px rgba(0, 0, 0, 0.3);
    }

    &:active {
      transform: translateY(0);

      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.5);
    }
  }

  @mixin mission-card-claimed() {
    cursor: auto;

    color: #9B9B9B;
    background-color: #EFEFEF;
  }

  @media (max-width: 600px) {
    @include mission-card();

    .completed & {
      @include mission-card-completed();
    }

    .claimed & {
      @include mission-card-claimed();
    }
  }

  .small & {
    @include mission-card();
  }
  .small .completed & {
    @include mission-card-completed();
  }
  .small .claimed & {
    @include mission-card-claimed();
  }
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

  @media (min-width: 600px + 1px) {
    .large & {
      height: 52px;

      color: $like-dark-brown-2;

      font-size: 20px;
      line-height: 54px;

      > span {
        line-height: 26px;
      }
    }
  }
}

.reward-label {
  overflow: hidden;
  flex: 1;
  order: 3;

  text-align: right;
  white-space: nowrap;
  text-overflow: ellipsis;

  color: $like-green;

  font-size: 12px;
  font-weight: 600;

  .small & {
    color: currentColor;
  }

  @media (min-width: 600px + 1px) {
    :global(.small) {
      font-size: 12px;
    }

    .large & {
      text-align: center;

      font-size: 20px;
    }
  }

  @media (max-width: 600px) {
    .large .completed &,
    .large .claimed & {
      color: currentColor;
    }
  }
}

.mission-icon {
  display: none;

  width: 96px;
  height: 96px;
  margin-top: 16px;
  margin-bottom: 16px;

  @media (min-width: 600px + 1px) {
    .large & {
      display: inline-block;
    }
  }
}

.action-button-wrapper {
  position: absolute;
  bottom: 50%;
  left: 4px;

  transform: translateY(50%);

  @media (min-width: 600px + 1px) {
    .large & {
      bottom: 0;
      left: 50%;

      transform: translateX(-50%);
    }
  }
}

.action-button {
  position: relative;

  width: 32px;
  height: 32px;

  @media (min-width: 600px + 1px) {
    .large & {
      width: 52px;
      height: 52px;

      border-radius: 50%;
      background-color: white;
    }

    .large .active &,
    .large .completed & {
      cursor: pointer;
      transition: transform .15s ease-in,
                  box-shadow .15s ease-in;

      box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.5);

      &:hover {
        transform: translateY(-2px);

        box-shadow: 0 4px 6px 1px rgba(0, 0, 0, 0.3);
      }

      &:active {
        transform: translateY(0);

        box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.5);
      }
    }

    // Outer fill color (Border)
    .large .active & {
      background-image: linear-gradient(215deg, #D2F0F0, #F0E6B4);
    }

    .large .claimed & {
      background-color: $like-green;
    }

    // Inner fill color
    &::before {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;

      margin: 3px;

      content: " ";

      border-radius: 50%;

      .large .active & {
        background-color: white;
      }

      .large .completed & {
        background-color: $like-green-2;
      }
    }
  }

  // Icon
  &::after {
    position: relative;

    display: block;

    width: 100%;
    height: 100%;

    content: " ";

    background-repeat: no-repeat;
    background-position: center;
    background-size: 32px 32px;

    .active & {
      background-image: url('~/assets/icons/mission/active-small.svg');
    }

    .completed & {
      background-image: url('~/assets/icons/mission/completed-small.svg');
    }

    .claimed & {
      background-image: url('~/assets/icons/mission/claimed-small.svg');
    }

    @media (min-width: 600px + 1px) {
      .large .active & {
        background-image: url('~/assets/icons/mission/active.svg');
      }

      .large .completed &,
      .large .claimed & {
        background-image: url('~/assets/icons/mission/completed.svg');
      }
    }
  }
}

.new-label {
  position: absolute;

  display: flex;
  align-items: center;

  color: #ff5151;

  &:before {
    width: 6px;
    height: 6px;
    margin: 3px 6px;

    content: " ";

    border-radius: 50%;
    background-color: currentColor;
    box-shadow: 0 0 6px 0 #FF4949;
  }

  @mixin new-label-small() {
    top: 50%;
    left: -20px;

    transform: translateY(-50%);
  }

  .small & {
    @include new-label-small();
  }

  @media (min-width: 600px + 1px) {
    .large & {
      right: 0;
      bottom: 0;

      margin-right: 8px;
      margin-bottom: 4px;

      &::after {
        content: "NEW";

        font-size: 12px;
        font-weight: 600;
        line-height: 1;
      }
    }
  }

  @media (max-width: 600px) {
    @include new-label-small();
  }
}
</style>

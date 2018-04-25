<template>
  <div :class="['mission-state-icon', layout, state]">
    <loading-indicator
      v-if="state === 'pending'"
      :layout="layout" />
  </div>
</template>


<script>
import LoadingIndicator from './LoadingIndicator';

export default {
  name: 'mission-state-icon',
  components: {
    LoadingIndicator,
  },
  props: {
    layout: {
      type: String,
      validator(value) {
        return ['small', 'large', 'fluid'].indexOf(value) !== -1;
      },
      default: 'fluid',
    },
    state: {
      type: String,
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

@mixin large-mission-state-icon {
  width: 52px;
  height: 52px;

  border-radius: 50%;
  background-color: white;

  &::before {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    margin: 3px;

    content: " ";

    border-radius: 50%;
  }

  &.active,
  &.completed,
  &.pending {
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

  &.active,
  &.pending {
    background-image: linear-gradient(215deg, #D2F0F0, #F0E6B4);

    &::before {
      background-color: white;
    }
  }

  &.active {
    &::after {
      background-image: url('~/assets/mission/misc/active.svg');
    }
  }

  &.completed,
  &.claimed {
    &::after {
      background-image: url('~/assets/mission/misc/completed.svg');
    }
  }

  &.completed {
    &::before {
      background-color: $like-green-2;
    }
  }

  &.claimed {
    background-color: $like-green;
  }

  &.pending {
    background-image: linear-gradient(215deg, #D2F0F0, #F0E6B4);

    &::after {
      height: 0;
    }
  }
}

@mixin small-mission-state-icon {
  width: 32px;
  height: 32px;

  &.active {
    &::after {
      background-image: url('~/assets/mission/misc/active-small.svg');
    }
  }

  &.completed {
    &::after {
      background-image: url('~/assets/mission/misc/completed-small.svg');
    }
  }

  &.claimed {
    &::after {
     background-image: url('~/assets/mission/misc/claimed-small.svg');
    }
  }
}

.mission-state-icon {
  position: relative;

  &::after {
    position: relative;

    display: block;

    width: 100%;
    height: 100%;

    content: " ";

    background-repeat: no-repeat;
    background-position: center;
    background-size: 32px 32px;
  }

  &.small {
    @include small-mission-state-icon();
  }

  &.large {
    @include large-mission-state-icon();
  }

  &.fluid {
    @media (min-width: 600px + 1px) {
      @include large-mission-state-icon();
    }

    @media (max-width: 600px) {
      @include small-mission-state-icon();
    }
  }
}
</style>

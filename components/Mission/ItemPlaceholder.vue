<template>
  <div :class="['mission-item-placeholder', layout]" @click="$emit('click')">
    <div>
      <div class="placeholder-card">
        <div class="animated-background">
          <div class="background-masker icon-top" />
          <div class="background-masker icon-middle" />
          <div class="background-masker icon-bottom" />

          <div class="background-masker amount-vertical" />
          <div class="background-masker label-in-between" />

          <div class="animated-background icon-placeholder" />
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'mission-item-placeholder',
  props: {
    layout: {
      type: String,
      validator(value) {
        return ['small', 'large', 'fluid'].indexOf(value) !== -1;
      },
      default: 'fluid',
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

@mixin large-mission-item-placeholder {
  .animated-background {
    height: 204px;
    margin: 0 20px;

    &.icon-placeholder {
      top: 44px;

      width: 96px;
      height: 96px;
      margin: auto;
    }

    .background-masker {
      &.icon-top {
        top: 28px;
        right: 0;
        left: 0;

        height: 16px;
      }

      &.icon-middle {
        top: 44px;

        width: 100%;
        height: 96px;
      }

      &.icon-bottom {
        top: 140px;
        right: 0;
        left: 0;

        height: 16px;
      }

      &.label-in-between {
        top: 176px;
        right: 0;
        left: 0;

        height: 8px;
      }
    }
  }

  .placeholder-card {
    padding: 16px 4px 40px;

    border-radius: 8px;
  }
}

@mixin small-mission-item-placeholder {
  .animated-background {
    height: 32px;

    &.icon-placeholder {
      top: 4px;
      bottom: 0;
      left: -36px;

      width: 24px;
      height: 24px;
      margin: auto 0;

      border-radius: 50%;
    }

    .background-masker {
      &.icon-top,
      &.icon-bottom {
        width: 100%;
      }
      &.icon-top {
        top: 0;
      }
      &.icon-bottom {
        top: 24px;
      }

      &.icon-middle {
        top: 0;
        right: 48px;

        width: 24px;
        height: 32px;
      }

      &.label-in-between {
        top: 14px;
        right: 48px;
        left: 0;

        height: 4px;
      }

      &.amount-vertical {
        top: 0;
        right: 0;

        width: 48px;
        height: 32px;

        border-top: 4px solid $like-white;
        border-bottom: 6px solid $like-white;
        background: none;
      }
    }
  }

  .placeholder-card {
    width: 100%;
    padding: 10px 10px 10px 48px;

    user-select: none;

    border-radius: 4px;
  }
}

.mission-item-placeholder {
  width: 100%;

  &.small {
    @include small-mission-item-placeholder();
  }

  &.large {
    @include large-mission-item-placeholder();
  }

  &.fluid {
    @media (min-width: 600px + 1px) {
      @include large-mission-item-placeholder();
    }

    @media (max-width: 600px) {
      @include small-mission-item-placeholder();
    }
  }
}

.animated-background {
  position: relative;

  height: 188px;

  animation-name: placeholder-shimmer;
  animation-duration: 1s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;

  background: #f6f7f8;
  background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);
  background-size: 800px 104px;

  animation-fill-mode: forwards;
}

.background-masker {
  position: absolute;

  background: $like-white;
}

.placeholder-card {
  box-sizing: border-box;

  background-color: $like-white;
}

@keyframes placeholder-shimmer {
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
}
</style>

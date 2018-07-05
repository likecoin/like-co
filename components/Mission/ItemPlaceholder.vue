<template>
  <div
    :class="['mission-item-placeholder', layout, { animated }]"
    @click="$emit('click')"
  >
    <div class="placeholder-card">
      <div class="animated-background">
        <div
          :style="style.amountLabel"
          class="background-masker amount-label left"
        />
        <div
          :style="style.amountLabel"
          class="background-masker amount-label right"
        />
        <div class="background-masker icon-top" />
        <div class="background-masker icon-middle left" />
        <div class="background-masker icon-middle right" />
        <div class="background-masker icon-bottom" />

        <div class="background-masker amount-vertical" />
        <div class="background-masker label-in-between" />
        <div
          :style="style.descriptionLabel"
          class="background-masker label-newline left"
        />
        <div
          :style="style.descriptionLabel"
          class="background-masker label-newline right"
        />
      </div>
    </div>
  </div>
</template>


<script>
function randomPercentage(min, max) {
  return `${Math.floor(Math.random() * ((max - min) + 1)) + min}%`;
}

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
    animated: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      style: {
        amountLabel: {
          width: randomPercentage(10, 20),
        },
        descriptionLabel: {
          width: randomPercentage(15, 35),
        },
      },
    };
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";
@import "~assets/mixin";

@mixin large-mission-item-placeholder {
  .placeholder-card {
    padding: 24px 4px 32px;

    border-radius: 8px;
  }

  .animated-background {

    height: $top;
    margin: 0 20px 8px;

    $top: 0;

    .background-masker {
      &.amount-label {
        top: $top;

        height: $height;

        $height: 20px; $top: $top + $height;

        &.left {
          left: 0;
        }

        &.right {
          right: 0;
        }
      }

      &.icon-top {
        top: $top;
        right: 0;
        left: 0;

        height: $height;

        $height: 24px; $top: $top + $height;
      }

      &.icon-middle {
        top: $top;

        width: calc((100% - #{$height}) / 2);
        height: $height;

        $height: 80px; $top: $top + $height;

        &.left {
          left: 0;
        }

        &.right {
          right: 0;
        }
      }

      &.icon-bottom {
        top: $top;
        right: 0;
        left: 0;

        height: $height;

        $height: 24px; $top: $top + $height;
      }

      $top: $top + 20px;

      &.label-in-between {
        top: $top;
        right: 0;
        left: 0;

        height: $height;

        $height: 4px; $top: $top + $height;
      }

      &.label-newline {
        top: $top;

        height: $height;

        $height: 20px; $top: $top + $height;

        &.left {
          left: 0;
        }

        &.right {
          right: 0;
        }
      }
    }
  }
}

@mixin small-mission-item-placeholder {
  .placeholder-card {
    padding: 10px;

    border-radius: 4px;
  }

  .animated-background {
    $height: 32px;
    height: $height;

    .background-masker {
      $icon-padding: 4px;
      $amount-percent: 28%;

      &.icon-top {
        top: 0;
      }

      &.icon-top,
      &.icon-bottom {
        left: 0;

        width: $height - $icon-padding;
        height: $icon-padding;
      }

      &.icon-bottom {
        bottom: 0;
      }

      &.icon-middle {
        top: 0;
        bottom: 0;

        &.left {
          left: 0;

          width: $icon-padding;
        }

        &.right {
          left: $height - $icon-padding;

          width: 16px;
        }
      }

      &.label-in-between {
        top: calc(50% - 1px);
        left: $height - $icon-padding;

        height: 2px;
      }

      &.label-in-between,
      &.label-newline.right {
        right: $amount-percent;
      }

      &.label-newline.right {
        top: 50%;
        bottom: 0;
      }

      &.amount-label.left {
        left: 100% - $amount-percent;
      }

      &.amount-label.left,
      &.amount-vertical {
        top: 0;
        bottom: 0;
      }

      &.amount-vertical {
        right: 0;

        width: $amount-percent;

        border-top: 8px solid $like-white;
        border-bottom: 8px solid $like-white;
        background: none;
      }
    }
  }
}

.mission-item-placeholder {
  flex-shrink: 0;

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

.placeholder-card {
  pointer-events: none;

  background-color: $like-white;
}

.animated-background {
  position: relative;

  background: #EEE;

  .animated & {
    @include background-image-sliding-animation-x(
      linear-gradient(to right, #EEE 8%, #DDD 24%, #EEE 32%)
    );
  }
}

.background-masker {
  position: absolute;

  background: $like-white;
}
</style>

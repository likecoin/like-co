<template>
  <div
    :class="[
      'like-button',
      {
        'like-button--super-like': isSuperLike,
      },
    ]"
  >
    <div>

      <div class="like-button-wrapper">
        <button
          class="like-button-knob"
          @click="onClickKnob"
        >
          <transition
            v-for="i in 12"
            :key="i"
            name="like-button__clap-effect-"
          >
            <div
              v-if="isShowClapEffect"
              class="like-button__clap-effect"
            >
              <simple-svg
                :filepath="ClapEffectIcon"
                fill="currentColor"
                stroke="transparent"
              />
            </div>
          </transition>

          <div class="like-button-knob__border" />
          <div class="like-button-knob__content">
            <simple-svg
              :filepath="LikeClapIcon"
              fill="currentColor"
              stroke="transparent"
            />
          </div>
          <transition name="like-button__like-count-bubble-">
            <div
              v-if="isJustClickedKnob"
              :key="likeCount"
              class="like-button__like-count-bubble"
            >+{{ likeCount }}</div>
          </transition>
        </button>

        <div
          class="like-button-stats"
          @click="$emit('click-stats')"
        >
          <simple-svg
            :filepath="LikeTextIcon"
            class="like-button-stats__text-logo"
            fill="currentColor"
            stroke="transparent"
          />
          <span
            v-if="totalLike > 0"
            class="like-button-stats__total-like"
          >{{ formattedTotalLike }}</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import ClapEffectIcon from '~/assets/like-button/clap-effect.svg';
import LikeClapIcon from '~/assets/like-button/like-clap.svg';
import LikeTextIcon from '~/assets/like-button/like-text.svg';

export default {
  name: 'like-button',
  props: {
    likeCount: {
      type: Number,
      default: 0,
    },
    totalLike: {
      type: Number,
      default: 0,
    },
    isSuperLike: {
      type: [Boolean, String],
      default: false,
    },
  },
  data() {
    return {
      ClapEffectIcon,
      LikeClapIcon,
      LikeTextIcon,

      isJustClickedKnob: false,
      isShowClapEffect: false,
    };
  },
  computed: {
    formattedTotalLike() {
      let { totalLike } = this;
      let suffix = '';
      if (totalLike > 1000) {
        totalLike = Math.floor(totalLike / 1000);
        suffix = 'k';
      }
      return `${totalLike.toLocaleString('en')}${suffix}`;
    },
  },
  methods: {
    onClickKnob(e) {
      this.isJustClickedKnob = true;
      setTimeout(() => {
        this.isJustClickedKnob = false;
      }, 500);

      this.isShowClapEffect = true;
      this.$nextTick(() => {
        this.isShowClapEffect = false;
      });

      this.$emit('like', e);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/embed";

$like-button-size: 80;
$like-button-ring-width: 3;

$like-button-like-count-size: 24;

.like-button {
  &-wrapper {
    position: relative;

    width: normalized($like-button-size);
    height: normalized($like-button-size);

    margin: normalized(10);
    margin-right: normalized(90);
  }

  &-knob {
    box-sizing: border-box;
    width: inherit;
    height: inherit;
    padding: normalized($like-button-ring-width);

    cursor: pointer;

    transition-timing-function: ease;
    transition-duration: 0.2s;
    transition-property: color, transform;

    color: $like-gray-5;
    border: none;
    background: none;

    .like-button-wrapper:hover & {
      color: $like-green;

      &:active {
        transform: scale(0.95);

        color: white;
      }
    }
    .like-button--super-like & {
      color: white !important;
    }

    // Border
    &__border {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;

      content: '';
      transition-timing-function: ease;
      transition-duration: 0.2s;
      transition-property: background, box-shadow, transform;

      border-radius: 50%;
      background: currentColor;

      box-shadow: 0 normalized(2) normalized(6) 0 rgba(0, 0, 0, 0.25);

      .like-button-knob:hover & {
        box-shadow: normalized(2) normalized(4) normalized(6) 0 rgba(0, 0, 0, 0.25);
      }
      .like-button-knob:hover &,
      .like-button--super-like & {
        transform: scale(1.05);
      }
      .like-button-knob:active &,
      .like-button--super-like & {
        background: linear-gradient(47deg, #d2f0f0, #f0e6b4);
        box-shadow: 0 normalized(2) normalized(6) 0 rgba(0, 0, 0, 0.25);
      }
    }

    &__content {
      position: relative;

      width: normalized($like-button-size - $like-button-ring-width * 2);
      height: normalized($like-button-size - $like-button-ring-width * 2);
      padding: normalized(12);

      transition: background-color 0.2s ease;

      border-radius: 50%;
      background-color: white;

      .like-button-knob:active &,
      .like-button--super-like & {
        background-color: $like-green;
      }
    }
  }

  &__like-count-bubble {
    position: absolute;
    bottom: 100%;
    left: normalized(($like-button-size - $like-button-like-count-size) / 2);

    width: normalized($like-button-like-count-size);
    height: normalized($like-button-like-count-size);
    margin-bottom: normalized(16);
    padding: normalized(4);

    transition-property: opacity, transform;

    color: white;
    border-radius: 50%;
    background-color: $like-green;

    font-size: normalized(12);
    line-height: normalized(16);

    &-- {
      &enter-active {
        transition-timing-function: ease-out;
        transition-duration: 0.15s;
      }
      &leave-active {
        transition-timing-function: ease-in;
        transition-duration: 0.35s;
      }
      &enter {
        transform: scale(0) translateY(normalized(72));
      }
      &leave-to {
        transform: translateY(normalized(-24));
      }
      &enter,
      &leave-to {
        opacity: 0;
      }
    }
  }

  &__clap-effect {
    position: absolute;
    top: calc(50% - #{normalized(8)});
    left: calc(50% - #{normalized(5)});

    width: normalized(10);
    height: normalized(16);

    color: $like-green;

    @for $i from 1 through 12 {
      &:nth-child(#{$i}) {
        transform: rotateZ(-15deg + 30deg * $i);
      }
    }

    &-- {
      &leave-active {
        transition-delay: 0.2s;
        transition-timing-function: linear;
        transition-duration: 0.1s;
        transition-property: opacity;
      }
      &leave-to {
        opacity: 0;
      }
    }

    > div {
      @keyframes clap-effect-triangle {
        0% {  transform: translateY(normalized(-32)); }
        100% { transform: translateY(normalized(-72)); }
      }

      animation-name: clap-effect-triangle;
      animation-duration: 0.3s;
      animation-timing-function: linear;
    }
  }

  &-stats {
    position: absolute;
    top: calc(50% - #{normalized(13)});
    left: normalized($like-button-size);

    margin-left: normalized(20);

    cursor: pointer;

    &:active {
      transform: translateY(normalized(1));
    }

    &__text-logo {
      width: normalized(58);
      height: normalized(24);

      transition: color 0.2s ease;

      color: $like-gray-5;

      .like-button-wrapper:hover & {
        color: $like-green;
      }
    }

    &__total-like {
      display: inline-block;

      margin-top: normalized(4);

      color: $like-green;

      font-size: normalized(16);
      font-weight: 600;
    }
  }
}
</style>

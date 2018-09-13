<template>
  <div
    :class="[
      'like-button',
      {
        'like-button--liked': likeCount > 0,
        'like-button--super-like': isLocalSuperLike,
        'like-button--pressed': isPressingKnob,
        'like-button--long-pressed': isLongPressingKnob,
      },
    ]"
  >
    <div>

      <div class="like-button-wrapper">

        <no-ssr>
          <div
            :class="[
              'like-button-slide-track',
              {
                'like-button-slide-track--disabled': !isKnobMovable,
              },
            ]"
            @click="onClickTrack"
          />
        </no-ssr>

        <div
          ref="knobWrapper"
          class="like-button-knob-wrapper"
        >
          <button
            ref="button"
            :style="{ marginLeft: `${knobProgress * 100}%` }"
            class="like-button-knob"
            @mousedown="onPressKnob"
            @mouseup="onPressedKnob"
            @mouseleave="onLeaveKnob"
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
          </button>
        </div>

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
import _debounce from 'lodash.debounce';

import { checkIsMobileClient } from '~/util/client';

import ClapEffectIcon from '~/assets/like-button/clap-effect.svg';
import LikeClapIcon from '~/assets/like-button/like-clap.svg';
import LikeTextIcon from '~/assets/like-button/like-text.svg';


export default {
  name: 'sample-like-button',
  props: {
    likeCount: {
      type: Number,
      default: 0,
    },
    totalLike: {
      type: Number,
      default: 0,
    },
    isToggled: {
      type: [Boolean, String],
      default: false,
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

      isShowClapEffect: false,
      isPressingKnob: false,
      isLongPressingKnob: false,
      hasMovedKnob: false,
      lastClientX: 0,
      clientX: 0,
      clampedClientX: 0,
      knobProgress: this.isToggled ? 1 : 0,

      longPressTimer: null,
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
    isLocalSuperLike() {
      return this.knobProgress === 1;
    },
    isKnobMovable() {
      return !checkIsMobileClient();
    },
  },
  watch: {
    isToggled(value) {
      this.knobProgress = value && this.isKnobMovable ? 1 : 0;
    },
    knobProgress(value) {
      if (value > 0 && value < 1) {
        this.debouncedSnapKnobProgress();
      }
    },
  },
  mounted() {
    if (this.isKnobMovable) {
      document.addEventListener('mousemove', this.onMovingKnob);
      document.addEventListener('mouseleave', this.onReleaseKnob);
      document.addEventListener('mouseup', this.onReleaseKnob);
    }
  },
  beforeDestroy() {
    if (this.isKnobMovable) {
      document.removeEventListener('mousemove', this.onMovingKnob);
      document.removeEventListener('mouseleave', this.onReleaseKnob);
      document.removeEventListener('mouseup', this.onReleaseKnob);
    }
    if (this.longPressTimer) {
      clearInterval(this.longPressTimer);
      this.longPressTimer = null;
    }
  },
  methods: {
    snapKnobProgress() {
      if (!this.isPressingKnob) {
        this.knobProgress = this.isKnobMovable && this.knobProgress > 0.5 ? 1 : 0;
      }
    },
    debouncedSnapKnobProgress: _debounce(
      // eslint-disable-next-line func-names
      function () { this.snapKnobProgress(); },
      50,
    ),
    setClientX(e) {
      this.clientX = e.targetTouches ? e.targetTouches[0].clientX : e.clientX;
    },
    clearLongPress() {
      this.isLongPressingKnob = false;
      if (this.longPressTimer) {
        clearInterval(this.longPressTimer);
        this.longPressTimer = null;
      }
    },
    updateKnobProgressByEvent(e) {
      this.lastMoveKnobTimeStamp = e.timeStamp;

      this.setClientX(e);
      const diff = this.clientX - this.lastClientX;
      this.lastClientX = this.clientX;

      const { clientWidth: slidableWidth } = this.$refs.knobWrapper;
      this.clampedClientX = Math.min(Math.max(this.clampedClientX + diff, 0), slidableWidth);
      this.knobProgress = this.clampedClientX / slidableWidth;

      if (!this.hasMovedKnob && Math.abs(diff) > 0) {
        this.hasMovedKnob = true;
      }
    },
    onPressedKnob(e) {
      if (this.hasMovedKnob) return;

      if (this.knobProgress === 1) {
        this.$emit('super-like', e, true);
      } else if (this.knobProgress === 0) {
        this.isShowClapEffect = true;
        this.$nextTick(() => {
          this.isShowClapEffect = false;
        });

        if (this.isSuperLike) {
          if (this.isKnobMovable && !this.isLongPressingKnob) {
            this.knobProgress = 1;
          }
        } else {
          this.$emit('like', e);
        }
      }
    },
    onMovingKnob(e) {
      if (!this.isPressingKnob) return;

      if (requestAnimationFrame) {
        requestAnimationFrame(() => this.updateKnobProgressByEvent(e));
      } else if (!this.hasMovedKnob) {
        this.knobProgress = this.knobProgress > 0.5 ? 0 : 1;
        this.hasMovedKnob = true;
      }
    },
    onPressKnob(e) {
      if (!this.isKnobMovable) return;

      this.setClientX(e);
      this.lastClientX = this.clientX;
      this.isPressingKnob = true;
      this.hasMovedKnob = false;
      if (!this.isLocalSuperLike) {
        this.longPressTimer = setInterval(() => {
          this.isLongPressingKnob = true;
          this.onPressedKnob(e);
        }, 180);
      }
    },
    onReleaseKnob() {
      this.clearLongPress();

      if (!this.isPressingKnob) return;

      this.isPressingKnob = false;
      this.snapKnobProgress();
      this.$emit('toggle', this.isLocalSuperLike);
      this.hasMovedKnob = false;
    },
    onLeaveKnob() {
      this.clearLongPress();
    },
    onClickTrack() {
      this.knobProgress = this.knobProgress > 0.5 ? 0 : 1;
      this.$emit('toggle', this.isLocalSuperLike);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/embed";

$like-button-slide-track-width: 108;
$like-button-slide-track-height: 16;
$like-button-size: 80;
$like-button-ring-width: 3;

$like-button-like-count-size: 24;

@function size($value: $full-width) {
  @return $value / $full-width * 500px;
}

.like-button {
  &-wrapper {
    position: relative;

    display: flex;
    align-items: flex-start;

    width: size($like-button-size);
    height: size($like-button-size);

    margin-right: size(90);
  }

  &-slide-track {
    position: relative;

    flex-shrink: 0;

    width: size($like-button-slide-track-width);
    padding: size(($like-button-size - $like-button-slide-track-height) / 2) size(8);

    &:active {
      transform: scale(0.98);
    }

    &--disabled {
      width: size($like-button-size + 8);

      &::before {
        display: none;
      }
    }

    &::before {
      display: block;

      height: size($like-button-slide-track-height);

      content: '';
      cursor: pointer;

      border-radius: size($like-button-slide-track-height);
      background-color: $gray-9b;

      .like-button--liked:not(.like-button--super-like) & {
        @keyframes sliding-animation {
          0% { background-position-x: 100%; }
          100% { background-position-x: -100%; }
        }

        animation: {
          name: sliding-animation;
          duration: 0.8s;
          timing-function: linear;
          iteration-count: infinite;
          fill-mode: forwards;
        };

        background: {
          image: linear-gradient(to right, #E6E6E6, $like-green);
          size: 200%;
        }
      }
    }
  }

  &-knob {
    &-wrapper {
      position: absolute;
      top: 0;
      left: 0;

      width: size(28); // Range for sliding

      pointer-events: none;
    }

    position: relative;

    display: block;

    box-sizing: border-box;
    width: size($like-button-size);
    height: size($like-button-size);
    padding: size($like-button-ring-width);

    cursor: pointer;
    user-select: none;
    -webkit-user-drag: none;

    transition-timing-function: ease;
    transition-duration: 0.2s;
    transition-property: margin-left, color, transform;

    pointer-events: all;

    color: $like-gray-5;
    border: none;
    background: none;

    .like-button-wrapper:hover & {
      color: $like-green;
    }
    .like-button--pressed &,
    .like-button--liked &,
    .like-button--super-like & {
      color: white !important;
    }
    .like-button--pressed & {
      transform: scale(0.95);
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

      box-shadow: 0 size(2) size(6) 0 rgba(0, 0, 0, 0.25);

      .like-button-knob:hover & {
        box-shadow: size(2) size(4) size(6) 0 rgba(0, 0, 0, 0.25);
      }
      .like-button--liked &,
      .like-button--super-like & {
        transform: scale(1.02);
      }
      .like-button-knob:hover &,
      .like-button--pressed & {
        transform: scale(1.05);
      }
      .like-button--pressed &,
      .like-button--liked &,
      .like-button--super-like & {
        background: linear-gradient(47deg, #d2f0f0, #f0e6b4);
        box-shadow: 0 size(2) size(6) 0 rgba(0, 0, 0, 0.25);
      }
    }

    &__content {
      position: relative;

      width: size($like-button-size - $like-button-ring-width * 2);
      height: size($like-button-size - $like-button-ring-width * 2);
      padding: size(12);

      transition: background-color 0.2s ease;

      border-radius: 50%;
      background-color: white;

      .like-button--pressed &,
      .like-button--liked &,
      .like-button--super-like & {
        background-color: $like-green;
      }
    }
  }

  &__clap-effect {
    position: absolute;
    top: calc(50% - #{size(8)});
    left: calc(50% - #{size(5)});

    width: size(10);
    height: size(16);

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
        0% {  transform: translateY(size(-32)); }
        100% { transform: translateY(size(-72)); }
      }

      animation-name: clap-effect-triangle;
      animation-duration: 0.3s;
      animation-timing-function: linear;
    }
  }

  &-stats {
    margin-top: calc(50% - #{size(13)});
    margin-left: size(12);

    cursor: pointer;

    &:active {
      transform: translateY(size(1));
    }

    &__text-logo {
      width: size(58);
      height: size(24);

      transition: color 0.2s ease;

      color: $like-gray-5;

      .like-button-wrapper:hover & {
        color: $like-green;
      }
    }

    &__total-like {
      display: block;

      margin-top: size(4);

      color: $like-green;

      font-size: size(16);
      font-weight: 600;
    }
  }
}
</style>

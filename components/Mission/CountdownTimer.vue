<template>
  <div :class="['mission-countdown-timer', layout]">
    <ul>
      <li v-if="dayLabel">
        {{ dayLabel }}
      </li>
      <li v-if="hourLabel">
        {{ hourLabel }}
      </li>
      <li v-if="minuteLabel">
        {{ minuteLabel }}
      </li>
      <li v-if="secondLabel">
        {{ secondLabel }}
      </li>
    </ul>
  </div>
</template>


<script>
export default {
  name: 'mission-countdown-timer',
  props: {
    date: {
      type: Number,
      default: undefined,
    },
    layout: {
      type: String,
      validator(value) {
        return ['small', 'large', 'fluid'].indexOf(value) !== -1;
      },
      default: 'fluid',
    },
    isFull: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      timer: undefined,
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
    };
  },
  computed: {
    dayLabel() {
      return this.day > 0 ? `${this.day}d` : null;
    },
    hourLabel() {
      const suffix = this.dayLabel && !this.isFull ? 'h' : '';
      return (this.hour > 0 || this.dayLabel)
        ? `${String(this.hour).padStart(2, '0')}${suffix}`
        : this.hour;
    },
    minuteLabel() {
      return this.shouldShowMinuteSecond ? String(this.minute).padStart(2, '0') : null;
    },
    secondLabel() {
      return this.shouldShowMinuteSecond ? String(this.second).padStart(2, '0') : null;
    },
    shouldShowMinuteSecond() {
      return this.isFull || !this.dayLabel;
    },
  },
  created() {
    this.countdown();
  },
  beforeMount() {
    this.timer = setInterval(this.countdown, 1000);
  },
  beforeDestroy() {
    this.clearTimer();
  },
  methods: {
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = undefined;
      }
      if (this.delayTimer) {
        clearTimeout(this.delayTimer);
        this.delayTimer = undefined;
      }
    },
    countdown() {
      if (this.date) {
        const difference = new Date(Math.abs(this.date - Date.now()));
        this.day = Math.floor(difference.getTime() / 86400000);
        this.hour = difference.getUTCHours();
        this.minute = difference.getUTCMinutes();
        this.second = difference.getUTCSeconds();

        if (this.day === 0 && this.hour === 0 && this.minute === 0 && this.second === 0) {
          this.delayTimer = setTimeout(() => {
            this.$emit('finish');
            this.clearTimer();
          }, 1000);
        }
      }
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.mission-countdown-timer {
  color: $like-dark-brown-2;

  ul {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;

    list-style: none;

    li {
      &:not(:last-child):after {
        padding-right: 4px;

        content: ':';
      }
    }
  }

  &:not(.small) {
    font-size: 30px;
    ul {
      li {
        &:not(:last-child):after {
          margin-left: -3px;
        }
      }
    }
  }

  &.small {
    font-weight: 600;
  }
}
</style>

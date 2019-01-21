<template>
  <div class="lc-countdown-timer">
    <ul>
      <li>
        <span class="date-value">{{ day }}</span>
        <span class="date-unit">{{ $tc('Date.day', day) }}</span>
      </li>
      <li>
        <span class="date-value">{{ hour }}</span>
        <span class="date-unit">{{ $tc('Date.hour', hour) }}</span>
      </li>
      <li>
        <span class="date-value">{{ minute }}</span>
        <span class="date-unit">{{ $tc('Date.minute', minute) }}</span>
      </li>
      <li>
        <span class="date-value">{{ second }}</span>
        <span class="date-unit">{{ $tc('Date.second', second) }}</span>
      </li>
    </ul>
  </div>
</template>


<script>
export default {
  name: 'countdown-timer',
  props: {
    date: {
      type: Date,
      default: undefined,
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
  created() {
    this.countdown();
  },
  beforeMount() {
    this.timer = setInterval(this.countdown, 1000);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  },
  methods: {
    countdown() {
      if (this.date) {
        const difference = new Date(Math.abs(this.date - Date.now()));
        this.day = Math.floor(difference.getTime() / 86400000);
        this.hour = difference.getUTCHours();
        this.minute = difference.getUTCMinutes();
        this.second = difference.getUTCSeconds();
      }
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

$separator-size: 0.2em;

.lc-countdown-timer {
  font-size: 56px;
  line-height: 1.35em;

  @media (max-width: 600px) {
    font-size: 48px;
  }
  @media (max-width: 375px) {
    font-size: 32px;
  }

  > ul {
    display: flex;

    margin: 0;
    padding: 0;

    list-style: none;

    > li {
      position: relative;

      flex: 1;

      &:not(:last-child)::after {
        position: absolute;
        top: 50%;
        left: 100%;

        width: $separator-size;
        height: $separator-size;

        content: "";

        border-radius: 50%;
        background-color: $like-green;
      }

      > span {
        display: block;

        text-align: center;

        &.date-value {
          color: $like-gray-5;

          font-size: 1em;
          font-weight: 300;
        }

        &.date-unit {
          color: $like-dark-brown-2;

          font-size: 14px;
          line-height: 20px;

          @media (max-width: 600px) {
            font-size: 12px;
            line-height: 16px;
          }
        }
      }
    }
  }
}
</style>

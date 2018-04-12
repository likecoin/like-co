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
    date: Object,
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
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

$separator-size: 8px;

.lc-countdown-timer {
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
        margin-top: #{$separator-size / 2 * -1};
        margin-left: #{$separator-size / 2 * -1};

        content: " ";

        border-radius: 50%;
        background-color: $like-green;

        @media (max-width: 600px) {
          width: #{floor($separator-size * 2 / 3)};
          height: #{floor($separator-size * 2 / 3)};
          margin-top: #{$separator-size / 3 * -1};
          margin-left: #{$separator-size / 3 * -1};
        }
        @media (max-width: 375px) {
          width: #{$separator-size / 2};
          height: #{$separator-size / 2};
          margin-top: #{$separator-size / 4 * -1};
          margin-left: #{$separator-size / 4 * -1};
        }
      }

      > span {
        display: block;

        text-align: center;

        &.date-value {
          color: $like-gray-5;

          font-size: 56px;
          font-weight: 300;
          line-height: 76px;

          @media (max-width: 600px) {
            font-size: 48px;
            line-height: 56px;
          }
          @media (max-width: 375px) {
            font-size: 32px;
            line-height: 42px;
          }
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

<template>
  <div class="mission-clock">
    <div class="mission-clock__quarter-dot" />
    <div class="mission-clock__quarter-dot" />
    <div class="mission-clock__quarter-dot" />
    <div class="mission-clock__quarter-dot" />
    <div class="mission-clock__hand-container">
      <div class="mission-clock__hand" />
    </div>
  </div>
</template>


<script>
export default {
  name: 'mission-clock',
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

$quarter-dot-size: 3px;
$tick-rebound: 15;
$degree-map: (
  0: 360,
  25: 270,
  50: 180,
  75: 90,
);

@keyframes clock-tick {
  @each $percentage, $degree in $degree-map {
    #{$percentage}% {
      transform: rotate(#{$degree}deg);
    }
    #{$percentage + 4}% {
      transform: rotate(#{$degree - 90}deg);
    }
    #{$percentage + 7}% {
      transform: rotate(#{$degree - 90 + $tick-rebound}deg);
    }
    #{$percentage + 10}% {
      transform: rotate(#{$degree - 90}deg);
    }
    #{$percentage + 25}% {
      transform: rotate(#{$degree - 90}deg);
    }
  }
}

.mission-clock {
  position: relative;

  width: 100%;
  height: 100%;

  &__quarter-dot {
    position: absolute;

    width: $quarter-dot-size;
    height: $quarter-dot-size;

    border-radius: 50%;
    background-color: $like-green;

    &:nth-child(1) {
      top: 0;
      left: calc(50% - #{$quarter-dot-size / 2});
    }

    &:nth-child(2) {
      top: calc(50% - #{$quarter-dot-size / 2});
      right: 0;
    }

    &:nth-child(3) {
      bottom: 0;
      left: calc(50% - #{$quarter-dot-size / 2});
    }

    &:nth-child(4) {
      top: calc(50% - #{$quarter-dot-size / 2});
      left: 0;
    }
  }

  &__hand {
    position: absolute;
    left: calc(50% - 1.5px);

    width: 3px;
    height: calc(50% - 3px);
    margin-top: 2px;

    background-color: $like-green;

    &-container {
      width: 100%;
      height: 100%;

      animation: clock-tick 4s linear infinite;
    }

    &:before,
    &:after {
      position: absolute;

      width: 3px;
      height: 3px;

      content: " ";

      border-radius: 50%;
      background-color: $like-green;
    }

    &:before {
      top: -2px;
    }
    &:after {
      bottom: -2px;
    }
  }
}
</style>

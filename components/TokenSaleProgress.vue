<template>
  <div class="lc-tokensale-progress">
    <div class="lc-tokensale-progress-legend">
      <span class="progress" :style="{ width: `${progress / total * 100}%` }"/>
      <ul>
        <li class="reached"/>
        <li
          v-for="data in points"
          :key="data.value"
          :class="{ reached: progress / total > data.value / points.length }">
          <div>
            <span class="point-legend">
              {{ data.legend }}
            </span>
          </div>
        </li>
      </ul>
    </div>

    <div class="lc-tokensale-progress-bar">
      <span class="progress" :style="{ width: `${progress / total * 100}%` }"/>
      <ul>
        <li class="reached"/>
        <li
          v-for="data in points"
          :key="data.value"
          :class="{ reached: progress / total > data.value / points.length }">
          <div>
            <span class="point-value">
              {{ data.value * 100 }}%
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>


<script>
export default {
  name: 'tokensale-progress',
  props: [
    'progress',
    'total',
    'points',
  ],
};
</script>


<style lang="scss" scoped>
$separator-size: 10px;

.lc-tokensale-progress {
  .lc-tokensale-progress-bar {
    position: relative;
    padding: 0 #{$separator-size / 2 + 4px};
    background-color: #d8d8d8;
    border-radius: 8px;

    .progress {
      border-radius: 8px;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      background-image: linear-gradient(to left, #d2f0f0, #f0e6b4);
    }

    ul > li::after {
      position: absolute;
      top: 50%;
      left: 100%;

      width: $separator-size;
      height: $separator-size;
      margin-top: #{$separator-size / 2 * -1};
      margin-left: #{$separator-size / 2 * -1};

      content: " ";

      border-radius: 50%;
      background-color: #737373;
    }
  }

  .lc-tokensale-progress-legend {
    padding: 0 #{$separator-size / 2 + 4px};
    margin-bottom: 4px;

    @media (max-width: 600px) {
      display: none;
    }
  }

  ul {
    display: flex;

    margin: 0;
    padding: 0;

    list-style: none;

    > li {
      position: relative;

      flex: 1;

      &:first-child {
        flex: 0;
      }

      > div {
        > span {
          display: block;

          &.point-value {
            font-weight: 600;
            font-size: 10px;
            margin-right: 8px;
            line-height: 16px;
          }

          &.point-legend {
            font-weight: 600;
            margin-right: 10px;
            margin-left: -10px;
          }

          &.point-value,
          &.point-legend {
            color: #462405;
            text-align: right;
          }
        }
      }

      &.reached {
        &::after {
          background-color: #28646e;
        }

        .point-value,
        .point-legend, {
          color: #28646e;
        }
      }
    }
  }
}
</style>

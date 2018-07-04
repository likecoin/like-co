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
import { FINAL_TOKENSALE_ETH_VALUE } from '@/constant';

export default {
  name: 'tokensale-progress',
  props: {
    progress: {
      type: String,
      default: FINAL_TOKENSALE_ETH_VALUE.toFixed(2),
    },
    total: {
      type: String,
      default: '12600',
    },
  },
  data() {
    return {
      points: [
        {
          value: 1,
          legend: '4,200 ETH (Soft Cap)',
        },
        {
          value: 2,
        },
        {
          value: 3,
          legend: '12,600 ETH (Hard Cap)',
        },
      ],
    };
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

$separator-size: 10px;

.lc-tokensale-progress {
  .lc-tokensale-progress-bar {
    position: relative;

    padding: 0 #{$separator-size / 2 + 4px};
    border-radius: 8px;

    background-color: $like-gray-3;

    .progress {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;

      width: 0;

      transition: width .4s ease-in-out;

      border-radius: 8px;
      background-image: linear-gradient(to left, #62317a, #28646e 10%, #ffdc89);
      will-change: width;
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

      border: solid 1px $like-white;
      border-radius: 50%;
      background-color: transparent;
    }
  }

  .lc-tokensale-progress-legend {
    margin-bottom: 4px;
    padding: 0 #{$separator-size / 2 + 4px};

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

            margin-right: 8px;
            font-size: 10px;
            font-weight: 600;

            line-height: 16px;
          }

          &.point-legend {

            margin-right: 10px;
            margin-left: -10px;
            font-weight: 600;
          }

          &.point-value,
          &.point-legend {

            text-align: right;
            color: #462405;
          }
        }
      }

      &.reached {
        &::after {
          background-color: #28646e;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
        }

        .point-value {
          color: white;

          font-weight: bold;
        }

        .point-legend, {
          color: #28646e;
        }
      }
    }
  }
}
</style>

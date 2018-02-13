<template>
  <section class="lc-container-1 lc-distribution">
    <div class="lc-container-2">
      <block-section
        :title="$t('Home.TokenDistribution.title')">
        <div class="token-distribution-wrapper">
          <div class="data">
            <div class="year-btn-container">
              <div
                :class="`year-btn${isYear0 ? ' active' : ''}`"
                @click="clickYear0Button(true)">
                <h1>2018</h1>
                <hr />
                <span>Year 0</span>
              </div>
              <div
                :class="`year-btn${!isYear0 ? ' active' : ''}`"
                @click="clickYear0Button(false)">
                <h1>2028+</h1>
                <hr />
                <span>Year 10+</span>
              </div>
            </div>
            <div>{{ $t('Home.TokenDistribution.content') }}</div>
          </div>
          <pie-chart
            class="chart"
            :data="data[isYear0]"
            :options="{
              legend: {
                display: true,
                position: 'top',
              },
              tooltips: {
                enabled: false,
              },
            }"
          />
        </div>
      </block-section/>
    </div>
  </section>
</template>

<script>
import PieChart from '~/components/home/PieChart';
import BlockSection from '~/components/BlockSection';
import tokenDistributionChart from '~/assets/home/token-distribution.svg';


const dataYear0 = {
  labels: ['25% Ecosystem Development', '75% Token Sale'],
  datasets: [
    {
      label: 'Data One',
      backgroundColor: ['#D2F0F0', '#F0E6B4'],
      hoverBackgroundColor: ['#D2F0F0', '#F0E6B4'],
      data: [25, 75],
      rotation: 0.2,
    },
  ],
};

const dataYear10 = {
  labels: ['50% Creators Pool', '30% Token Sale', '10% Ecosystem Development', '10% Team'],
  datasets: [
    {
      label: 'Data One',
      // backgroundColor: ['#D2F0F0', '#F0E6B4'],
      // hoverBackgroundColor: ['#D2F0F0', '#F0E6B4'],
      data: [50, 30, 10, 10],
      rotation: 0.2,
    },
  ],
};

export default {
  name: 'token-distribution',
  components: {
    BlockSection,
    PieChart,
  },
  data() {
    return {
      tokenDistributionChart,
      isYear0: true,
      data: {
        true: dataYear0,
        false: dataYear10,
      },
    };
  },
  methods: {
    clickYear0Button(isYear0) {
      this.isYear0 = isYear0;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/index";

.lc-distribution {
  margin-top: 104px;

  .token-distribution-wrapper {
    display: flex;
    flex-direction: row;

    .data {
      .year-btn-container {
        display: inline-flex;
        flex-direction: row;
        background-color: #e6e6e6;
        border-radius: 6px;
        margin-bottom: 24px;

        .year-btn {
          width: 204px;
          padding: 12px 0;
          border-radius: 6px;
          text-align: center;
          cursor: pointer;
          > * {
            color: #9b9b9b;
            transition: all .3s ease-in-out;
          }
          hr {
            border: 1px solid #9b9b9b;
            margin: 6px 74px 0;
          }

          span {
            font-size: 12px;
            line-height: 1;
          }

          transition: all .3s ease-in-out;

          &.active,
          &:hover {
          	background-image: linear-gradient(244deg, #d2f0f0, #f0e6b4);
          	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
            > * {
              color: $like-green;
            }

            hr {
              border-color: $like-green;
            }
          }
        }

        + div {
          margin: 8px;
        }
      }

    }
  }
}


@media (max-width: 768px) {
  body .lc-distribution .token-distribution-wrapper {
    flex-direction: column;

    .data {
      order: 1;

      text-align: center;
    }

    .chart {
      order: 0;
    }
  }
}
</style>

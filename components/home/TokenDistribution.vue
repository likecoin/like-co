<template>
  <section class="lc-container-1 lc-distribution">
    <div class="lc-container-2">
      <div class="block-section">

        <!-- Section title -->
        <div class="lc-container-3">
          <div class="lc-container-4">
            <div class="section-title">
              {{ $t('Home.TokenDistribution.title') }}
            </div>
          </div>
        </div>

        <!-- Mobile version begin -->
        <!-- <div class="lc-container-3 md-xsmall-show">
          <div class="lc-container-4">
            <div class="section-content">
              {{ $t('Home.TokenDistribution.content') }}
            </div>
          </div>
        </div> -->
        <!-- Mobile version end -->

        <!-- Desktop version begin -->
        <div class="lc-container-3 token-distribution-wrapper">
          <div class="lc-container-4">
            <div class="section-content">

              <div class="data">

                <div :class="`year-btn-container ${isYear0 ? 'left' : 'right'}`">

                  <div
                    :class="`year-btn${isYear0 ? ' active' : ''}`"
                    @mouseenter="clickYear0Button(true)"
                    @click="clickYear0Button(true)">
                    <h1>2018</h1>
                    <hr />
                    <span>{{ $t('Home.TokenDistribution.yearButton.year0') }}</span>
                  </div>

                  <div
                    :class="`year-btn${!isYear0 ? ' active' : ''}`"
                    @mouseenter="clickYear0Button(false)"
                    @click="clickYear0Button(false)">
                    <h1>2028+</h1>
                    <hr />
                    <span>{{ $t('Home.TokenDistribution.yearButton.year10') }}</span>
                  </div>

                </div>

                <!-- <div class="md-xsmall-hide">
                  {{ $t('Home.TokenDistribution.content') }}
                </div> -->
              </div>

              <div class="chart">
                <img :src="chartUrl(`${$t('Home.TokenDistribution.pieChartLanguage')}-${isYear0 ? '2018' : '2028'}.svg`)">
              </div>

            </div>
          </div>
        </div>
        <!-- Desktop verison end -->

      </div>
    </div>
  </section>
</template>

<script>
import BlockSection from '~/components/BlockSection';


const images = require.context('../../assets/home/token-distribution');
const chartUrl = path => images(`./${path}`);

export default {
  name: 'token-distribution',
  components: {
    BlockSection,
  },
  data() {
    return {
      isYear0: true,
    };
  },
  methods: {
    chartUrl,
    clickYear0Button(isYear0) {
      this.isYear0 = isYear0;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/index";

.lc-distribution {
  @media (min-width: 600px) {
    margin-top: 88px;
  }

  .token-distribution-wrapper {
    position: relative;

    @media (max-width: 600px) {
      &::before {
        position: absolute;
        top: 35%;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: white;
        content: " ";
      }
    }

    .section-content {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      @media (max-width: 768px) {
        flex-direction: column;
        padding-top: 0;
      }

      .data {
        width: 100%;
        @media (max-width: 768px) {
          order: 1;
          text-align: center;
        }
        @media (max-width: 600px) {
          margin-bottom: 32px;
        }

        .year-btn-container {
          $year-switch-border-radius: 6px;

          position: relative;
          display: inline-flex;
          flex-direction: row;
          background-color: #e6e6e6;
          border-radius: $year-switch-border-radius;
          margin-bottom: 24px;

          max-width: 408px;
          width: 100%;

          // Underlay
          &::before {
            position: absolute;

            top: 0;
            left: 0;
            bottom: 0;

            width: 50%;

            background-image: linear-gradient(244deg, #d2f0f0, #f0e6b4);
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
            border-radius: $year-switch-border-radius;

            content: " ";

            transition: left .4s ease-in-out;
          }
          &.right::before {
            left: 50%;
          }

          .year-btn {
            position: relative;
            width: 50%;
            padding: 12px 0;
            border-radius: 6px;
            text-align: center;
            cursor: pointer;
            transition: all .3s ease-in-out;

            @media (max-width: 768px) {
              padding: 10px 0 4px;
            }

            > * {
              color: #9b9b9b;
              transition: all .2s ease-out;
            }

            h1 {
              @media (max-width: 768px) {
                line-height: 30px;
                font-size: 22px;
                font-weight: 500;
              }
            }

            hr {
              border: 1px solid #9b9b9b;
              margin: 6px auto;
              max-width: 56px;
              width: 100%;

              @media (max-width: 768px) {
                max-width: 32px;
              }
            }

            span {
              display: block;
              font-size: 12px;
              font-weight: 600;
              line-height: 1.2;

              @media (max-width: 768px) {
                margin-top: 8px;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                text-align: center;
              }
            }

            &.active,
            &:hover {
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

      .chart {
        position: relative;
        margin: -10% 0 -10% 24px;
        width: 100%;
        max-width: 376px;
        display: block;
        flex-shrink: 0;

        @media (max-width: 768px) {
          order: 0;
          margin: 0 auto;
          padding: 40px 12px 24px;
          width: 100%;
        }
        @media (min-width: 601px) and (max-width: 768px) {
          margin-top: 32px;
        }

        img {
          display: block;
          width: 100%;
        }
      }
    }
  }
}
</style>

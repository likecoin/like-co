<template>
  <section class="lc-container-0 lc-distribution" id="distribution">
    <div class="lc-container-1">

      <!-- Section title -->
      <div class="lc-container-header">
        <div class="lc-container-2 lc-container-header-overlay">
          <div class="lc-container-3 lc-bg-gray-1 lc-mobile-hide" />
        </div>
        <div class="lc-container-2">
          <div class="lc-container-3">
            <div class="lc-container-4">
              <div class="lc-container-header-title">
                <h1 class="lc-font-size-32 lc-mobile">
                  {{ $t('Home.TokenDistribution.title') }}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- BEGIN - Section Content -->
      <div class="lc-container-2">

        <div class="lc-container-3 lc-bg-gray-1 lc-tablet-pc-hide">
          <div class="lc-container-4">
            <div class="lc-padding-top-24">
              {{ $t('Home.TokenDistribution.content') }}
            </div>
          </div>
        </div>

        <div class="lc-container-3 lc-bg-gray-1 token-distribution-wrapper">
          <div class="lc-container-4">
            <div class="token-distribution lc-padding-vertical-32">

              <div class="content">

                <div :class="['year-btn-container', isYear0 ? 'left' : 'right']">

                  <div
                    :class="['year-btn', { active: isYear0 }]"
                    @mouseenter="clickYear0Button(true)"
                    @click="clickYear0Button(true)">
                    <h1>2018</h1>
                    <hr />
                    <span>{{ $t('Home.TokenDistribution.yearButton.year0') }}</span>
                  </div>

                  <div
                    :class="['year-btn', { active: !isYear0 }]"
                    @mouseenter="clickYear0Button(false)"
                    @click="clickYear0Button(false)">
                    <h1>2028+</h1>
                    <hr />
                    <span>{{ $t('Home.TokenDistribution.yearButton.year10') }}</span>
                  </div>

                </div>

                <div class="lc-padding-top-24 lc-mobile-hide">
                  {{ $t('Home.TokenDistribution.content') }}
                </div>
              </div>

              <div class="chart">
                <img :src="chartSrc" />
              </div>

            </div>
          </div>
        </div>

      </div>
      <!-- END - Section Content -->

    </div>
  </section>
</template>


<script>
const images = require.context('~/assets/home/token-distribution', false);

export default {
  name: 'token-distribution',
  data() {
    return {
      isYear0: false,
    };
  },
  computed: {
    chartSrc() {
      return images(`./${this.$t('Home.TokenDistribution.pieChartLanguage')}-${this.isYear0 ? '2018' : '2028'}.svg`);
    },
  },
  methods: {
    clickYear0Button(isYear0) {
      this.isYear0 = isYear0;
    },
  },
  mounted() {
    this.clickYear0Button(true);
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

$year-switch-border-radius: 6px;

.lc-distribution {
  .token-distribution-wrapper {
    position: relative;

    @media (max-width: 600px) {
      &::before {
        position: absolute;
        top: 35%;
        right: 0;
        bottom: 0;
        left: 0;

        content: " ";

        background-color: white;
      }
    }

    .token-distribution {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      @media (max-width: 860px) {
        flex-direction: column;
      }

      .content {
        width: 100%;

        @media (max-width: 860px) {
          order: 1;

          margin-top: 24px;

          text-align: center;
        }

        .year-btn-container {
          position: relative;

          display: inline-flex;
          flex-direction: row;

          width: 100%;
          max-width: 408px;

          border-radius: $year-switch-border-radius;
          background-color: #e6e6e6;

          // Underlay
          &::before {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;

            width: 50%;

            content: " ";
            transition: left .4s ease-in-out;

            border-radius: $year-switch-border-radius;
            background-image: linear-gradient(244deg, #d2f0f0, #f0e6b4);
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
          }

          &.right::before {
            left: 50%;
          }

          @media (max-width: 860px) {
            margin-bottom: 24px;
          }

          .year-btn {
            position: relative;

            width: 50%;
            padding: 12px 0;

            cursor: pointer;
            transition: all .3s ease-in-out;
            text-align: center;

            border-radius: 6px;

            @media (max-width: 860px) {
              padding: 10px 0 4px;
            }

            > * {
              transition: all .2s ease-out;

              color: #9b9b9b;
            }

            h1 {
              @media (max-width: 860px) {
                font-size: 22px;
                font-weight: 500;
                line-height: 30px;
              }
            }

            hr {
              width: 100%;
              max-width: 56px;
              margin: 6px auto;

              border: 1px solid #9b9b9b;

              @media (max-width: 860px) {
                max-width: 32px;
              }
            }

            span {
              display: block;

              font-size: 12px;
              font-weight: 600;
              line-height: 1.2;

              @media (max-width: 860px) {
                position: absolute;
                top: 100%;
                right: 0;
                left: 0;

                margin-top: 8px;

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
        }
      }

      .chart {
        position: relative;

        display: block;
        flex-shrink: 0;

        width: 100%;
        max-width: 376px;
        margin: -7% 0 -7% 24px;

        @media (max-width: 860px) {
          order: 0;

          width: 100%;
          margin: 0 auto;
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

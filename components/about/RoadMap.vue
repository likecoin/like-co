<template>
  <section
    id="roadmap"
    class="lc-container-0 lc-road-map"
  >
    <div class="lc-container-1">

      <!-- Section Title -->
      <div class="lc-container-header">
        <div class="lc-container-2 lc-container-header-overlay">
          <div class="lc-container-3 lc-bg-gray-1 lc-mobile-hide" />
        </div>
        <div class="lc-container-2">
          <div class="lc-container-3">
            <div class="lc-container-4">
              <div class="lc-container-header-title">
                <h1 class="lc-font-size-32 lc-mobile">
                  {{ $t('Home.RoadMap.title') }}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- BEGIN - Section Content -->
      <div class="lc-container-2 timeline-section">

        <!-- <div class="lc-container-3 lc-bg-gray-1 lc-mobile-show">
          <div class="lc-container-4 lc-padding-vertical-32">
            <div class="content">
              {{ $t('Home.RoadMap.content') }}
            </div>
          </div>
        </div> -->

        <div class="lc-container-3 lc-bg-gray-1-tablet-pc">
          <div class="lc-container-4 lc-padding-vertical-32">

            <div class="road-map-container">

              <!-- BEGIN - Timeline -->
              <div class="timeline lc-margin-bottom-12">
                <ul>
                  <li
                    v-for="(isReached, index) in milestones"
                    :key="index"
                    :class="['milestone', { last: index === milestones.length - 1}]"
                  >

                    <div class="date">{{ $t(`Home.RoadMap.timeline[${index}].time`) }}</div>

                    <div
                      v-if="index === 0"
                      :style="progressStyle"
                      class="progress"
                    />

                    <div class="line">
                      <div :class="['dot', { active: isReached }]" />
                    </div>

                    <div class="event">{{ $t(`Home.RoadMap.timeline[${index}].title`) }}</div>

                  </li>

                </ul>
              </div>
              <!-- END - Timeline -->

              <div class="links-wrapper lc-margin-top-12">
                <a
                  :href="PURCHASE_LIKE_URL"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ $t('Dialog.transaction.button.trade') }}
                </a>
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
import { PURCHASE_LIKE_URL } from '@/constant';

const milestones = [true, true, true, true, true, true, false];

export default {
  name: 'road-map',
  data() {
    const progressPercent = milestones.filter(v => v).length / milestones.length * 100 - 10;
    return {
      milestones,
      PURCHASE_LIKE_URL,
      progressStyle: `height: ${progressPercent}%;width: ${progressPercent}%`,
    };
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

$timeline-radius: 12px;
$timeline-width: 16px;

.lc-road-map {
  .road-map-container {
    display: flex;
    flex-direction: column;
  }

  .timeline {
    > ul {
      position: relative;

      display: flex;

      margin: 0;
      padding: 0;

      list-style: none;
    }

    @media (min-width: 860px + 1px) {
      margin-right: #{-54px - $timeline-radius / 2};
    }
    @media (max-width: 600px) {
      margin-top: #{-$timeline-radius / 2};
    }

    .milestone {
      flex: 1;

      min-width: 110px;

      color: $like-dark-brown-1;

      font-size: 12px;

      > * {
        padding: 3px;
      }

      .line {
        width: 100%;
        height: $timeline-width;

        background-color: $like-gray-3;

        .dot {
          position: relative;
          z-index: 1;

          width: 10px;
          height: 10px;

          border-radius: 50%;
          background-color: $like-gray-4;

          &.active {
            background-color: $like-green;
          }
        }
      }

      @media (min-width: #{860px + 1px}) {
        .date {
          display: flex;
          align-items: flex-end;

          min-height: 48px;
        }
      }

      &:first-child {
        .line {
          border-radius: $timeline-radius 0 0 $timeline-radius;
        }
      }

      &.last {
        @media (min-width: 860px + 1px) {
          padding-right: 60px;
        }

        .line {
          border-radius: 0 $timeline-radius $timeline-radius 0;

          @media (min-width: 860px + 1px) {
            width: calc(100% + 60px);
          }
        }
      }
    }

    .progress {
      position: absolute;

      border-radius: $timeline-radius;
      background-image: linear-gradient(to left, $like-light-blue, $like-gradient-1);

      @media (min-width: #{860px + 1px}) {
        left: 0;

        height: $timeline-width !important;
      }
    }
  }

  .links-wrapper {
    display: flex;
    justify-content: center;

    > a {
      text-decoration: underline;
    }
  }

  @media (max-width: 860px) {
    .road-map-container {
      display: flex;
      flex-direction: column;

      .timeline {
        > ul {
          align-items: center;
          flex-direction: column;
        }

        .milestone {
          display: flex;
          flex-direction: row;
          justify-content: center;

          min-height: 66px;

          > div {
            padding-bottom: 24px;
          }

          .date,
          .event {
            width: 136px;
            margin-top: -4px;
          }

          .event {
            order: 0;

            padding-right: 12px;

            text-align: right;
          }

          .date {
            order: 2;

            padding-left: 12px;
          }

          .line {
            order: 1;

            width: $timeline-width;
            height: auto;
          }

          &:first-child {
            .line {
              border-radius: $timeline-radius $timeline-radius 0 0;
            }
          }
          &.last {
            .line {
              border-radius: 0 0 $timeline-radius $timeline-radius;
            }
          }
        }

        .progress {
          top: 0;

          width: $timeline-width !important;

          background-image: linear-gradient(to top, #d2f0f0, #f0e6b4);
        }
      }
    }
  }
}
</style>

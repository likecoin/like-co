<template>
  <section class="lc-container-1 lc-road-map" id="roadmap">
    <div class="lc-container-2">
      <div class="block-section road-map-container">

        <!-- Section title -->
        <div class="lc-container-3">
          <div class="lc-container-4">
            <div class="section-title">
              {{ $t('Home.RoadMap.title') }}
            </div>
          </div>
        </div>

        <div class="lc-container-3 timeline-section">
          <div class="lc-container-4">
            <div class="section-content">
              <div class="timeline">
                <div
                  :class="`milestone${milestonesStatus.length === index + 1 ? ' last' : ''}`"
                  v-for="(milestoneStatus, index) in milestonesStatus">
                  <div class="date">{{ $t(`Home.RoadMap.timeline[${index}].time`) }}</div>
                  <div class="line">
                    <div :class="`dot${milestoneStatus ? ' active' : ''}`" />
                  </div>
                  <div class="event">{{ $t(`Home.RoadMap.timeline[${index}].title`) }}</div>
                </div>
                <div class="progress" />
              </div>
            </div>
          </div>
        </div>

        <div class="lc-container-3 content-section">
          <div class="lc-container-4">
            <div class="section-content">
              <div class="content">{{ $t('Home.RoadMap.content') }}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script>
import BlockSection from '~/components/BlockSection';


const milestonesStatus = [true, true, true, true, false, false, false];

export default {
  name: 'road-map',
  components: {
    BlockSection,
  },
  data() {
    return {
      milestonesStatus,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/index";

$timeline-radius: 12px;
$timeline-width: 16px;
$progress-bar-percentage: 38%;

.lc-road-map {
  margin-top: 52px;
  padding-top: 36px;

  @media (max-width: 600px) {
    margin-top: 12px;
  }

  .road-map-container {
    display: flex;
    flex-direction: column;

    .section-title {
      z-index: 1;
    }
  }

  .timeline-section {
    @media (max-width: 600px) {
      background-color: white;
    }

    .section-content {
      @media (min-width: 769px) {
        padding-bottom: 0;
      }
      @media (max-width: 600px) {
        padding-top: 0;
      }
    }
  }
  .timeline {
    position: relative;

    display: flex;
    flex-direction: row;

    margin-bottom: 24px;

    @media (min-width: 769px) {
      margin-right: #{-48px - $timeline-radius / 2};
    }
    @media (max-width: 600px) {
      margin-top: #{-$timeline-radius / 2};
    }

    .milestone {
      color: $like-dark-brown-1;
      min-width: 96px;
      flex: 1;

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

          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: $like-gray-4;

          &.active {
            background-color: $like-green;
          }

          z-index: 1;
        }
      }

      &:first-child {
        .line {
          border-radius: $timeline-radius 0 0 $timeline-radius;
        }
      }
      &.last {
        .event {
          @media (min-width: 769px) {
            margin-right: 40px;
          }
        }
        .line {
          border-radius: 0 $timeline-radius $timeline-radius 0;
        }
      }
    }

    .progress {
      position: absolute;
      background-image: linear-gradient(to left, $like-light-blue, $like-gradient-1);;
      width: $progress-bar-percentage;
      height: $timeline-width;
      border-radius: $timeline-radius;
      top: 24px;
    }
  }

}

@media (min-width: 769px) {
  .content-section .section-content {
    display: flex;
    justify-content: flex-end;
    padding-top: 0;

    .content {
      width: 66.66%;
    }
  }
}

@media (max-width: 768px) {
  body .lc-road-map .road-map-container {
    display: flex;
    flex-direction: column;

    .timeline-section {
      order: 1;
    }

    .timeline {
      flex-direction: column;
      align-items: center;

      .milestone {
        display: flex;
        flex-direction: row;
        justify-content: center;

        min-height: 66px;

        .date, .event {
          width: 130px;
          margin-top: -4px;
        }

        .event {
          order: 0;
          text-align: right;
          padding-right: 12px;
        }

        .date {
          order: 2;
          padding-left: 12px;
        }

        .line {
          width: $timeline-width;
          height: auto;

          order: 1;
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
        width: $timeline-width;
        height: $progress-bar-percentage;
        background-image: linear-gradient(to top, #d2f0f0, #f0e6b4);
      }
    }

    > .content {
      order: 0;
      margin-bottom: 32px;
    }
  }
}
</style>

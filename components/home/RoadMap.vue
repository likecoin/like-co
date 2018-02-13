<template>
  <section class="lc-container-1 lc-road-map">
    <div class="lc-container-2">
      <block-section
        :title="$t('Home.RoadMap.title')">
        <div class="road-map-container">
          <div class="timeline">
            <div
              :class="`milestone${milestones.length === index + 1 ? ' last' : ''}`"
              v-for="(milestone, index) in milestones">
              <div class="date">{{ milestone.time }}</div>
              <div class="line">
                <div :class="`dot${milestone.active ? ' active' : ''}`" />
              </div>
              <div class="event">{{ $t(`Home.RoadMap.timeline.${milestone.titleKey}`) }}</div>
            </div>
            <div class="progress" />
          </div>
          <div class="content">{{ $t('Home.RoadMap.content') }}</div>
        </div>
      </block-section/>
    </div>
  </section>
</template>

<script>
import BlockSection from '~/components/BlockSection';


const milestones = [
  {
    time: 'June 2017',
    titleKey: 'start',
    active: true,
  },
  {
    time: 'July 2017',
    titleKey: 'research',
    active: true,
  },
  {
    time: 'Nov 2017',
    titleKey: 'poc',
    active: true,
  },
  {
    time: 'Feb 2018',
    titleKey: 'store',
    active: true,
  },
  {
    time: 'March 2018',
    titleKey: 'sale',
    active: false,
  },
  {
    time: 'March 2018',
    titleKey: 'sale',
    active: false,
  },
  {
    time: 'March 2018',
    titleKey: 'sale',
    active: false,
  },
];

export default {
  name: 'road-map',
  components: {
    BlockSection,
  },
  data() {
    return {
      milestones,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/index";

$timeline-radius: 12px;
$timeline-width: 16px;
$progress-bar-percentage: 50%;

.lc-road-map {
  margin-top: 88px;

  .road-map-container {
    display: flex;
    flex-direction: column;
  }

  .timeline {
    position: relative;

    display: flex;
    flex-direction: row;

    margin-bottom: 24px;

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

@media (min-width: 601px) {
  .content {
    width: 66.66%;
    align-self: flex-end;
  }
}

@media (max-width: 600px) {
  body .lc-road-map .road-map-container {
    display: flex;
    flex-direction: column;

    .timeline {
      flex-direction: column;
      align-items: center;

      order: 1;

      .milestone {
        display: flex;
        flex-direction: row;
        justify-content: center;

        min-height: 66px;

        .date, .event {
          width: 120px;
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

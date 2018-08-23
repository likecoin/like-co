<template>
  <div
    :class="[
      'mission-list',
      layout,
      {
        grid: isGrid,
        loading: isLoading,
        swippable: isSwippable,
      },
    ]"
  >
    <div>

      <header v-if="!isSwippable">
        <div class="column-labels">
          <nuxt-link
            :to="{ name: 'id', params: { id: invitee.displayName } }"
          ><span>LIKE</span></nuxt-link>
        </div>
      </header>

      <div
        :class="[
          'mission-item-list-wrapper',
          {
            'overflow-left': canScrollLeft,
            'overflow-right': canScrollRight,
            'lc-mobile-hide': isSwippable,
          },
        ]"
      >
        <ul
          v-if="isEmptyList && !isLoading"
          ref="list"
          @scroll="onLayout"
        >
          <li
            class="item-placeholder empty"
          >
            <mission-item-placeholder
              :layout="layout"
              :animated="false"
            />
            <span>{{ emptyPlaceholder }}</span>
          </li>
        </ul>

        <ul
          v-else-if="isLoading"
          ref="list"
          @scroll="onLayout"
        >
          <li
            v-for="p in NUM_PLACEHOLDERS"
            :key="`placeholder-${p}`"
            class="item-placeholder"
          >
            <mission-item-placeholder :layout="layout" />
          </li>
        </ul>

        <ul
          v-if="!isLoading"
          ref="list"
          @scroll="onLayout"
        >
          <li
            v-for="m in missions"
            :key="m.id"
          >
            <mission-item
              :bonus-cooldown="bonusCooldown"
              :layout="layout"
              :mission="m"
              :is-referral="isReferral"
              @click="state => onClick(m, state)"
            />
          </li>
        </ul>
      </div>

      <swiper
        v-if="isSwippable"
        :is-loading="isLoading"
        :is-show-pagination="missions.length > 1"
        class="lc-mobile-show"
      >
        <template v-if="isLoading">
          <div
            v-for="p in NUM_PLACEHOLDERS"
            :key="`placeholder-${p}`"
            class="swiper-slide"
          >
            <mission-item-placeholder layout="large" />
          </div>
        </template>

        <div
          v-if="isEmptyList && !isLoading"
          class="swiper-slide"
        >
          <div class="item-placeholder empty">
            <mission-item-placeholder
              :animated="false"
              layout="large"
            />
            <span>{{ emptyPlaceholder }}</span>
          </div>
        </div>
        <template v-if="!isLoading">
          <div
            v-for="m in missions"
            :key="m.id"
            class="swiper-slide"
          >
            <mission-item
              :bonus-cooldown="bonusCooldown"
              :mission="m"
              :is-referral="isReferral"
              layout="large"
              @click="state => onClick(m, state)"
            />
          </div>
        </template>

      </swiper>

    </div>
  </div>
</template>


<script>
import _throttle from 'lodash.throttle';

import MissionItem from './Item';
import MissionItemPlaceholder from './ItemPlaceholder';
import Swiper from './Swiper';

export default {
  name: 'mission-list',
  components: {
    MissionItem,
    MissionItemPlaceholder,
    Swiper,
  },
  props: {
    layout: {
      type: String,
      validator(value) {
        return ['small', 'large', 'fluid'].indexOf(value) !== -1;
      },
      default: 'fluid',
    },
    invitee: {
      type: Object,
      default: () => {},
    },
    missions: {
      type: Array,
      default: () => [],
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    isGrid: {
      type: Boolean,
      default: true,
    },
    isSwippable: {
      type: Boolean,
      default: true,
    },
    swipperId: {
      type: String,
      default: undefined,
    },
    isReferral: {
      type: Boolean,
      default: false,
    },
    emptyPlaceholder: {
      type: String,
      default: '',
    },
    bonusCooldown: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      NUM_PLACEHOLDERS: 6,
      canScrollLeft: false,
      canScrollRight: false,
    };
  },
  computed: {
    shouldShowScrollIndicator() {
      return this.layout !== 'small' && !this.isGrid;
    },
    isEmptyList() {
      return this.missions.length <= 0;
    },
  },
  watch: {
    missions() {
      this.$nextTick(() => this.updateScrollIndicator());
    },
    isLoading() {
      this.$nextTick(() => {
        this.$refs.list.scrollLeft = 0;
        this.updateScrollIndicator();
      });
    },
  },
  mounted() {
    if (this.shouldShowScrollIndicator) {
      window.addEventListener('resize', this.onLayout);
    }
  },
  beforeDestroy() {
    if (this.shouldShowScrollIndicator) {
      window.removeEventListener('resize', this.onLayout);
    }
  },
  methods: {
    updateScrollIndicator() {
      if (!this.$refs.list) return;
      const { clientWidth, scrollWidth, scrollLeft } = this.$refs.list;

      if (scrollLeft !== 0) {
        this.canScrollLeft = true;
      } else {
        this.canScrollLeft = false;
      }

      if (scrollLeft + clientWidth >= scrollWidth) {
        this.canScrollRight = false;
      } else {
        this.canScrollRight = true;
      }
    },
    onClick(m, state) {
      if (this.state !== 'claimed') {
        this.$emit('click', ({
          ...m,
          invitee: this.invitee,
          isReferral: this.isReferral,
          ...state,
        }));
      }
    },
    onLayout: _throttle(function () { this.updateScrollIndicator(); }, 20),
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

@mixin large-mission-list {
  header {
    display: none;
  }

  &.grid {
    ul {
      flex-wrap: wrap;

      margin: 0 -8px;
      padding: 0;

      li {
        padding: 8px;
      }
    }
  }

  &:not(.grid) {
    .mission-item-list-wrapper {
      overflow-x: hidden;
    }

    ul {
      position: relative;

      overflow-x: auto;

      padding-top: 12px;
      padding-bottom: 18px;

      li {
        box-sizing: content-box;
        width: 188px;
        min-width: 188px;


        &:not(:first-child) {
          padding-left: 8px;
        }

        &:not(:last-child) {
          padding-right: 8px;
        }

        &:first-child {
          padding-left: 40px + 8px;
        }

        &:last-child {
          padding-right: 40px + 8px;
        }

        @media (max-width: 768px) {
          &:first-child {
            padding-left: 24px + 8px;
          }

          &:last-child {
            padding-right: 24px + 8px;
          }
        }
      }
    }
  }

  .mission-item-list-wrapper {
    position: relative;

    &::before,
    &::after {
      position: absolute;
      z-index: 1;
      top: 0;
      bottom: 0;

      width: 10px;

      content: "";
      transition: opacity .2s ease;

      opacity: 0;
      background-image: radial-gradient(
        ellipse at center,
        rgba(0,0,0,.15) 0%,
        rgba(0,0,0,.05) 65%,
        rgba(0,0,0,0) 75%
      );
    }

    &::before {
      left: -5px;
    }

    &::after {
      right: -5px;
    }

    &.overflow-left::before,
    &.overflow-right::after {
      opacity: 1;
    }
  }
}

@mixin small-mission-list() {
  ul {
    flex-direction: column;

    margin: -4px;
    padding: 0;

    li {
      padding: 4px;

      &.item-placeholder:nth-child(n + 4) {
        display: none;
      }
    }
  }
}

.mission-list {
  &.small {
    @include small-mission-list();
  }

  &.large {
    @include large-mission-list();
  }

  &.fluid {
    @media (min-width: 600px + 1px) {
      @include large-mission-list();
    }

    @media (max-width: 600px) {
      @include small-mission-list();
    }

    &.grid {
      ul li {
        @mixin list-item($num-of-child) {
          width: calc(1 / #{$num-of-child} * 100%);

          @media (min-width: 600px + 1px) {
            &.item-placeholder:nth-child(n + #{$num-of-child + 1}) {
              display: none;
            }
          }
        }

        @include list-item(6);

        @media (max-width: 1384px) {
          @include list-item(5);
        }

        @media (max-width: 1188px) {
          @include list-item(4);
        }

        @media (max-width: 928px) {
          @include list-item(3);
        }

        @media (max-width: 712px) {
          @include list-item(2);
        }

        @media (max-width: 600px) {
          width: 100%;
        }

        &.item-placeholder {
          @media (min-width: 600px + 1px) {
            padding-bottom: 34px;
          }
        }
      }
    }

    &:not(.grid) {
      ul li {
        &.item-placeholder {
          @media (min-width: 600px + 1px) {
            padding-bottom: 26px;
          }
        }
      }
    }
  }

  &.swippable {
    .swiper-slide {
      width: 188px;
    }
  }
}

ul {
  display: flex;

  list-style: none;
}

.column-labels {
  padding: 4px 10px;

  text-align: right;

  color: $like-green;

  font-size: 12px;
}

.item-placeholder.empty {
  display: flex;

  span {
    flex-shrink: 0;
  }

  @media (min-width: 600 + 1px) {
    flex-direction: row;

    span {
      display: flex;
      align-items: center;

      margin-left: 24px;
    }
  }

  @media (max-width: 600px) {
    flex-direction: column;

    span {
      margin-top: 12px;

      text-align: center;
    }
  }
}
</style>

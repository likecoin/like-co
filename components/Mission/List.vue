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
    ]">
    <div>

      <header v-if="!isSwippable">
        <div class="column-labels">
          <nuxt-link :to="{ name: 'id', params: { id: username } }"><span>LIKE</span></nuxt-link>
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
        ]">
        <ul ref="list" @scroll="onLayout">

          <li v-for="m in missions" :key="m.id">
            <mission-item
              :layout="layout"
              :mission="m"
              :is-referral="isReferral"
              @click="onClick(m)" />
          </li>

          <li
            v-for="p in NUM_PLACEHOLDERS"
            v-if="isLoadingList"
            :key="`placeholder-${p}`">
            <mission-item-placeholder :layout="layout"/>
          </li>

          <li
            v-if="isEmptyList && emptyPlaceholder"
            class="empty-list-placeholder">
            <mission-item-placeholder :layout="layout" :animated="false" />
            <span>{{ emptyPlaceholder }}</span>
          </li>

        </ul>
      </div>

      <swiper
        v-if="isSwippable"
        class="lc-mobile-show"
        :is-loading="missions.length <= 0"
        @click="onClickSlide">

        <div
          v-for="m in missions"
          :key="m.id"
          class="swiper-slide">
          <mission-item
            layout="large"
            :mission="m"
            :is-referral="isReferral" />
        </div>

        <div
          v-for="p in NUM_PLACEHOLDERS"
          v-if="missions.length <= 0"
          :key="`placeholder-${p}`"
          class="swiper-slide">
          <mission-item-placeholder layout="large"/>
        </div>
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
  props: {
    layout: {
      type: String,
      validator(value) {
        return ['small', 'large', 'fluid'].indexOf(value) !== -1;
      },
      default: 'fluid',
    },
    username: {
      type: String,
      default: '',
    },
    missions: {
      type: Array,
      default: () => [],
    },
    isLoading: {
      type: Boolean,
      default: null,
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
    },
    isReferral: {
      type: Boolean,
      default: false,
    },
    emptyPlaceholder: {
      type: String,
      default: '',
    },
  },
  components: {
    MissionItem,
    MissionItemPlaceholder,
    Swiper,
  },
  data() {
    return {
      NUM_PLACEHOLDERS: 3,
      canScrollLeft: false,
      canScrollRight: false,
    };
  },
  computed: {
    shouldShowScrollIndicator() {
      return this.layout !== 'small' && !this.isGrid;
    },
    isLoadingList() {
      return this.missions.length <= 0 && (this.isLoading || this.isLoading === null);
    },
    isEmptyList() {
      return this.missions.length <= 0 && !this.isLoading;
    },
  },
  methods: {
    updateScrollIndicator() {
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
    onClick(m) {
      if (this.state !== 'claimed') {
        this.$emit('click', ({
          ...m,
          invitee: this.username,
          isReferral: this.isReferral,
        }));
      }
    },
    onClickSlide(i) {
      if (this.missions.length > 0 && i < this.missions.length) {
        this.onClick(this.missions[i]);
      }
    },
    onLayout: _throttle(function () { this.updateScrollIndicator(); }, 20),
  },
  watch: {
    missions() {
      this.$nextTick(() => this.updateScrollIndicator());
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

  li:last-child:not(.empty-list-placeholder) .mission-item-placeholder {
    display: none;
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
      background-image: radial-gradient(ellipse at center, rgba(0,0,0,.15) 0%, rgba(0,0,0,.05) 65%, rgba(0,0,0,0) 75%);
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

    ul li {
      width: 1 / 6 * 100%;

      @media (max-width: 1384px) {
        width: 1 / 5 * 100%;
      }

      @media (max-width: 1188px) {
        width: 1 / 4 * 100%;
      }

      @media (max-width: 928px) {
        width: 1 / 3 * 100%;
      }

      @media (max-width: 712px) {
        width: 1 / 2 * 100%;
      }

      @media (max-width: 600px) {
        width: 100%;
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

.empty-list-placeholder {
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
    }
  }
}
</style>

<template>
  <div
    :class="[
      'mission-swiper',
      {
        loading: isLoading,
      },
    ]"
    v-swiper:swiper="swiperOptions"
    @slideChange="onSlideChange">

    <div class="swiper-wrapper" @click="onClick">
      <slot />
    </div>

    <div class="swiper-navigations">
      <div class="swiper-pagination swiper-pagination-bullets" />
      <div class="swiper-button-next">
        <simple-svg
          :filepath="ArrowRightIcon"
          width="21px"
          height="16px"
          stroke="transparent"
        />
      </div>
      <div class="swiper-button-prev">
        <simple-svg
          :filepath="ArrowLeftIcon"
          width="21px"
          height="16px"
          stroke="transparent"
        />
      </div>
    </div>

  </div>
</template>


<script>
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg';
import ArrowRightIcon from '@/assets/icons/arrow-right.svg';

export default {
  name: 'swiper',
  props: {
    swiperId: {
      type: String,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      ArrowLeftIcon,
      ArrowRightIcon,
    };
  },
  computed: {
    swiperOptions() {
      return {
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 16,
        navigation: {
          nextEl: this.getSelector('.swiper-button-next'),
          prevEl: this.getSelector('.swiper-button-prev'),
        },
        pagination: {
          el: this.getSelector('.swiper-pagination'),
          clickable: true,
        },
      };
    },
  },
  methods: {
    getSelector(selector) {
      return this.swiperId ? `#${this.swiperId} ${selector}` : selector;
    },
    onClick() {
      const { activeIndex, clickedIndex } = this.swiper;

      if (activeIndex === clickedIndex) {
        this.$emit('click', clickedIndex);
      } else {
        this.swiper.slideTo(clickedIndex);
      }
    },
    onSlideChange() {
      const { activeIndex } = this.swiper;

      this.$emit('slideChange', { activeIndex });
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.mission-swiper {
  width: 100%;
}

.swiper-navigations {
  position: relative;

  margin-top: 16px;
  padding-bottom: 16px;

  opacity: 1;

  transition: opacity .15s ease-in-out;

  .loading & {
    opacity: 0;
    pointer-events: none;
  }
}

.swiper-wrapper {
  padding-bottom: 8px;

  .swiper-slide {
    > * {
      transition-timing-function: cubic-bezier();
      transition-duration: .15s;
      transition-property: transform, opacity;
    }

    &:not(.swiper-slide-active) {
      > * {
        transform: scale(0.95);

        opacity: 0.5;
      }
    }
  }
}

.swiper-button {
  &-prev,
  &-next {
    top: 16px;

    width: 21px;
    height: 16px;

    background-image: none;

    .simple-svg-wrapper :global(svg) {
      fill: $like-green !important;
    }

    &.swiper-button-disabled {
      opacity: 1;

      .simple-svg-wrapper :global(svg) {
        fill: #e6e6e6 !important;
      }
    }
  }

  &-prev {
    left: 8px;
  }

  &-next {
    right: 8px;
  }
}

.swiper-pagination {
  position: relative;

  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;

  width: 100%;

  :global(.swiper-pagination-bullet) {
    width: 3px;
    height: 3px;
    margin: 0 4px;

    transition: background-color .15s cubic-bezier();

    opacity: 1;
    border-radius: 50%;
    background-color: #9b9b9b;

    &:global(-active) {
      width: 5px;
      height: 5px;

      background-color: $like-green;
    }
  }
}
</style>

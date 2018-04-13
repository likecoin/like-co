<template>
  <section class="lc-swiper">
    <div v-swiper:mySwiper="swiperOptions">
      <div class="swiper-wrapper">
        <slot />
      </div>
    </div>

    <div class="navigations lc-margin-top-24">
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
  </section>
</template>


<script>
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg';
import ArrowRightIcon from '@/assets/icons/arrow-right.svg';


export default {
  name: 'swiper',
  data() {
    return {
      ArrowLeftIcon,
      ArrowRightIcon,

      swiperOptions: {
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 100,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      },
    };
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.lc-swiper {
  width: 100%;

  :global(.swiper-container) {
    padding: 0 16px;
  }

  .navigations {
    position: relative;

    margin-right: -16px;
    margin-left: -16px;

    .swiper-button-prev,
    .swiper-button-next {
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

    .swiper-button-prev {
      left: 0;
    }
    .swiper-button-next {
      right: 0;
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

        opacity: 1;
        border-radius: 50%;
        background: #9b9b9b;
      }
      :global(.swiper-pagination-bullet-active) {
        width: 5px;
        height: 5px;

        background: $like-green;
      }
    }
  }
}
</style>

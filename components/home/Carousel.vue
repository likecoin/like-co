<template>
  <section class="lc-container-0 lc-carousel md-xsmall-hide">
    <div v-swiper:mySwiper="swiperOptions">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="slide in slides" :key="slide.id">
          <div :style="{
            'background-image': 'url(' + require(`~/assets/home/feature/${slide.id}-image.jpg`) + ')'
          }">
            <div class="lc-container-1">
              <div class="lc-container-2">
                <div class="lc-container-3">
                  <creator-button
                    :src="imgUrl(`${slide.id}-icon.jpg`)"
                    :id="slide.id"
                    :title="slide.title"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="swiper-pagination swiper-pagination-bullets" />
    </div>
  </section>
</template>

<script>
import BlockSection from '~/components/BlockSection';
import CreatorButton from '~/components/CreatorButton';


const images = require.context('../../assets/home/feature');
const imgUrl = path => images(`./${path}`);
const slides = [
  {
    id: 'yansquare',
    title: 'Illustrator',
  },
  {
    id: 'uncleman',
    title: 'Designer',
  },
  {
    id: 'kitdastudio',
    title: 'Designer',
  },
];

export default {
  name: 'carousel',
  components: {
    BlockSection,
    CreatorButton,
  },
  data() {
    return {
      slides,
      swiperOptions: {
        loop: true,
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 0,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      },
    };
  },
  methods: {
    imgUrl,
  },
  mounted() {
    if (this.mySwiper) {
      // auto play the swiper
      this.mySwiper.autoplay.start();
    }
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/index";

$carousel-height: 488px;

.lc-carousel {
  height: $carousel-height;

  .swiper-container {
    .swiper-wrapper {
      .swiper-slide {
        > div {
          width: 100%;
          height: $carousel-height;
          background-size: cover;
          background-position: 50%;
        }
      }
    }

    .swiper-pagination {
      bottom: -5px;

      :global(.swiper-pagination-bullet) {
        border-radius: 0;
        width: 72px;
        height: 4px;
        background: $like-white;
        opacity: 1;
      }
      :global(.swiper-pagination-bullet-active) {
        background: $like-green;
      }
    }
  }

  .lc-creator-button {
    position: absolute;
    top: 380px;
    left: 30px;
  }
}
</style>

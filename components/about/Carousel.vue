<template>
  <section class="lc-container-0 lc-carousel lc-mobile-hide">
    <div v-swiper:mySwiper="swiperOptions">
      <div class="swiper-wrapper">
        <div
          v-for="slide in slides"
          :key="slide.id"
          class="swiper-slide"
        >
          <div
            :style="{
              'background-image':
                'url(' + require(`~/assets/home/feature/${slide.id}-image.jpg`) + ')'
            }"
          >
            <div class="lc-container-1">
              <div class="lc-container-2">
                <div class="lc-container-3">
                  <creator-button
                    :id="slide.id"
                    :src="imgUrl(`${slide.id}-icon.jpg`)"
                    :title="$t(`Creator.title.${slide.titleKey}`)"
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
import CreatorButton from '~/components/CreatorButton';


const images = require.context('../../assets/home/feature');
const imgUrl = path => images(`./${path}`);
const slides = [
  {
    id: 'kitdastudio',
    titleKey: 'multimediaDesigner',
  },
  {
    id: 'yansquare',
    titleKey: 'artist',
  },
  {
    id: 'uncleman',
    titleKey: 'comicAuthor',
  },
];

export default {
  name: 'carousel',
  components: {
    CreatorButton,
  },
  data() {
    return {
      slides,
      mySwiperTimer: null,
      swiperOptions: {
        loop: true,
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 0,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        autoplay: {
          delay: 4000,
        },
      },
    };
  },
  mounted() {
    if (this.mySwiper) {
      this.mySwiperTimer = setTimeout(() => {
        // slide the first one after 1s, then autoplay slide with default 4s
        this.mySwiper.slideNext();
        this.mySwiper.autoplay.start();
      }, 1000);
    }
  },
  beforeDestroy() {
    if (this.mySwiperTimer) {
      clearTimeout(this.mySwiperTimer);
      this.mySwiperTimer = null;
    }
  },
  methods: {
    imgUrl,
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

$carousel-height: 488px;

.lc-carousel {
  height: $carousel-height;

  .swiper-container {
    .swiper-wrapper {
      .swiper-slide {
        > div {
          width: 100%;
          height: $carousel-height;

          background-position: 50%;
          background-size: cover;
        }
      }
    }

    .swiper-pagination {
      bottom: -5px;

      /deep/ .swiper-pagination-bullet {

        width: 72px;
        height: 4px;

        opacity: 1;
        border-radius: 0;

        background: $like-white;
      }
      /deep/ .swiper-pagination-bullet-active {
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

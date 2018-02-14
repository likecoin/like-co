<template>
  <section class="lc-container-0 lc-carousel md-xsmall-hide">
    <div v-swiper:mySwiper="swiperOptions">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="banner in banners">
          <div :style="{
            'background-image': `url('${banner}')`,
          }">
            <div class="lc-container-1">
              <div class="lc-container-2">
                <div class="lc-container-3">
                  <creator-button
                    src="https://oice.com/upload/4f294e929c75458f90e9e60dda8fb21f/avatar.jpg"
                    name="Shiba Inu"
                    title="The Chill Dog"
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

export default {
  name: 'carousel',
  components: {
    BlockSection,
    CreatorButton,
  },
  data() {
    return {
      swiperOptions: {
        loop: true,
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 30,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      },
      banners: [
        'https://static.pexels.com/photos/29435/landscape-sky-night-stars-29435.jpg',
        'https://orig00.deviantart.net/f0e7/f/2008/260/e/1/dawn_by_freelancah.jpg',
        'http://www.maurilioamorim.com/wp-content/uploads/2011/06/life-storm.jpg',
        'http://res.cloudinary.com/simpleview/image/upload/v1512067313/clients/surfcityusa/Beach_photo_jpg_49144852-3c44-4c4c-af00-c4b90e08cf13.jpg',
      ],
    };
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
        }
      }
    }

    .swiper-pagination {
      bottom: -5px;

      :global(.swiper-pagination-bullet) {
        border-radius: 0;
        width: 72px;
        height: 4px;
        background: $like-gray-4;
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

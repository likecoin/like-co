<template>
  <section class="lc-container-1" id="early-adopters">
    <div class="lc-container-2">
      <div class="block-section">

        <!-- Section title -->
        <div class="lc-container-3">
          <div class="lc-container-4">
            <div class="section-title">
              {{ $t('Home.EarlyAdopters.title') }}
            </div>
          </div>
        </div>

        <div class="lc-container-3">
          <div class="lc-container-4">
            <div class="section-content">
              <image-grid :items="adopters" />
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>


<script>
import ImageGrid from '../ImageGrid';


const adopters = [
  {
    src: '/images/adopter-logo/famitsu.png',
    link: 'https://www.famitsu.hk/',
  },
  {
    src: '/images/adopter-logo/lifehack.png',
    link: 'https://www.lifehack.org/',
  },
  {
    src: '/images/adopter-logo/initium.jpg',
    link: 'https://theinitium.com/',
  },
  {
    src: '/images/adopter-logo/standnews.png',
    link: 'https://www.thestandnews.com/',
  },
  {
    src: '/images/adopter-logo/oice.svg',
    link: 'https://oice.com/',
  },
  {
    src: '/images/adopter-logo/lakoo.png',
    link: 'https://lakoo.com/',
  },
];

export default {
  name: 'early-adopter',
  components: {
    ImageGrid,
  },
  data() {
    return {
      adopters,
    };
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/index";

#early-adopters {
  @media (min-width: 601px) {
    margin-top: 68px;
    padding-top: 36px;
  }
}
</style>

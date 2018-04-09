<template>
  <section class="lc-container-0" id="early-adopters">
    <div class="lc-container-1">

      <!-- Section Title -->
      <div class="lc-container-header">
        <div class="lc-container-2 lc-container-header-overlay">
          <div class="lc-container-3 lc-bg-gray-1 lc-mobile-hide" />
        </div>
        <div class="lc-container-2">
          <div class="lc-container-3">
            <div class="lc-container-4">
              <div class="lc-container-header-title">
                <h1 class="lc-font-size-32 lc-mobile">
                  {{ $t('Home.EarlyAdopters.title') }}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lc-container-2">
        <div class="lc-container-3 lc-bg-gray-1">
          <div class="lc-container-4">
            <div class="lc-padding-top-24 lc-padding-bottom-32">
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

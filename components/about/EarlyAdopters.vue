<template>
  <section
    id="early-adopters"
    class="lc-container-0"
  >
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

const getPlatformImage = require.context('~/assets/new-platforms');

const adopters = [
  {
    id: 'matters',
    link: 'https://matters.news/',
  },
  {
    id: 'inmediahk',
    link: 'https://www.inmediahk.net/',
  },
  {
    id: 'standnews',
    link: 'https://thestandnews.com/',
  },
  {
    id: 'hkcnews',
    link: 'https://www.hkcnews.com/',
    isHideBorder: true,
  },
  {
    id: 'wordpress',
    link: 'https://wordpress.org/plugins/likecoin/',
    isHideBorder: true,
  },
  {
    id: 'medium',
    link: 'https://medium.com/',
  },
  {
    id: 'vocus',
    link: 'https://vocus.cc/',
    isHideBorder: true,
  },
].map(({ id, ...rest }) => ({
  src: getPlatformImage(`./${id}.svg`),
  ...rest,
}));

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

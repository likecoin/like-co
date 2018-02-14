<template>
  <section class="lc-container-1 lc-partners">
    <div class="lc-container-2">
      <div class="block-section">

        <!-- Section title -->
        <div class="lc-container-3">
          <div class="lc-container-4">
            <div class="section-title">
              {{ $t('Home.Partners.title') }}
            </div>
          </div>
        </div>

        <div class="lc-container-3">
          <div class="lc-container-4">
            <div class="section-content">
              {{ $t('Home.Partners.content') }}
            </div>
          </div>
        </div>

        <div class="lc-container-3">
          <div class="lc-container-4">
            <div class="section-content">
              <image-grid :items="partners" />
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>


<script>
import ImageGrid from '../ImageGrid';


const partners = [
  { src: 'http://via.placeholder.com/350x150', link: '' },
  { src: 'http://via.placeholder.com/250x300', link: '' },
  { src: 'http://via.placeholder.com/250x150', link: '' },
  { src: 'http://via.placeholder.com/350x300', link: '' },
  { src: 'http://via.placeholder.com/250x150', link: '' },
  { src: 'http://via.placeholder.com/350x150', link: '' },
];

export default {
  name: 'parters',
  components: {
    ImageGrid,
  },
  data() {
    return {
      partners,
    };
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/index";

.lc-partners {
  @media (min-width: 601px) {
    margin-top: 104px;
  }
}
</style>

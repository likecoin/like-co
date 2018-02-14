<template>
  <section class="lc-container-1 lc-press-coverage">
    <div class="lc-container-2">
      <div class="block-section">

        <!-- Section title -->
        <div class="lc-container-3">
          <div class="lc-container-4">
            <div class="section-title">
              {{ $t('Home.PressCoverage.title') }}
            </div>
          </div>
        </div>

        <div class="lc-container-3">
          <div class="lc-container-4">
            <div class="section-content">
              <image-grid :items="presses" />
              <image-grid :items="newsclips" lightboxId="newsclips" />
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>


<script>
import ImageGrid from '../ImageGrid';


const presses = [
  {
    src: '/images/press-logo/thestandard.png',
    link: 'http://www.thestandard.com.hk/section-news.php?id=189734&story_id=47421669&d_str=20171117&sid=5',
  },
  {
    src: '/images/press-logo/hk01.png',
    link: 'https://geme.hk01.com/channel/%E6%B4%BB%E5%8B%95/103842/oice%E3%80%8C%E6%88%91%E8%87%AA%E7%94%B1%E6%88%91%E5%B0%8E%E3%80%8D%E8%A6%96%E8%A6%BA%E5%B0%8F%E8%AA%AA%E5%89%B5%E4%BD%9C%E6%AF%94%E8%B3%BD%E7%B0%A1%E4%BB%8B%E6%9C%83',
  },
  {
    src: '/images/press-logo/borislee.jpg',
    link: 'http://www.borislee.hk/2018-01/media/how-blockchain-and-token-sales-help-new-media-get-income/',
  },
];

const newsclips = [
  {
    src: '/images/articles/20180101-commercial-radio-hk.jpg',
    title: 'Commercial Radio Hong Kong, 2018.01.01',
  },
  {
    src: '/images/articles/20171007-mingbao-01.jpg',
    title: 'Mingpao (明報), 2017.10.07 (1)',
  },
  {
    src: '/images/articles/20171007-mingbao-02.jpg',
    title: 'Mingpao (明報), 2017.10.07 (2)',
  },
];

export default {
  name: 'press-coverage',
  components: {
    ImageGrid,
  },
  data() {
    return {
      presses,
      newsclips,
    };
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/index";

.lc-press-coverage {
  @media (min-width: 601px) {
    margin-top: 104px;
  }
}
</style>

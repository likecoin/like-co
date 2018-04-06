<template>
  <section class="lc-container-1 lc-press-coverage" id="press">
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
              <image-grid :items="presses" lightboxId="presses" />
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
    src: '/images/press-logo/thestandard.svg',
    link: 'http://www.thestandard.com.hk/section-news.php?id=189734&story_id=47421669&d_str=20171117&sid=5',
  },
  {
    src: '/images/press-logo/tvb.svg',
    link: 'https://vimeo.com/261966523',
  },
  {
    src: '/images/press-logo/appledaily.jpg',
    link: 'https://video.appledaily.com.hk/mcp/encode/2018/03/05/3560694/20180304_fin_100AD_w.mp4',
  },
  {
    src: '/images/press-logo/881903.svg',
    link: '/images/articles/20180101-commercial-radio-hk.jpg',
    isLightBox: true,
    title: 'Commercial Radio Hong Kong, 2018.01.01',
  },
  {
    src: '/images/press-logo/ming-pao.svg',
    link: '/images/articles/20171007-mingbao.jpg',
    isLightBox: true,
    title: 'Mingpao (明報), 2017.10.07',
  },
  {
    src: '/images/press-logo/hk01.png',
    link: 'https://geme.hk01.com/channel/%E6%B4%BB%E5%8B%95/103842/oice%E3%80%8C%E6%88%91%E8%87%AA%E7%94%B1%E6%88%91%E5%B0%8E%E3%80%8D%E8%A6%96%E8%A6%BA%E5%B0%8F%E8%AA%AA%E5%89%B5%E4%BD%9C%E6%AF%94%E8%B3%BD%E7%B0%A1%E4%BB%8B%E6%9C%83',
  },
  {
    src: '/images/press-logo/am730.svg',
    link: 'https://www.am730.com.hk/column/%E8%B2%A1%E7%B6%93/%E6%8E%98%E9%87%91%E6%8E%98%E7%A4%A6%E6%8E%98likecoin-120913',
  },
  {
    src: '/images/press-logo/inside.svg',
    link: 'https://www.inside.com.tw/2018/03/18/like-to-coin',
  },
  {
    src: '/images/press-logo/imoney.png',
    link: 'http://imoney.hket.com/article/2031727/%25E9%25A6%2596%25E9%259A%25BB%25E6%25B8%25AF%25E7%2594%25A2%25E5%258A%25A0%25E5%25AF%2586%25E8%25B2%25A8%25E5%25B9%25A3%2520%25E5%258C%2596Like%25E7%2582%25BACoin',
  },
  {
    src: '/images/press-logo/mrblock.png',
    link: 'https://www.youtube.com/watch?feature=youtu.be&v=GzL4WqgetIY&app=desktop',
  },
  {
    src: '/images/press-logo/borislee.png',
    link: 'http://www.borislee.hk/2018-01/media/how-blockchain-and-token-sales-help-new-media-get-income/',
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
    };
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.lc-press-coverage {
  @media (min-width: 601px) {
    padding-top: 36px;
  }
}
</style>

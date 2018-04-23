<template>
  <section class="lc-container-0 lc-press-coverage" id="press">
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
                  {{ $t('Home.PressCoverage.title') }}
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
    src: '/images/press-logo/hkej.svg',
    link: 'http://startupbeat.hkej.com/?p=57661',
  },
  {
    src: '/images/press-logo/rthk.svg',
    link: 'http://www.rthk.hk/radio/pth/programme/p0452_world_towards_informatio/episode/495605',
  },
  {
    src: '/images/press-logo/am730.svg',
    link: 'https://www.am730.com.hk/column/%E8%B2%A1%E7%B6%93/%E6%8E%98%E9%87%91%E6%8E%98%E7%A4%A6%E6%8E%98likecoin-120913',
  },
  {
    src: '/images/press-logo/blockcast.png',
    link: 'http://blockcast.it/2018/04/19/blockcast-interview-likecoin-founder-kin-ko/',
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

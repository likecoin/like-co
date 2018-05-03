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
              <image-grid
                ref="imageGrid"
                :items="presses"
                lightboxId="presses" />
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
    id: 'bloomberg',
    src: '/images/press-logo/bloomberg.png',
    link: '/images/articles/20180502-bloomberg-businessweek.png',
    isLightBox: true,
    title: 'Bloomberg Businessweek, 2018.05.02',
  },
  {
    id: 'cryptoground',
    src: '/images/press-logo/cryptoground.svg',
    link: 'https://www.cryptoground.com/a/likecoin-founder-kin-ko-presents-an-opportunity-for-artists-to-earn',
  },
  {
    id: 'ejinsight',
    src: '/images/press-logo/ejinsight.png',
    link: 'http://www.ejinsight.com/20180409-hk-based-likecoin-uses-token-to-reward-online-content-creators/',
  },
  {
    id: 'thestandard',
    src: '/images/press-logo/thestandard.svg',
    link: 'http://www.thestandard.com.hk/section-news.php?id=189734&story_id=47421669&d_str=20171117&sid=5',
  },
  {
    id: 'blockcast',
    src: '/images/press-logo/blockcast.png',
    link: 'http://blockcast.it/2018/04/19/blockcast-interview-likecoin-founder-kin-ko/',
  },
  {
    id: 'mrblock',
    src: '/images/press-logo/mrblock.png',
    link: 'https://www.youtube.com/watch?v=x4_-UY1baT8',
  },
  {
    id: 'tvb',
    src: '/images/press-logo/tvb.svg',
    link: 'https://vimeo.com/261966523',
  },
  {
    id: '881903',
    src: '/images/press-logo/881903.svg',
    link: '/images/articles/20180101-commercial-radio-hk.jpg',
    isLightBox: true,
    title: 'Commercial Radio Hong Kong, 2018.01.01',
  },
  {
    id: 'mingpao',
    src: '/images/press-logo/ming-pao.svg',
    link: '/images/articles/20171007-mingbao.jpg',
    isLightBox: true,
    title: 'Mingpao (明報), 2017.10.07',
  },
  {
    id: 'rthk',
    src: '/images/press-logo/rthk.svg',
    link: 'http://www.rthk.hk/radio/pth/programme/p0452_world_towards_informatio/episode/495605',
  },
  {
    id: 'appledaily',
    src: '/images/press-logo/appledaily.jpg',
    link: 'https://video.appledaily.com.hk/mcp/encode/2018/03/05/3560694/20180304_fin_100AD_w.mp4',
  },
  {
    id: 'inside',
    src: '/images/press-logo/inside.svg',
    link: 'https://www.inside.com.tw/2018/03/18/like-to-coin',
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
  mounted() {
    const query = /[?&]press=([^&]*)/.exec(window.location.search);
    if (query && query[1]) {
      const imageId = query[1];

      const press = this.presses.find(({ id }) => id === imageId);
      if (imageId && press) {
        const element = document.querySelector('#press');
        if (element) element.scrollIntoView();

        if (press.isLightBox) {
          this.$nextTick(() => {
            this.$refs.imageGrid.openLightBox(imageId);
          });
        }
      }
    }
  },
};
</script>

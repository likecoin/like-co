<template>
  <section
    id="press"
    class="lc-container-0 lc-press-coverage"
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
                  {{ $t('Home.PressCoverage.title') }}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lc-container-2">
        <div class="lc-container-3 lc-bg-gray-1">
          <div class="lc-container-4 lc-text-align-center">
            <div class="lc-padding-top-24 lc-padding-bottom-32">
              <image-grid
                ref="imageGrid"
                :items="presses"
                lightboxId="presses"
              />

              <md-button
                class="lc-underline lc-color-like-green lc-margin-top-12"
                href="https://press.like.co"
                rel="noopener noreferrer"
                target="_blank"
              >
                {{ $t('Home.PressCoverage.button.more') }}
              </md-button>
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
    id: 'hk01',
    src: '/images/press-logo/hk01.svg',
    link: 'https://www.hk01.com/%E5%B0%88%E9%A1%8C%E4%BA%BA%E8%A8%AA/222574/%E5%B0%88%E8%A8%AA-%E5%89%B5%E6%84%8F%E6%9C%89%E5%83%B9-%E7%B6%B2%E6%B0%91%E6%8C%89likecoin%E9%8D%B5-%E5%8F%AF%E5%8A%A9%E5%89%B5%E4%BD%9C%E8%80%85%E6%97%A5%E9%80%B2%E5%8D%83%E9%87%91',
  },
  {
    id: 'nextmedia',
    src: '/images/press-logo/nextmedia.png',
    link: 'http://nextplus.nextmedia.com/news/spot/20180523/588342',
  },
  {
    id: 'breakazine',
    src: '/images/press-logo/breakazine.png',
    link: '/pdf/articles/breakazine.pdf',
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
    const pressId = this.$route.query.press;
    if (pressId) {
      const press = this.presses.find(({ id }) => id === pressId);
      if (press) {
        const element = document.querySelector('#press');
        if (element) element.scrollIntoView();

        if (press.isLightBox) {
          this.$nextTick(() => {
            this.$refs.imageGrid.openLightBox(pressId);
          });
        }
      }
    }
  },
};
</script>

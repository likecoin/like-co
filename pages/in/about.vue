<template>
  <div>
    <section class="lc-container-0">
      <div class="lc-container-1">
        <div class="lc-container-2">
          <header-flag />
        </div>
      </div>
    </section>

    <section class="lc-container-0 lc-header lc-mobile-hide">
      <div class="lc-container-1">
        <div class="underlay gray" />
        <div class="lc-container-2">
          <site-header :isShowAccountButton="true" />
        </div>
      </div>
    </section>

    <hero-video />

    <OfficialChannelList class="lc-margin-vertical-48" />

    <ExchangeList class="lc-margin-vertical-48" />

    <early-adopters class="lc-margin-top-48" />

    <team class="lc-margin-vertical-48" />

  </div>
</template>


<script>
import { mapGetters } from 'vuex';

import SiteHeader from '~/components/header/HeaderWithMenuButton';
import HeroVideo from '~/components/about/HeroVideo';
import HeaderFlag from '~/components/about/Flag';
import EarlyAdopters from '~/components/about/EarlyAdopters';
import ExchangeList from '@/components/home/ExchangeList';
import OfficialChannelList from '@/components/home/OfficialChannelList';
import Team from '~/components/about/Team';

const images = require.context('../../assets/home');
const imgUrl = path => images(`./${path}`);

export default {
  name: 'home',
  layout: 'index',
  components: {
    EarlyAdopters,
    ExchangeList,
    HeaderFlag,
    HeroVideo,
    OfficialChannelList,
    SiteHeader,
    Team,
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getUserIsRegistered',
    ]),
  },
  head() {
    return {
      title: this.$t('TokenSale.button.aboutLikeCoin'),
      meta: [
        {
          hid: 'og_title',
          property: 'og:title',
          content: this.$t('TokenSale.button.aboutLikeCoin'),
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('Home.Flag.content'),
        },
        {
          hid: 'og_description',
          property: 'og:description',
          content: this.$t('Home.Flag.content'),
        },
        {
          hid: 'og_image',
          property: 'og:image',
          content: 'https://like.co/images/og/sale.png',
        },
      ],
    };
  },
  mounted() {
    const { hash } = document.location;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) element.scrollIntoView();
    }
  },
  methods: {
    imgUrl,
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

$carousel-height: 488px;

.lc-community {
  font-size: 20px;

  .lc-community-content {
    display: flex;
    flex-direction: row;

    > div {
      display: flex;
      align-items: center;
      flex-direction: row;

      &.platforms {
        flex: 2;

        > span {
          margin-right: 16px;
        }
      }

      &.faq {
        flex: 1;
        justify-content: center;
      }
    }
  }
}

.cta-section.bottom {
  @media (min-width: 600px) {
    margin-top: 64px;
  }
}

.social-links-container-mobile {
  display: flex;
  justify-content: center;
}

</style>

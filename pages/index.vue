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

    <carousel />

    <section class="lc-container-0">
      <div class="lc-container-1">
        <div class="lc-container-2">
          <div class="lc-container-3">
            <div class="social-links-container-mobile lc-tablet-pc-hide lc-padding-vertical-8">
              <platform-icon-bar />
            </div>
          </div>
        </div>
      </div>
    </section>

    <cta-section />

    <likecoin-stack class="lc-margin-top-32" />

    <road-map class="lc-margin-top-48" />

    <token-distribution class="lc-margin-top-48" />

    <early-adopters class="lc-margin-top-48" />

    <press-coverage class="lc-margin-top-48" />

    <advisors class="lc-margin-top-48" />

    <early-supporters class="lc-margin-top-48" />

    <team class="lc-margin-top-48" />

    <section class="lc-container-0">
      <div class="lc-container-1">
        <div class="lc-container-2">
          <div class="lc-container-3">
            <div class="social-links-container-mobile lc-tablet-pc-hide lc-padding-vertical-12">
              <platform-icon-bar />
            </div>
          </div>
        </div>
      </div>
    </section>

    <cta-section class="bottom" />

    <section class="lc-container-0 lc-community lc-mobile-hide">
      <div class="lc-container-1">
        <div class="lc-container-2">
          <div class="lc-container-3">

            <div class="lc-community-content lc-padding-vertical-24">
              <div class="platforms">
                <span>{{ $t('Home.Community.title') }}</span>
                <platform-icon-bar />
              </div>
              <div class="faq">
                <custom-link
                  :title="$t('Home.Community.button.faq')"
                  href="http://intercom.help/likecoin" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>

    <div class="social-links-container lc-mobile-hide">
      <div class="lc-container-0">
        <div class="lc-container-1">
          <div class="platform-icon-bar-wrapper">
            <div>
              <div>
                <platform-icon-bar :isVertical="true" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
/* global fbq */
import { mapGetters } from 'vuex';

import BlockSection from '~/components/BlockSection';
import CustomLink from '~/components/CustomLink';
import MaterialButton from '~/components/MaterialButton';
import SiteHeader from '~/components/header/HeaderWithMenuButton';
import PlatformIconBar from '~/components/PlatformIconBar';

import Advisors from '~/components/home/Advisors';
import CTASection from '~/components/home/CTASection';
import Carousel from '~/components/home/Carousel';
import HeaderFlag from '~/components/home/Flag';
import EarlyAdopters from '~/components/home/EarlyAdopters';
import EarlySupporters from '~/components/home/EarlySupporters';
import PressCoverage from '~/components/home/PressCoverage';
import LikecoinStack from '~/components/home/Stack';
import RoadMap from '~/components/home/RoadMap';
import Team from '~/components/home/Team';
import TokenDistribution from '~/components/home/TokenDistribution';

const images = require.context('../assets/home');
const imgUrl = path => images(`./${path}`);

export default {
  name: 'home',
  layout: 'defaultWithoutHeader',
  components: {
    Advisors,
    BlockSection,
    Carousel,
    'cta-section': CTASection,
    CustomLink,
    EarlyAdopters,
    EarlySupporters,
    HeaderFlag,
    MaterialButton,
    PlatformIconBar,
    PressCoverage,
    LikecoinStack,
    RoadMap,
    SiteHeader,
    Team,
    TokenDistribution,
  },
  methods: {
    imgUrl,
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getUserIsRegistered',
    ]),
  },
  head() {
    return {
      title: this.$t('Home.Flag.title'),
      meta: [
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
      ],
    };
  },
  mounted() {
    fbq('track', 'ViewContent');

    const { hash } = document.location;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) element.scrollIntoView();
    }
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

$carousel-height: 488px;

.lc-team {
  min-height: 700px;
}

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

.social-links-container {
  position: fixed;
  z-index: 20;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  pointer-events: none;

  .platform-icon-bar-wrapper {
    position: relative;

    height: 100%;

    > div {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;

      > div {
        display: flex;
        align-items: center;

        height: 100%;
        margin-left: 12px;

        @media (max-width: 768px) {
          margin-left: 4px;
        }

        :global(> div) {
          pointer-events: auto;
        }
      }
    }
  }
}

.social-links-container-mobile {
  display: flex;
  justify-content: center;
}

</style>

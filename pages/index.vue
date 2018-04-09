<template>
  <div>
    <section class="lc-container-1">
      <div class="lc-container-2">
        <header-flag />
      </div>
    </section>

    <section class="lc-container-1 lc-header lc-mobile-hide">
      <div class="underlay gray" />
      <div class="lc-container-2">
        <site-header :isShowAccountButton="true" />
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

    <token-distribution />

    <early-adopters />

    <press-coverage />

    <!-- <section class="lc-container-1 lc-backer">
      <div class="lc-container-2">
        <block-section
          :title="$t('Home.Backers.title')">
        </block-section/>
      </div>
    </section> -->

    <advisors />

    <early-supporters />

    <team />

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

    <section class="lc-container-1 lc-community lc-mobile-hide">
      <div class="lc-container-2">
        <div class="lc-container-3">
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

.lc-header {
  position: relative;
}

.lc-description {
  &:not(.last) {
    margin-bottom: 24px;
    padding-bottom: 24px;
  }

  .lc-container-3 {
    display: flex;
    flex-direction: row;
  }

  .sale-description-container {
    position: relative;
    flex: 2;

    padding: 24px 8px;

    h1 {
      margin: 8px 0 32px;
    }

    h2 {
      font-size: 42px;
      font-weight: 600;
    }

    .links {
      > a {
        margin-right: 48px;

        color: $like-green !important;
        text-decoration: underline;
        cursor: pointer;
        font-size: 20px;

        &:hover {
          opacity: 0.7;
        }
      }
    }
  }

  .btn-container {
    display: flex;
    align-items: center;
    flex: 1;

    .redeem-btn {
    	background-image: linear-gradient(73deg, #3c286e, #6e2828);

    	&.festive {
        background-image: linear-gradient(73deg, #812d4c, #f75353);
      }
    }
  }
}

.lc-community {
  margin-top: 24px;
  padding-bottom: 64px;

  font-size: 20px;

  .lc-container-3 {
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

.md-button {
  width: 100%;
  height: auto;

  border-radius: 0;

  color: $like-white;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);

  font-size: 24px;
  line-height: 32px;

  :global(.md-ripple) {
    padding: 8px;

    :global(.md-button-content) > a {
      color: $like-white;
      text-decoration: none;
    }
  }
}

@media (min-width: 601px) {
  .lc-partner {
    margin-top: 94px;
  }

  .lc-backer,
  .lc-advisor,
  .lc-team {
    margin-top: 12px;
    padding-top: 36px;
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

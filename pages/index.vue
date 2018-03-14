<template>
  <div>
    <section class="lc-container-1">
      <div class="lc-container-2">
        <header-flag />
      </div>
    </section>

    <section class="lc-container-1 lc-header">
      <div class="underlay gray md-xsmall-hide" />
      <div class="lc-container-2">
        <site-header />
      </div>
    </section>

    <carousel />

    <cta-section />

    <protocol />

    <road-map />

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

    <section class="lc-container-1 lc-team" id="team">
      <div class="lc-container-2">
        <block-section
          :title="$t('Home.Team.title')">
          <team />
        </block-section/>
      </div>
    </section>

    <div class="platform-bar md-xsmall-show">
      <platform-icon-bar />
    </div>

    <cta-section class="bottom" />

    <section class="lc-container-1 lc-community md-xsmall-hide">
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
  </div>
</template>

<script>
/* global fbq */
import { mapGetters } from 'vuex';

import BlockSection from '~/components/BlockSection';
import CustomLink from '~/components/CustomLink';
import MaterialButton from '~/components/MaterialButton';
import SiteHeader from '~/components/header/Header';
import PlatformIconBar from '~/components/PlatformIconBar';

import Advisors from '~/components/home/Advisors';
import CTASection from '~/components/home/CTASection';
import Carousel from '~/components/home/Carousel';
import HeaderFlag from '~/components/home/Flag';
import EarlyAdopters from '~/components/home/EarlyAdopters';
import EarlySupporters from '~/components/home/EarlySupporters';
import PressCoverage from '~/components/home/PressCoverage';
import Protocol from '~/components/home/Protocol';
import RoadMap from '~/components/home/RoadMap';
import Team from '~/components/home/Team';
import TokenDistribution from '~/components/home/TokenDistribution';

const images = require.context('../assets/home');
const imgUrl = path => images(`./${path}`);

export default {
  name: 'home',
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
    Protocol,
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
@import "../assets/index";

$carousel-height: 488px;

.lc-header {
  position: relative;
}

.lc-team {
  min-height: 700px;
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
  margin-top: 66px;
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

@media (max-width: 600px) {
  body {
    .platform-bar {
      margin: 12px;
      > .icon-bar {
        justify-content: center;
      }
    }
  }
}

</style>

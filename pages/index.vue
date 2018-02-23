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
        <div class="lc-container-3 md-xsmall-hide">
          <md-button class="account-btn" @click="$router.push({ name: getUserIsRegistered ? 'edit' : 'register' })">
            {{ getUserIsRegistered ? getUserInfo.user : $t('Home.Header.button.signUp') }}
          </md-button>
        </div>
      </div>
    </section>

    <carousel />

    <section class="lc-container-1 lc-description">
      <div class="underlay gradient" />
      <div class="lc-container-2">
        <div class="lc-container-3">
          <div class="sale-description-container">
            <h2>{{ $t('Home.Sale.title') }}</h2>
            <h1>{{ $t('Home.Sale.content') }}</h1>
            <!-- <div class="links md-xsmall-hide">
              <custom-link
                :title="$t('Home.Sale.button.paper')"
                href="hi" />
              <custom-link
                :title="$t('Home.Sale.button.onePage')"
                href="hi" />
            </div> -->
            <!-- <div class="links md-xsmall-show">
              <md-button class="redeem-btn festive">
                {{ $t('Home.Sale.button.paper') }}
              </md-button>
              <md-button class="redeem-btn festive">
                {{ $t('Home.Sale.button.onePage') }}
              </md-button>
            </div> -->
          </div>
          <div class="btn-container md-xsmall-hide">
            <md-button class="redeem-btn festive" @click=onRedeemClick>
              {{ $t('Home.Sale.button.redeem') }}
            </md-button>
          </div>
        </div>
      </div>
    </section>

    <protocol />

    <road-map />

    <token-distribution />

    <press-coverage />

    <!-- <partners /> -->

    <!-- <section class="lc-container-1 lc-backer">
      <div class="lc-container-2">
        <block-section
          :title="$t('Home.Backers.title')">
        </block-section/>
      </div>
    </section> -->

    <!-- <section class="lc-container-1 lc-advisor">
      <div class="lc-container-2">
        <block-section
          :title="$t('Home.Advisor.title')">
          <team />
        </block-section/>
      </div>
    </section> -->

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

    <section class="lc-container-1 lc-description last">
      <div class="underlay gradient" />
      <div class="lc-container-2">
        <div class="lc-container-3">
          <div class="sale-description-container">
            <h2>{{ $t('Home.Sale.title') }}</h2>
            <h1>{{ $t('Home.Sale.content') }}</h1>
            <div class="md-xsmall-hide">
              <custom-link
                :title="$t('Home.Sale.button.createID')"
                href="register" />
            </div>
          </div>
          <div class="btn-container md-xsmall-hide">
            <md-button class="redeem-btn" @click="$router.push({ name: 'register' })">
              {{ $t('Home.Sale.button.createNow') }}
            </md-button>
          </div>
        </div>
      </div>
    </section>

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
import SiteHeader from '~/components/header/Header';
import PlatformIconBar from '~/components/PlatformIconBar';

import Carousel from '~/components/home/Carousel';
import HeaderFlag from '~/components/home/Flag';
import Partners from '~/components/home/Partners';
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
    BlockSection,
    Carousel,
    CustomLink,
    HeaderFlag,
    Partners,
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
    onRedeemClick() {
      if (this.$ga) this.$ga.event('RegFlow', 'ClickGetRedPocket', 'click 領取紅包 on homepage', 1);
      this.$router.push({ name: 'redeem' });
    },
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
.underlay {
  position: absolute;
  z-index: -1;
  top: 0;

  width: 66.66%;
  height: 100%;
}

.lc-header {
  position: relative;

  .underlay.gray {
    background-color: $like-gray-1;
  }

  .account-btn {
    position: absolute;
    z-index: 2;
    right: 8px;
    bottom: -16px;

    width: 188px;

    color: $like-white;
    background-color: $like-green;
  	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);

    font-size: 18px;

    > :global(.md-ripple) {
      padding: 0;
    }
  }
}

.lc-description {
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
      .custom-link {
        margin-right: 48px;
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
  .lc-description {
    &.last {
      margin-top: 48px;
    }
    .underlay.gradient {
      background-image: linear-gradient(271deg, $like-light-blue, $like-gradient-1);
    }
  }

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
    .lc-description {
      &.last {
        .sale-description-container {
          padding: 18px 0;

          h1 {
            margin-bottom: 0;
          }
        }
      }
      .underlay.gradient {
        background-color: $like-green;
        width: 100%;
      }

      .sale-description-container {
        text-align: center;

        padding-bottom: 0;

        h1, h2 {
          color: $like-white;
          font-size: 26px;
          line-height: 30px;
        }

        .links {
          position: absolute;
          width: 100%;
        }

        .md-button {
        	background-image: linear-gradient(73deg, $like-gradient-2, $like-gradient-3);

          margin: 4px 0;
        }
      }
    }

    .platform-bar {
      margin: 12px;
      > .icon-bar {
        justify-content: center;
      }
    }
  }
}

</style>

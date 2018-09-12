<template>
  <div class="home-page">
    <template v-if="!isMobileSize">
      <section class="lc-container-0 lc-header lc-mobile-hide">
        <div class="lc-container-1">
          <div class="home-page__header-underlay" />
          <div class="lc-container-2">
            <site-header />
          </div>
        </div>
      </section>

      <section class="lc-container-0 lc-mobile-hide">
        <div class="lc-container-1">
          <home-banner />
        </div>
      </section>
    </template>

    <section class="lc-container-0 home-page__like-button-details">
      <div class="lc-container-1">
        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1 lc-container-no-padding-mobile">
            <div class="lc-flex lc-flex-direction-column-mobile">
              <like-button-demo
                @popup="openContentCivicPopup"
              />

              <platform-icon-bar
                class="lc-mobile-show"
                size="medium"
              />
              <content-civics-cta
                class="lc-margin-top-16 lc-container-3 lc-mobile-show"
              />

              <reward-statistics />
            </div>

            <div class="lc-container-4">
              <mansory-article-list
                class="lc-margin-top-24 lc-mobile"
              />
            </div>
          </div>

          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-padding-vertical-40 lc-mobile">
              <content-civics-cta />
            </div>
          </div>
        </div>
      </div>
    </section>

    <platform-coverage />

    <section class="lc-container-0">
      <div class="lc-container-1">
        <footer class="lc-page-footer lc-bg-green">
          <platform-icon-bar
            :size="isMobileSize ? 'medium' : 'large'"
          />

          <div class="lc-container-2">
            <div
              :class="[
                'lc-container-3',
                'lc-padding-bottom-24',
                'lc-padding-top-64',
                'lc-mobile',
              ]"
            >
              <span class="home-page__join-label">
                {{ $t('Home.Footer.label.join') }}
              </span>
            </div>
          </div>
        </footer>
      </div>
    </section>

    <like-button-dialog
      :is-show.sync="isContentCivicDialogOpen"
    />

  </div>
</template>


<script>
import { mapGetters, mapActions } from 'vuex';

import ArticleDialog from '@/components/dialogs/ArticleDialog';
import ContentCivicsCta from '@/components/home/ContentCivicsCTA';
import HeaderFlag from '@/components/about/Flag';
import HomeBanner from '@/components/home/Banner';
import LikeButtonDemo from '@/components/home/LikeButtonDemo';
import LikeButtonDialog from '@/components/dialogs/LikeButtonDialog';
import MansoryArticleList from '@/components/home/MansoryArticleList';
import PlatformCoverage from '@/components/home/PlatformCoverage';
import PlatformIconBar from '@/components/PlatformIconBar';
import SiteHeader from '@/components/header/HomeHeader';
import RewardStatistics from '@/components/home/RewardStatistics';

import breakpointMixin from '@/util/mixins/breakpoint';

export default {
  name: 'home',
  layout: 'index',
  components: {
    ArticleDialog,
    ContentCivicsCta,
    HeaderFlag,
    HomeBanner,
    LikeButtonDemo,
    LikeButtonDialog,
    MansoryArticleList,
    PlatformCoverage,
    PlatformIconBar,
    RewardStatistics,
    SiteHeader,
  },
  mixins: [breakpointMixin],
  data() {
    return {
      isContentCivicDialogOpen: false,
    };
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getUserIsRegistered',
      'getLikeCoinUsdNumericPrice',
    ]),
    isMobileSize() {
      return this.breakpoint.name === 'xs';
    },
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
        {
          hid: 'og_image',
          property: 'og:image',
          content: 'https://like.co/images/og/sale.png',
        },
      ],
    };
  },
  mounted() {
    if (window.fbq) window.fbq('track', 'ViewContent');

    this.queryLikeCoinUsdPrice();
  },
  methods: {
    ...mapActions([
      'queryLikeCoinUsdPrice',
    ]),
    openContentCivicPopup() {
      this.isContentCivicDialogOpen = true;
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.lc-header {
  border-bottom: 2px solid $like-green;
}

.icon-bar {
  &.vertical {
    :global(svg) {
      width: 36px !important;
      height: 36px !important;
    }
  }

  @media (max-width: 600px) {
    max-width: unset;

    :global(svg) {
      width: 36px !important;
      height: 36px !important;
    }
  }

  :global(.md-icon-button) {
    @media (max-width: 600px) {
      margin: 0 6px !important;
    }
  }
}

.home-page {
  &__header-underlay {
    position: absolute;
    right: 0;

    width: 33%;
    height: 100%;

    background-image: linear-gradient(55deg, $like-light-blue, $like-gradient-1);
  }

  &__like-button-details {
    @media (min-width: 600px + 1px) {
      margin-top: -64px;
    }

    .icon-bar {
      padding: 8px 0 !important;

      background-color: white;
    }
  }

  &__join-label {
    color: #D7ECEC;
  }

  .reward-statistics {
    flex: 1;

    padding: 32px 8px 16px 0;

    @media (max-width: 600px) {
      padding-right: 16px;
      padding-left: 16px;
    }
  }

  .mansory-article-list {
    @media (min-width: 600px + 1px) {
      padding: 0 12px;
    }
  }
}

footer {
  position: relative;

  margin-top: 96px;

  color: $like-white;
  border: none;

  .icon-bar {
    position: absolute;
    z-index: 1;
    top: -32px;
    right: 0;
    left: 0;

    @media (max-width: 600px) {
      top: -20px;
    }
  }
}
</style>

<template>
  <div class="home-page">
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

    <section class="lc-container-0 lc-mobile-show">
      <div class="lc-container-1">
        <home-mobile-header />
      </div>
    </section>

    <section class="lc-container-0 home-page__like-button-details">
      <div class="lc-container-1">
        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1 lc-container-no-padding-mobile">
            <div class="lc-flex lc-flex-direction-column-mobile">
              <like-button-demo
                @popup="openContentCivicPopup"
              />

              <div class="lc-flex lc-justify-content-center lc-flex-grow-1">
                <reward-statistics
                  :screen-width="breakpoint.width"
                />
              </div>

              <platform-icon-bar
                class="lc-mobile-show lc-margin-bottom-"
                size="medium"
              />
            </div>

            <div class="lc-container-4">
              <mansory-article-list
                class="lc-margin-vertical-24 lc-mobile"
              />
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
            v-scroll-reveal.reset="{
              duration: 0,
              beforeReveal: () => onBottomPlatformBarVisibilityChange(true),
              beforeReset: () => onBottomPlatformBarVisibilityChange(false),
            }"
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

    <article-dialog
      :is-show.sync="isLikeButtonIntroDialogOpen"
      :is-center="false"
    >
      <like-button-intro
        class="lc-margin-top-32 lc-mobile"
      />
    </article-dialog>

  </div>
</template>


<script>
import { mapGetters, mapActions } from 'vuex';

import ArticleDialog from '@/components/dialogs/ArticleDialog';
import HomeBanner from '@/components/home/Banner';
import HomeMobileHeader from '@/components/home/MobileHeader';
import LikeButtonDemo from '@/components/home/LikeButtonDemo';
import LikeButtonIntro from '@/components/LikeButtonIntro';
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
    HomeBanner,
    HomeMobileHeader,
    LikeButtonDemo,
    LikeButtonIntro,
    MansoryArticleList,
    PlatformCoverage,
    PlatformIconBar,
    RewardStatistics,
    SiteHeader,
  },
  mixins: [breakpointMixin],
  data() {
    return {
      isLikeButtonIntroDialogOpen: false,
    };
  },
  asyncData({ query, redirect }) {
    if (query.press) {
      redirect(302, { name: 'in-about' }, query);
    }
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
          hid: 'og_title',
          property: 'og:title',
          content: this.$t('Home.Flag.title'),
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
  created() {
    this.queryLikeCoinUsdPrice();
  },
  mounted() {
    if (window.fbq) window.fbq('track', 'ViewContent');
  },
  methods: {
    ...mapActions([
      'queryLikeCoinUsdPrice',
    ]),
    openContentCivicPopup() {
      this.isLikeButtonIntroDialogOpen = true;
    },
    onBottomPlatformBarVisibilityChange(isVisible) {
      const verticalPlatformBar = document.querySelector('.icon-bar.vertical');
      if (!verticalPlatformBar) return;
      if (isVisible) {
        verticalPlatformBar.classList.add('hide');
      } else {
        verticalPlatformBar.classList.remove('hide');
      }
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.icon-bar {
  &.vertical {
    :global(svg) {
      width: 36px !important;
      height: 36px !important;
    }
  }

  @media (max-width: 600px) {
    max-width: unset;
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
      margin-top: -24px;
    }

    .icon-bar {
      padding: 8px 0 !important;

      background-color: $like-white;
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

  border: none;

  &.lc-page-footer {
    margin-top: 96px;
  }

  .icon-bar {
    position: absolute;
    z-index: 1;
    top: -32px;
    right: 0;
    left: 0;

    @media (max-width: 600px) {
      top: -20px;

      :global(.md-ripple) {
        padding: 0;
      }

      :global(.md-icon-button) {
        width: 40px !important;
        min-width: unset;
        height: 40px !important;
      }
    }
  }
}
</style>

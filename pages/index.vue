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
              <!-- !! Uncomment when content civics is ready !! -->
              <!-- <content-civics-cta
                class="lc-margin-top-16 lc-container-3 lc-mobile-show"
              /> -->
              <!-- !! Uncomment when content civics is ready !! -->

              <div class="lc-flex lc-justify-content-center lc-flex-grow-1">
                <reward-statistics
                  :is-large-size="breakpoint.width > 1240"
                />
              </div>
            </div>

            <div class="lc-container-4">
              <mansory-article-list
                class="lc-margin-vertical-24 lc-mobile"
              />
            </div>
          </div>

          <!-- !! Uncomment when content civics is ready !! -->
          <!-- <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-padding-vertical-40 lc-mobile">
              <content-civics-cta />
            </div>
          </div> -->
          <!-- !! Uncomment when content civics is ready !! -->
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
// import ContentCivicsCta from '@/components/home/ContentCivicsCTA';
import HeaderFlag from '@/components/about/Flag';
import HomeBanner from '@/components/home/Banner';
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
    // ContentCivicsCta,
    HeaderFlag,
    HomeBanner,
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
      this.isLikeButtonIntroDialogOpen = true;
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
      margin-top: -24px;
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

  color: $like-white;
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
    }
  }
}
</style>

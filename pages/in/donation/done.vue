<template>
  <section class="donation-done-page">
    <transition name="lc-transition-fade">
      <div
        v-if="error"
        class="lc-text-align-center lc-margin-top-24 lc-font-size-32"
      >{{ error.message }}</div>
      <div
        v-else-if="hasFetchedSubscriptionInfo"
        class="lc-container-1"
      >
        <div class="lc-container-2">
          <div
            :class="[
              'lc-container-3',
              'lc-bg-like-gradient',
              'lc-padding-top-24',
              'lc-padding-bottom-32',
            ]"
          >
            <div
              class="lc-flex lc-flex-direction-column lc-align-items-center"
            >
              <div class="donation-done-page__header-avatar">
                <img
                  :src="getUserInfo.avatar"
                >
              </div>
              <h2 class="lc-margin-top-8 lc-text-align-center">
                {{ $t('Donation.label.thanks') }}
              </h2>
            </div>
          </div>
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="donation-done-page__content">
              <p class="lc-font-size-16 lc-line-height-1_5">
                {{ $t('Donation.label.hiUser', { user: getUserInfo.displayName }) }}
                <br>
                {{ $t('Donation.label.thanksForJoining') }}
                <br><br>
                {{ $t('Donation.label.buildPlaceForYou') }}
              </p>

              <h2 class="donation-done-page__headline">
                {{ $t('Donation.label.readAndAppreciate') }}
              </h2>
            </div>
          </div>

          <div class="lc-container-3 lc-container-no-padding-mobile lc-bg-gray-1">
            <div class="lc-container-4 lc-padding-bottom-32">
              <div>
                <mansory-article-list
                  :num-articles-display="numArticlesDisplay"
                  class="lc-padding-bottom-48 lc-mobile"
                />

                <div class="lc-text-align-center">
                  <md-button
                    :to="{ name: 'index' }"
                    class="md-likecoin outline"
                  >{{ $t('Donation.button.more') }}</md-button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div v-else />
    </transition>

    <page-blocker
      ref="pageBlocker"
    />
  </section>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

import MansoryArticleList from '@/components/home/MansoryArticleList';
import PageBlocker from '@/components/PageBlocker';
import UserAvatar from '@/components/UserAvatar';

import breakpointMixin from '@/util/mixins/breakpoint';

const NUM_ARTICLES_DISPLAY_IN_LARGE_SCREEN = 6;
const NUM_ARTICLES_DISPLAY_IN_SMALL_SCREEN = 4;

export default {
  name: 'donation-done-page',
  components: {
    MansoryArticleList,
    PageBlocker,
    UserAvatar,
  },
  mixins: [breakpointMixin],
  data() {
    return {
      hasFetchedSubscriptionInfo: false,
      subscriptionInfo: {},
      error: null,
    };
  },
  computed: {
    ...mapGetters([
      'getUserIsRegistered',
      'getUserInfo',
      'getUserId',
    ]),
    numArticlesDisplay() {
      return !this.breakpoint.lgAndUp
        ? NUM_ARTICLES_DISPLAY_IN_SMALL_SCREEN
        : NUM_ARTICLES_DISPLAY_IN_LARGE_SCREEN;
    },
  },
  watch: {
    getUserId(id) {
      this.fetchSubscriptionInfo(id);
    },
  },
  mounted() {
    this.$refs.pageBlocker.start();
    this.fetchSubscriptionInfo(this.getUserId);
  },
  methods: {
    ...mapActions([
      'fetchUserSubscriptionInfo',
    ]),
    async fetchSubscriptionInfo(userId) {
      if (!userId) return;
      try {
        this.subscriptionInfo = await this.fetchUserSubscriptionInfo(userId);
      } catch (error) {
        this.error = error;
      } finally {
        this.$refs.pageBlocker.finish();
        this.hasFetchedSubscriptionInfo = true;
      }
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.donation-done-page {
  &__header {
    &-avatar {
      width: 128px;
      height: 128px;
      padding: 4px;

      border: 4px solid $like-green;
      border-radius: 50%;

      img {
        width: 100%;
        height: 100%;

        border-radius: 50%;

        object-fit: cover;
      }
    }
  }

  &__content {
    padding-top: 32px;

    color: $like-gray-5;

    @media (min-width: 600px + 1px) {
      padding: 44px 108px 32px;
    }
  }

  &__headline {
    margin: 32px 0;

    text-align: center;

    @media (min-width: 600px + 1px) {
      margin-top: 80px;
    }
  }
}
</style>

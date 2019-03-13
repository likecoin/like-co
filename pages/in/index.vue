<template>
  <div class="overview-page">

    <!-- Civic Liker CTA Section -->
    <section class="lc-container-0 lc-margin-top-16 lc-mobile-hide">
      <div class="lc-container-1">
        <div class="lc-container-2">
          <div
            v-if="getUserInfo.isCivicLikerRenewalPeriod"
            class="lc-container-3"
          >
            <div class="lc-container-4">
              <civic-liker-cta
                class="lc-padding-top-24-mobile"
                layout="wide"
              />
            </div>
          </div>
          <civic-liker-cta
            v-else
            class="lc-padding-top-24-mobile"
            layout="wide"
          />
        </div>
      </div>
    </section>

    <template v-if="!isEmailVerified">
      <section class="lc-container-0 lc-margin-top-48">
        <div class="lc-container-1">
          <div class="lc-container-2">
            <verify-email-cta :email-ref="'in'" />
          </div>
        </div>
      </section>
    </template>

    <!-- Show below if email is verified-->
    <template v-else>
      <section class="lc-container-0 lc-margin-top-48">
        <div class="lc-container-1">
          <div class="lc-container-2">
            <div class="lc-container-3">
              <div class="lc-container-4">
                <like-button-intro-min />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="lc-container-0 lc-margin-top-48">
        <!-- LikeCoin Bonus Overview -->
        <div
          v-if="isWallet"
          id="earn"
          class="lc-container-1 bonus-container"
        >
          <div class="lc-container-header">
            <div class="lc-container-2 lc-container-header-overlay">
              <div class="lc-container-3 lc-bg-gray-1" />
            </div>
            <div class="lc-container-2">
              <div class="lc-container-3">
                <div class="lc-container-4">
                  <div class="lc-container-header-title">
                    <h1 class="lc-font-size-32 lc-mobile">
                      {{ $t('BonusPage.title') }}
                    </h1>
                    <div
                      v-if="getIsFetchedMissions"
                      class="lc-container-header-button-wrapper lc-mobile-hide"
                    >
                      <refresh-button
                        :is-refreshing="getIsFetchingMissions"
                        @click="refreshMissions"
                      />
                    </div>
                  </div>
                  <md-button
                    class="md-likecoin lc-container-header-button lc-font-size-20"
                    @click="$router.push({ name: 'in-bonus' })"
                  >
                    {{ $t('BonusPage.button.moreBonus') }}
                  </md-button>
                </div>
              </div>
            </div>
          </div>
          <div class="lc-container-2">

            <div class="lc-padding-top-32 lc-bg-gray-1">
              <mission-list
                :missions="getShortMissionList"
                :is-grid="false"
                :is-loading="getIsFetchingMissions || !getIsFetchedMissions"
                @click="onMissionClick"
              />
            </div>

            <div class="lc-container-3 lc-padding-top-24 lc-bg-gray-1">
              <div class="lc-container-4">
                <div class="section-btn-container bonus-button-container lc-padding-bottom-32">
                  <md-button
                    class="section-button md-likecoin"
                    @click="$router.push({ name: 'in-bonus' })"
                  >
                    {{ $t('BonusPage.button.moreBonus') }}
                  </md-button>
                </div>
              </div>
            </div>

          </div>

          <div class="lc-container-2 lc-mobile-show lc-margin-top-16 lc-margin-bottom-32">
            <div class="lc-container-3 lc-flex lc-justify-content-center">
              <refresh-button
                :is-refreshing="getIsFetchingMissions"
                :is-outline="true"
                @click="updateInfo"
              />
            </div>
          </div>
        </div>

        <div class="lc-container-1 lc-margin-top-16">
          <div class="lc-container-2">
            <div
              class="
                lc-container-3
                lc-bg-gray-1
                lc-container-no-padding-mobile
                lc-padding-bottom-32"
            >
              <div
                class="
                  lc-container-4
                  lc-font-size-32
                  lc-font-weight-300
                  lc-mobile
                  lc-padding-top-24"
              >
                {{ $t('In.mansory.title') }}
                <!-- TODO: Temp hide refresh button until query updates
                <div
                  class="lc-container-header-button-wrapper lc-mobile-hide lc-padding-top-24"
                >
                  <refresh-button
                    :is-refreshing="isFetchingLikeSuggestion"
                    @click="refreshLikeSuggestion"
                  />
                </div>
                -->
              </div>
              <div class="lc-container-4">
                <mansory-article-list
                  class="lc-margin-vertical-24 lc-mobile"
                />
              </div>
              <div class="lc-font-size-12 lc-font-weight-300 lc-text-align-center">
                {{ $t('In.mansory.description') }}
                <br>
                <nuxt-link :to="{ name: 'in-earn' }">
                  {{ $t('In.mansory.descriptionCTA') }}
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>

        <!-- TODO: LikeButton Adopter
        <div class="lc-container-1 lc-margin-top-16">
          <div class="lc-container-2">
            <div
              class="
                lc-container-3
                lc-bg-gray-1
                lc-container-no-padding-mobile
              "
            >
              <div class="lc-flex">
                <div
                  class="
                    lc-container-4
                    lc-font-size-32
                    lc-font-weight-300
                    lc-mobile
                    lc-padding-top-24
                    in-button-adopter__title
                  "
                >
                  {{ $t('In.likeButtonAdopter.title') }}
                </div>
                <div
                  class="
                    lc-font-size-12
                    lc-font-weight-300
                    lc-padding-top-24
                    lc-margin-top-16
                    in-button-adopter__cta
                  "
                >
                  <nuxt-link :to="{ name: 'in-earn' }">
                    {{ $t('In.likeButtonAdopter.descriptionCTA') }}
                  </nuxt-link>
                </div>
              </div>
              <like-button-adopter />
            </div>

          </div>
        </div>
        -->

      </section>

    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import MissionList from '@/components/Mission/List';
import RefreshButton from '~/components/RefreshButton';
import LikeButtonIntroMin from '~/components/LikeButtonIntroMin';
import MansoryArticleList from '~/components/home/MansoryArticleList';
// import LikeButtonAdopter from '~/components/LikeButtonAdopter';
import CivicLikerCta from '~/components/CivicLiker/CTA';
import VerifyEmailCta from '~/components/VerifyEmailCta';

import EditIcon from '@/assets/icons/edit.svg';
import EditWhiteIcon from '@/assets/icons/edit-white.svg';
import TickIcon from '@/assets/tokensale/tick.svg';


export default {
  name: 'in',
  layout: 'in',
  components: {
    MissionList,
    RefreshButton,
    LikeButtonIntroMin,
    MansoryArticleList,
    // LikeButtonAdopter,
    CivicLikerCta,
    VerifyEmailCta,
  },
  data() {
    return {
      EditIcon,
      EditWhiteIcon,
      TickIcon,
      freeCoupon: '',
      isFetchingLikeSuggestion: false,
    };
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getIsPopupBlocking',
      'getIsFetchingMissions',
      'getIsFetchedMissions',
      'getUserNeedAuth',
      'getUserIsRegistered',
      'getShortMissionList',
    ]),
    wallet() {
      return this.getUserInfo.wallet;
    },
    isWallet() {
      return !!this.wallet;
    },
    isEmailVerified() {
      return this.getUserInfo.isEmailVerified;
    },
  },
  head() {
    return {
      meta: [
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
    if (this.getUserIsRegistered) {
      this.updateInfo();
    }
  },
  methods: {
    ...mapActions([
      'setInfoMsg',
      'checkCoupon',
      'sendVerifyEmail',
      'sendCouponCodeEmail',
      'refreshUserInfo',
      'fetchUserReferralStats',
      'refreshMissionList',
      'onMissionClick',
      'fetchLikeSuggestionList',
      'fetchSocialListDetailsById',
    ]),
    refreshMissions() {
      this.refreshMissionList(this.getUserInfo.user);
    },
    updateInfo() {
      this.refreshMissions();
      this.fetchSocialListDetailsById(this.getUserInfo.user);
    },
    async refreshLikeSuggestion() {
      this.isFetchingLikeSuggestion = true;
      await this.fetchLikeSuggestionList();
      this.isFetchingLikeSuggestion = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

.section-redeem-edit-mode {
  opacity: .3;
}

.section-btn-container {
  text-align: center;

  @media (min-width: 768 + 1px) {
    text-align: right;

    .bonus-container & {
      text-align: center;
    }

    .section-button {
      width: calc(33.33% - 16px);
    }
  }

}

.bonus-container {
  .bonus-button-container {
    @media (min-width: 960 + 1px) {
      display: none;
    }
  }
}

.in-button-adopter {
  &__title {
    flex: 1;
  }
  &__cta {
    flex: 1;

    text-align: right;
  }
}
</style>

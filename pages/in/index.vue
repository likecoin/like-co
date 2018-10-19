<template>
  <div class="overview-page">

    <div
      v-if="isWallet && isEmailVerified"
      id="earn"
      class="bonus-container lc-container-0 lc-margin-top-48"
    >
      <section class="lc-container-1">
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
      </section>
    </div>

    <transaction-history
      v-if="isWallet && isEmailVerified"
      id="transaction"
      ref="txHistory"
      :address="wallet"
      :is-fetching.sync="isFetchingTranscationHistory"
      class="lc-margin-top-48 lc-mobile"
    />

    <!-- !! UI for user without wallet !! -->
    <section
      v-if="isEmailVerified"
      class="lc-container-0"
    >
      <div class="lc-container-1">
        <div class="lc-container-2">
          <div class="lc-container-3">
            <div class="lc-container-4">
              <like-button-intro-min
                v-if="!isWallet"
              />
            </div>
          </div>

          <div
            v-if="!isWallet"
            class="
              lc-container-3
              lc-bg-gray-1
              lc-container-no-padding-mobile
              lc-margin-top-32
              lc-padding-bottom-8"
          >
            <div
              class="lc-container-4 lc-font-size-32 lc-font-weight-300 lc-mobile lc-padding-top-24"
            >
              {{ $t('In.mansory.title') }}
              <div
                class="lc-container-header-button-wrapper lc-mobile-hide lc-padding-top-24"
              >
                <refresh-button
                  :is-refreshing="isFetchingLikeSuggestion"
                  @click="refreshLikeSuggestion"
                />
              </div>
            </div>
            <div class="lc-container-4">
              <mansory-article-list
                class="lc-margin-vertical-24 lc-mobile"
              />
            </div>
            <div class="lc-font-size-12 lc-font-weight-300 lc-text-align-center">
              {{ $t('In.mansory.description') }}
              <br>
              <a href="../earn"> {{ $t('In.mansory.descriptionCTA') }} </a>
            </div>
          </div>

          <div
            v-if="!isWallet"
            class="
              lc-container-3
              lc-bg-gray-1
              lc-container-no-padding-mobile
              lc-margin-top-32
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
                  in-button-adopter__cta
                "
              >
                <a href="../earn"> {{ $t('In.likeButtonAdopter.descriptionCTA') }} </a>
              </div>
            </div>
            <like-button-adopter />
          </div>

          <!-- TODO: Temp hide before civic liker release
          <div
            v-if="!isWallet"
            class="lc-margin-top-32"
          >
            <civic-liker-cta />
          </div>
          -->
        </div>
      </div>
    </section>
    <!-- !! UI for user without wallet !! -->

    <div
      v-if="isEmailVerified"
      class="lc-container-0 lc-margin-top-24 lc-mobile-show"
    >
      <div class="lc-container-1">
        <div class="lc-container-2">
          <div class="lc-container-3 lc-flex lc-justify-content-center">
            <refresh-button
              :is-refreshing="getIsFetchingMissions || isFetchingTranscationHistory"
              :is-outline="true"
              @click="updateInfo"
            />
          </div>
        </div>
      </div>
    </div>

    <view-etherscan
      v-if="isWallet && isEmailVerified"
      :address="wallet"
    />

    <div
      v-if="!isEmailVerified"
      class="lc-container-0 lc-margin-top-24"
    >
      <div class="lc-container-1">
        <div class="lc-container-2">
          <verify-email-cta
            :email-ref="'in'"
          />
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import MissionList from '@/components/Mission/List';
import TransactionHistory from '~/components/TransactionHistory';
import RefreshButton from '~/components/RefreshButton';
import ViewEtherscan from '~/components/ViewEtherscan';
import LikeButtonIntroMin from '~/components/LikeButtonIntroMin';
import MansoryArticleList from '~/components/home/MansoryArticleList';
import LikeButtonAdopter from '~/components/LikeButtonAdopter';
import CivicLikerCta from '~/components/CivicLikerCta';
import VerifyEmailCta from '~/components/VerifyEmailCta';

import EditIcon from '@/assets/icons/edit.svg';
import EditWhiteIcon from '@/assets/icons/edit-white.svg';
import TickIcon from '@/assets/tokensale/tick.svg';


export default {
  name: 'in',
  layout: 'in',
  components: {
    MissionList,
    TransactionHistory,
    RefreshButton,
    ViewEtherscan,
    LikeButtonIntroMin,
    MansoryArticleList,
    LikeButtonAdopter,
    CivicLikerCta,
    VerifyEmailCta,
  },
  data() {
    return {
      wallet: '',
      EditIcon,
      EditWhiteIcon,
      TickIcon,
      freeCoupon: '',
      isFetchingTranscationHistory: false,
      isFetchingLikeSuggestion: false,
    };
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getIsPopupBlocking',
      'getCurrentLocale',
      'getIsFetchingMissions',
      'getIsFetchedMissions',
      'getUserNeedAuth',
      'getUserIsRegistered',
      'getShortMissionList',
    ]),
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
    ]),
    refreshMissions() {
      this.refreshMissionList(this.getUserInfo.user);
    },
    updateInfo() {
      const user = this.getUserInfo;
      this.wallet = user.wallet;
      if (this.$refs.txHistory) this.$refs.txHistory.updateTokenSaleHistory();
      this.refreshMissions();
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

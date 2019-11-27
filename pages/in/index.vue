<template>
  <div class="overview-page">
    <template v-if="!isEmailVerified">
      <section class="lc-container-0 lc-margin-top-48">
        <div class="lc-container-1">
          <div class="lc-container-2">
            <verify-email-cta :email-ref="'in'" />
          </div>
        </div>
      </section>
    </template>
    <section class="lc-container-0 lc-margin-top-48">
      <div class="lc-container-1">
        <div class="lc-container-2">
          <AppBanner />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import AppBanner from '~/components/AppBanner';
import VerifyEmailCta from '~/components/VerifyEmailCta';

import EditIcon from '@/assets/icons/edit.svg';
import EditWhiteIcon from '@/assets/icons/edit-white.svg';
import TickIcon from '@/assets/tokensale/tick.svg';


export default {
  name: 'in',
  layout: 'in',
  components: {
    AppBanner,
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
      'getUserHasWallet',
      'getIsPopupBlocking',
      'getUserIsRegistered',
    ]),
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
      'fetchLikeSuggestionList',
      'fetchSocialListDetailsById',
    ]),
    updateInfo() {
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

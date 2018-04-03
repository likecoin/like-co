<template>
  <div class="bundlesale-page">
    <div class="lc-container-0 lc-narrow">

      <section class="lc-container-1 lc-section-block">

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 ">

              <nav class="nav-menu">
                <span>
                  <nuxt-link :to="{ name: 'in-whitepaper' }">
                    {{ $t('TokenSale.button.whitePaper') }}
                  </nuxt-link>
                </span>

                <img class="like-coin-token" :src="likeCoinIcon" />

                <span>
                  <nuxt-link to="/">
                    {{ $t('TokenSale.button.aboutLikeCoin') }}
                  </nuxt-link>
                </span>
              </nav>

            </div>
          </div>
        </div>

        <div class="lc-container-2-extend">
          <div class="lc-container-3-extend-bg" />
          <div class="lc-container-3">
            <div class="lc-padding-top-32 lc-padding-bottom-16">

              <section class="lc-text-align-center">
                <h1 class="lc-font-size-42 lc-color-like-green lc-font-weight-600">
                  {{ $t('LikeBundle.title') }}
                </h1>
                <h2 class="lc-margin-top-12 lc-font-size-38 lc-font-weight-300">
                  {{ $t('LikeBundle.label.tagline') }}
                </h2>
                <h3 class="lc-margin-top-12 lc-font-size-18 lc-font-weight-400">
                  {{ $t('LikeBundle.label.whileSuppliesLast') }}
                </h3>
              </section>

            </div>
          </div>
        </div>

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 lc-padding-vertical-32 lc-text-align-center">
              {{ $t('LikeBundle.label.description')}}
            </div>
          </div>
        </div>

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-transparent">
            <div class="lc-container-4 lc-padding-top-16 lc-text-align-center">
              <nuxt-link
                class="lc-font-size-12 lc-underline"
                :to="{ name: 'in-tokensale' }">
                {{ $t('LikeBundle.button.purchaseInETH') }}
              </nuxt-link>
            </div>
          </div>
        </div>

      </section>

      <!-- BEGIN - Purchase LikeCoin Section -->
      <section class="lc-container-1 lc-section-block">

        <div class="lc-container-header">
          <div class="lc-container-2 lc-container-header-overlay">
            <div class="lc-container-3 lc-bg-gray-1" />
          </div>

          <div class="lc-container-2">
            <div class="lc-container-header-title">
              <h1 class="lc-font-size-32 lc-mobile">
                {{ $t('LikeBundle.purchaseLikeBundle.title') }}
              </h1>
            </div>
          </div>
        </div>

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 lc-padding-vertical-32">
              <checkoutForm @emailNotVerified="onNeedEmailVerify"/>
            </div>
          </div>
        </div>

      </section>
      <!-- END - Purchase LikeCoin Section -->

    </div>
    <email-dialog ref="emailDialog" :emailRef="'in-bundle'" />
  </div>
</template>


<script>
import { mapGetters } from 'vuex';

import checkoutForm from '~/components/checkoutForm';
import EmailDialog from '~/components/dialogs/EmailDialog';

import likeCoinIcon from '@/assets/like-coin.svg';

export default {
  name: 'bundlesale',
  layout: 'narrowWithHeader',
  components: {
    checkoutForm,
    EmailDialog,
  },
  data() {
    return {
      likeCoinIcon,
    };
  },
  computed: {
    KYCStatus() {
      return this.getUserInfo.KYC;
    },
    ...mapGetters([
      'getUserIsFetching',
      'getUserIsRegistered',
      'getUserInfo',
    ]),
  },
  methods: {
    onNeedEmailVerify() {
      this.$refs.emailDialog.show(this.getUserInfo.email || '');
    },
    redirectToRegisterPageIfNeeded() {
      if (!this.getUserIsRegistered) {
        this.$router.push({
          name: 'in-register',
          ref: 'in-bundle',
          query: { redirect: `${window.location.protocol}//${window.location.host}/in/bundle/` },
        });
      }
    },
  },
  head() {
    return {
      title: this.$t('LikeBundle.title'),
      meta: [
        {
          hid: 'og_title',
          property: 'og:title',
          content: this.$t('LikeBundle.title'),
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('LikeBundle.label.description'),
        },
        {
          hid: 'og_description',
          property: 'og:description',
          content: this.$t('LikeBundle.label.description'),
        },
      ],
    };
  },
  watch: {
    getUserIsFetching(f) {
      if (!f) {
        this.redirectToRegisterPageIfNeeded();
      }
    },
  },
  mounted() {
    if (!this.getUserIsFetching) {
      this.redirectToRegisterPageIfNeeded();
    }
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/index";

.bundlesale-page {
  margin-bottom: 18px;

  .lc-container-3-extend-bg {
    background-image: linear-gradient(250deg, #FFDFD2, #C1F3F5);
  }
}

.nav-menu {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding-top: 16px;

  @media (max-width: 600px) {
    flex-direction: column;
  }

  .like-coin-token {
    z-index: 1;

    width: 144px;
    height: 144px;
    margin: 16px;
    margin-bottom: -16px;

    @media (min-width: 769px) {
      margin-top: -32px;
    }
    @media (max-width: 600px) {
      order: 999;
    }
  }

  span {
    flex: 1;

    a {
      text-decoration: underline;

      color: #28646E;
    }

    &:last-child {
      text-align: right;
    }
  }
}
</style>

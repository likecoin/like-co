<template>
  <div class="backer-page">
    <div class="lc-container-0 lc-narrow">

      <section class="lc-container-1 lc-section-block">

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 ">

              <narrow-page-header />

            </div>
          </div>
        </div>

        <div class="lc-container-2-extend">
          <div class="lc-container-3-extend-bg" />
          <div class="lc-container-3">
            <div class="lc-padding-vertical-32">

              <section class="lc-text-align-center">
                <h1 class="lc-font-size-42 lc-color-like-green lc-font-weight-600">
                  {{ $t('BackerPage.title') }}
                </h1>
                <h2 class="lc-margin-top-12 lc-font-size-38 lc-font-weight-300">
                  {{ $t('BackerPage.label.tagline') }}
                </h2>
              </section>

            </div>
          </div>
        </div>

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div
              class="lc-container-4 lc-padding-vertical-32 lc-text-align-center"
              v-html="$t('BackerPage.label.description')" />
          </div>
        </div>

    <!--     <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-transparent">
            <div class="lc-container-4 lc-padding-top-16 lc-text-align-center">
              <nuxt-link
                class="lc-font-size-12 lc-underline"
                :to="{ name: 'in-tokensale' }">
                {{ $t('BackerPage.button.purchaseInETH') }}
              </nuxt-link>
            </div>
          </div>
        </div> -->

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
                {{ $t('BackerPage.productList.title') }}
              </h1>
            </div>
          </div>
        </div>

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 lc-padding-vertical-32">
              <checkout-form @emailNotVerified="onNeedEmailVerify"/>
            </div>
          </div>
        </div>

      </section>
      <!-- END - Purchase LikeCoin Section -->

    </div>

    <verify-email-dialog
      ref="emailDialog"
      :email="this.getUserInfo.email"
      :email-ref="'in-backer'" />

  </div>
</template>


<script>
import { mapGetters } from 'vuex';

import CheckoutForm from '~/components/checkoutForm';
import NarrowPageHeader from '~/components/header/NarrowPageHeader';
import VerifyEmailDialog from '~/components/dialogs/VerifyEmailDialog';

export default {
  name: 'backer-page',
  layout: 'narrowWithHeader',
  components: {
    CheckoutForm,
    NarrowPageHeader,
    VerifyEmailDialog,
  },
  computed: {
    KYCStatus() {
      return this.getUserInfo.KYC;
    },
    ...mapGetters([
      'getUserIsRegistered',
      'getUserInfo',
    ]),
  },
  methods: {
    onNeedEmailVerify() {
      if (this.getUserIsRegistered) this.$refs.emailDialog.show();
    },
  },
  head() {
    // strip out html tag in description
    const ogDescription = this.$t('BackerPage.label.description').replace(/<.*?>/g, '');
    return {
      title: this.$t('BackerPage.title'),
      meta: [
        {
          hid: 'og_title',
          property: 'og:title',
          content: this.$t('BackerPage.title'),
        },
        {
          hid: 'description',
          name: 'description',
          content: ogDescription,
        },
        {
          hid: 'og_description',
          property: 'og:description',
          content: ogDescription,
        },
        {
          hid: 'og_image',
          property: 'og:image',
          content: 'https://like.co/images/og/sale.png',
        },
      ],
    };
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.backer-page {
  .lc-container-3-extend-bg {
    background-image: linear-gradient(250deg, #FFDFD2, #C1F3F5);
  }
}
</style>

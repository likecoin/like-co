<template>
  <div class="donation-page">
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
                <h2
                  v-if="getUserIsRegistered"
                  class="lc-margin-top-12 lc-font-size-38 lc-font-weight-300"
                >
                  <span v-if="getUserIsFetching">Loading...</span>
                  <span v-else-if="getUserIsRegistered">You are: {{ getUserInfo.user }}</span>
                  <span v-else>You are: Guest</span>
                </h2>
              </section>

            </div>
          </div>
        </div>

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 lc-padding-vertical-32">
              <md-button
                class="md-likecoin"
                @click="onClickProduct"
              >
                Pay me the money
              </md-button>
            </div>
          </div>
        </div>

      </section>
      <!-- END - Purchase LikeCoin Section -->

    </div>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

import NarrowPageHeader from '~/components/header/NarrowPageHeader';

export default {
  name: 'donation-page',
  layout: 'narrowWithHeader',
  components: {
    NarrowPageHeader,
  },
  computed: {
    ...mapGetters([
      'getUserIsRegistered',
      'getUserInfo',
    ]),
  },
  methods: {
    ...mapActions([
      'purchaseSubscription',
    ]),
    async onClickProduct() {
      if (this.getUserIsRegistered && !this.getUserInfo.isEmailVerified) {
        console.error('emailNotVerified');
        return;
      }
      const {
        user,
        email,
        isEmailVerified,
      } = this.getUserInfo;
      let stripeEmail = '';
      if (email && isEmailVerified) stripeEmail = email;
      this.$checkout.open({
        name: 'Donation',
        currency: 'USD',
        amount: 500,
        email: stripeEmail,
        token: async (token) => {
          const payload = {
            user,
            token,
          };
          const { subscriptionId } = await this.purchaseSubscription(payload);
          if (user) {
            this.$router.push({ name: 'in-donation-done', query: { subscriptionId } });
          } else {
            this.$router.push({ name: 'in-donation-claim', query: { subscriptionId } });
          }
        },
      });
    },
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

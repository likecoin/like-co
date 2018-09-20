<template>
  <div class="donation-claim-page">
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
              v-html="$t('BackerPage.label.description')"
            />
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
              <div v-if="getUserIsFetching || isClaiming">
                Loading...
              </div>
              <div v-else-if="getUserIsRegistered">
                <md-button
                  class="md-likecoin"
                  @click="onClickClaim"
                >
                  Claim with {{ getUserId }}
                </md-button>
              </div>
              <div v-else>
                <md-button
                  class="md-likecoin"
                  @click="onClickLogin"
                >
                  Login
                </md-button>
              </div>
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
  name: 'donation-claim-page',
  layout: 'narrowWithHeader',
  components: {
    NarrowPageHeader,
  },
  data() {
    return {
      isClaiming: false,
    };
  },
  computed: {
    ...mapGetters([
      'getUserIsRegistered',
      'getUserId',
      'getUserIsFetching',
    ]),
    subscriptionId() {
      return this.$route.query.subscriptionId || '';
    },
  },
  watch: {
    getUserId(id) {
      if (this.$route.query.autoClaim && id) {
        this.onClickClaim();
      }
    },
  },
  mounted() {
    if (!this.subscriptionId) {
      this.setErrorMsg('invalid subscription id');
      this.$router.push({ name: 'in-donation' });
    }
    if (this.$route.query.autoClaim && this.getUserId) {
      this.onClickClaim();
    }
  },
  methods: {
    ...mapActions([
      'setErrorMsg',
      'showLoginWindow',
      'claimSubscription',
    ]),
    async onClickClaim() {
      const payload = {
        user: this.getUserId,
        subscriptionId: this.subscriptionId,
      };
      await this.claimSubscription(payload);
      this.$router.push({ name: 'in-donation-done', query: { subscriptionId: this.subscriptionId } });
    },
    async onClickLogin() {
      const { name, query } = this.$route;
      this.$router.replace({ name, query: { ...query, autoClaim: true } });
      this.$nextTick(() => {
        this.$router.push({
          name: 'in-register',
          query: {
            email: this.$route.query.email,
            subscriptionId: this.subscriptionId,
            ref: '',
          },
        });
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

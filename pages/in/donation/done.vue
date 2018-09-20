<template>
  <div class="donation-done-page">
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
                  DONE
                </h2>
                <div v-if="subscriptionInfo.currentPeriodEnd">
                  Begin time {{ new Date(subscriptionInfo.currentPeriodEnd) }}
                </div>
                <div v-if="subscriptionInfo.currentPeriodStart">
                  Begin time {{ new Date(subscriptionInfo.currentPeriodStart) }}
                </div>
              </section>

            </div>
          </div>
        </div>

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 lc-padding-vertical-32">
              <md-button
                class="md-likecoin"
                @click="$router.push({ name: 'in' })"
              >
                Back to Home
              </md-button>
            </div>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

import NarrowPageHeader from '~/components/header/NarrowPageHeader';

export default {
  name: 'donation-done-page',
  layout: 'narrowWithHeader',
  components: {
    NarrowPageHeader,
  },
  data() {
    return {
      subscriptionInfo: {},
    };
  },
  computed: {
    ...mapGetters([
      'getUserIsRegistered',
      'getUserId',
    ]),
  },
  watch: {
    async getUserId(id) {
      if (id) this.subscriptionInfo = await this.fetchUserSubscriptionInfo(id);
    },
  },
  methods: {
    ...mapActions([
      'fetchUserSubscriptionInfo',
    ]),
  },
  async mount() {
    if (this.getUserId) {
      this.subscriptionInfo = await this.fetchUserSubscriptionInfo(this.getUserId);
    }
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

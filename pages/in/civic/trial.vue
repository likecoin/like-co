<template>
  <div
    v-if="getUserInfo.isPreRegCivicLiker"
    class="civic-liker-trial-page"
  >
    <div class="lc-container-0 lc-narrow">

      <section class="lc-container-1 lc-section-block">

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 ">

              <narrow-page-header
                :icon="getUserInfo.avatar"
                :avatar-halo="getUserInfo.isPreRegCivicLiker ? 'civic-liker-trial' : ''"
                is-hidden-link
              />

            </div>
          </div>
        </div>

        <div class="lc-container-2-extend">
          <div class="lc-container-3-extend-bg" />
          <div class="lc-container-3 lc-padding-top-32 lc-padding-bottom-32 lc-text-align-center">

            <h1 class="lc-font-size-32 lc-font-weight-600 lc-mobile">
              {{ $t('CivicTrialPage.thankYou') }}
              <br>
              <span class="lc-font-size-46 lc-font-weight-300 lc-mobile">
                {{ $t('CivicTrialPage.title') }}
              </span>
            </h1>

          </div>
        </div>

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 lc-padding-vertical-32">

              <div class="chop-art">
                <lc-chop-civic-liker
                  rotate-z="16"
                  is-trial
                />
                <lc-chop-approved
                  size="210"
                  rotate-z="-6"
                  is-trial
                />
              </div>

              <countdown-timer
                :date="civicLikerStartDate"
                class="lc-margin-bottom-16"
              />

              <div
                class="lc-color-like-green lc-font-size-16 lc-font-weight-600 lc-text-align-center"
              >
                {{ $t('CivicPage.trial.willBeHeld') }}
              </div>

              <div class="lc-button-group lc-margin-top-16">
                <md-button
                  class="md-likecoin lc-font-size-16 lc-font-weight-600"
                  @click="onClickOk"
                >
                  {{ $t('General.button.ok') }}
                </md-button>
              </div>
            </div>
          </div>
        </div>

      </section>

    </div>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

import { CIVIC_LIKER_START_DATE } from '~/constant';

import NarrowPageHeader from '~/components/header/NarrowPageHeader';
import CountdownTimer from '~/components/CountdownTimer';

export default {
  layout: 'narrowWithHeader',
  components: {
    NarrowPageHeader,
    CountdownTimer,
  },
  data() {
    return {
      civicLikerStartDate: new Date(CIVIC_LIKER_START_DATE),
    };
  },
  middleware: 'authenticated',
  computed: {
    ...mapGetters([
      'getUserInfo',
    ]),
  },
  head() {
    return {
      title: this.$t('CivicTrialPage.title'),
      meta: [
        {
          hid: 'og_title',
          property: 'og:title',
          content: this.$t('CivicTrialPage.title'),
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('CivicPage.CTA.title'),
        },
        {
          hid: 'og_description',
          property: 'og:description',
          content: this.$t('CivicPage.CTA.title'),
        },
      ],
    };
  },
  mounted() {
    if (!this.getUserInfo.isPreRegCivicLiker) {
      this.startCivicLikerTrial(this.getUserInfo.user);
    }
  },
  methods: {
    ...mapActions([
      'startCivicLikerTrial',
    ]),
    onClickOk() {
      this.$router.push({ name: 'in' });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

.chop-art {
  margin: -60px 0 16px;

  text-align: center;

  .lc-chop-approved {
    margin-left: -48px;

    @media screen and (max-width: 400px) {
      margin: -32px 0 0;
    }
  }
}
</style>

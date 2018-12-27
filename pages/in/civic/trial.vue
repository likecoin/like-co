<template>
  <div class="civic-liker-trial-page">
    <div class="lc-container-0 lc-narrow">

      <section class="lc-container-1 lc-section-block">

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 lc-text-align-center">

              <lc-chop-civic-liker
                class="civic-liker-trial-logo"
                size="180"
                rotate-z="-12"
                is-trial
              />

            </div>
          </div>
        </div>

        <div class="lc-container-2-extend">
          <div class="lc-container-3-extend-bg" />
          <div class="lc-container-3 lc-padding-top-48 lc-padding-bottom-32 lc-text-align-center">

            <h1 class="lc-font-size-32 lc-font-weight-600 lc-mobile">
              {{ title }}
              <template v-if="isRegistered || isOnWaitingList">
                <br>
                <span class="lc-font-size-46 lc-font-weight-300 lc-mobile">
                  {{ $t('CivicLikerTrial.title') }}
                </span>
              </template>
            </h1>

          </div>
        </div>

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 lc-padding-vertical-32">

              <template v-if="isRegistered">
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
                  :class="[
                    'lc-color-like-green lc-font-size-16 lc-font-weight-600 lc-text-align-center',
                  ]"
                >
                  {{ $t('CivicLikerTrial.willBeHeld') }}
                </div>

                <div class="lc-button-group lc-margin-top-16">
                  <md-button
                    class="md-likecoin lc-font-size-16 lc-font-weight-600"
                    @click="onClickOk"
                  >
                    {{ $t('General.button.ok') }}
                  </md-button>
                </div>
              </template>

              <template v-else-if="isOnWaitingList">
                <div
                  :class="[
                    'lc-margin-bottom-16',
                    'lc-color-civic-yellow lc-font-size-32 lc-font-weight-600 lc-text-align-center',
                  ]"
                >
                  {{ $t('CivicPage.waitingList.title') }}
                </div>
                <p class="lc-text-align-center lc-margin-bottom-32">
                  {{ $t('CivicLikerTrial.waitingList.sorry') }}
                  <template v-if="!getUserInfo.email">
                    {{ $t('CivicPage.waitingList.ensureEmail') }}
                  </template>
                  {{ $t('CivicPage.waitingList.notifyByEmail') }}
                </p>
                <div class="lc-button-group lc-margin-top-16">
                  <md-button
                    class="md-likecoin lc-font-size-16 lc-font-weight-600"
                    @click="$router.push({ name: 'in' })"
                  >
                    {{ $t('General.button.ok') }}
                  </md-button>
                </div>
              </template>

              <template v-else>
                <div class="lc-button-group lc-margin-top-16">
                  <md-button
                    class="md-likecoin lc-font-size-16 lc-font-weight-600"
                    @click="$router.push({ name: 'in-civic' })"
                  >
                    {{ $t('General.back') }}
                  </md-button>
                </div>
              </template>

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
  asyncData({ redirect, store }) {
    if (store.getters.getUserInfo.isSubscribedCivicLiker) {
      redirect({ name: 'in-civic' });
    }
  },
  data() {
    return {
      civicLikerStartDate: new Date(CIVIC_LIKER_START_DATE),

      errorMessage: '',
    };
  },
  middleware: 'authenticated',
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getInfoMsg',
    ]),
    isRegistered() {
      return this.getUserInfo.isPreRegCivicLiker;
    },
    isOnWaitingList() {
      return this.getUserInfo.preRegCivicLikerStatus === 'waiting';
    },
    title() {
      if (this.isRegistered) {
        return this.$t('CivicLikerTrial.thankYou');
      }
      if (this.isOnWaitingList) {
        return this.$t('CivicLikerTrial.thankYouForYourInterest');
      }
      if (this.errorMessage) {
        switch (this.errorMessage) {
          case 'PRE_REG_CIVIC_LIKER_ENDED':
            return this.$t('Error.PRE_REG_CIVIC_LIKER_ENDED');

          default:
            return this.$t('General.label.error');
        }
      }
      return this.$t('General.loading');
    },
  },
  head() {
    return {
      title: this.$t('CivicLikerTrial.title'),
      meta: [
        {
          hid: 'og_title',
          property: 'og:title',
          content: this.$t('CivicLikerTrial.title'),
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
        {
          hid: 'og_image',
          property: 'og:image',
          content: 'https://like.co/images/og/civic.png',
        },
      ],
    };
  },
  watch: {
    getInfoMsg(value) {
      if (value === 'PRE_REG_CIVIC_LIKER_ENDED') {
        this.errorMessage = value;
      }
    },
  },
  async mounted() {
    if (!this.isRegistered && !this.isOnWaitingList) {
      const {
        isPreRegCivicLiker,
        preRegCivicLikerStatus,
      } = await this.startCivicLikerTrial(this.getUserInfo.user);
      if (this.$intercom) {
        this.$intercom.update({
          isPreRegCivicLiker,
          isOnPreRegCivicLikerWaitingList: preRegCivicLikerStatus === 'waiting',
        });
      }
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

.civic-liker-trial-logo {
  position: relative;
  z-index: 2;

  margin-bottom: -32px;
}

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

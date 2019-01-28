<template>
  <div
    v-if="!error"
    class="civic-liker-trial-page"
  >
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
              <template v-if="isJoined">
                {{ $t('CivicLikerTrial.thankYou') }}
                <br>
                <span class="lc-font-size-46 lc-font-weight-300 lc-mobile">
                  {{ $t('CivicLikerTrial.title') }}
                </span>
              </template>
              <template v-else>
                {{ $t('General.loading') }}
              </template>
            </h1>
          </div>
        </div>

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 lc-padding-vertical-32">

              <template v-if="isJoined">
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

                <div
                  v-bind="$testID('JoinCivicLikerTrial-successText')"
                  :class="[
                    'lc-color-like-green lc-font-size-16 lc-font-weight-600 lc-text-align-center',
                  ]"
                >
                  {{ $t('CivicLikerTrial.subscriptionPeriod', { start, end }) }}
                </div>

                <div class="lc-button-group lc-margin-top-32">
                  <md-button
                    class="md-likecoin"
                    @click="checkMyStatus"
                  >{{ $t('General.button.ok') }}
                  </md-button><br><md-button
                    class="md-likecoin"
                    @click="learnMore"
                  >{{ $t('General.learnMore') }}</md-button>
                </div>
              </template>

              <template v-else>
                <div class="lc-button-group lc-margin-top-16">
                  <md-button
                    class="md-likecoin"
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
import dateFormat from 'date-fns/format';

import {
  apiGetCivicCSOnline,
  apiGetCivicLikerTrialEventById,
} from '~/util/api/api';

export default {
  layout: 'narrowWithHeader',
  async asyncData(context) {
    const { route, store } = context;
    const {
      isSubscribedCivicLiker,
      isCivicLikerTrial,
    } = store.getters.getUserInfo;

    let error = '';
    if (isSubscribedCivicLiker) {
      error = 'paid';
    } else if (isCivicLikerTrial) {
      error = 'joined';
    } else {
      try {
        await apiGetCivicLikerTrialEventById(route.params.id);
        return {};
      } catch (err) {
        switch (err.response.status) {
          case 410:
            error = 'expired';
            break;
          case 404:
          default:
            error = 'nonexistent';
        }
      }
    }

    const res = await apiGetCivicCSOnline();
    const { isCSOnline } = res.data;
    return { error, isCSOnline };
  },
  middleware: 'authenticated',
  data() {
    return {
      error: '',
      isCSOnline: false,
      start: undefined,
      end: undefined,
    };
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getInfoMsg',
    ]),
    isJoined() {
      return (
        this.start
        || this.getUserInfo.isSubscribedCivicLiker
        || this.getUserInfo.isCivicLikerTrial
      );
    },
    eventId() {
      return this.$route.params.id;
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
  created() {
    // Handle error given from asyncData
    if (process.client && this.error) this.handleError();
  },
  async mounted() {
    if (this.error) return;

    try {
      const { start, end } = await this.joinCivicLikerTrialEvent(this.eventId);
      this.start = dateFormat(new Date(start), 'YYYY.MM.DD');
      this.end = dateFormat(new Date(end), 'YYYY.MM.DD');
    } catch (err) {
      switch (err.response.status) {
        case 404:
          this.error = 'nonexistent';
          break;
        case 409:
          this.error = 'joined';
          break;
        case 410:
          this.error = 'expired';
          break;
        default:
          this.error = 'unknown';
      }
      this.handleError();
    }
  },
  methods: {
    ...mapActions([
      'joinCivicLikerTrialEvent',
      'openPopupDialog',
    ]),
    handleError() {
      this.$router.push({ name: 'in-civic' });
      const { error } = this;
      const options = {
        allowClose: true,
        header: this.$t(`CivicLikerTrial.errorPopup.${error}.header`),
        message: this.$t(`CivicLikerTrial.errorPopup.${error}.message`),
        confirmText: this.$t(`CivicLikerTrial.errorPopup.${error}.confirm`),
        cancelText: this.$t('CivicPage.about'),
        onCancel: this.learnMore,
      };

      switch (error) {
        case 'joined':
          options.onConfirm = () => {
            this.$router.push({ name: 'in-civic-register' });
          };
          break;

        case 'paid':
          options.onConfirm = this.checkMyStatus;
          break;

        default:
          options.confirmText = this.$t('General.contactUs');
          options.onConfirm = this.contactUs;
      }

      this.openPopupDialog(options);
    },
    checkMyStatus() {
      this.$router.push({ name: 'in' });
    },
    learnMore() {
      this.$router.push({ name: 'in-civic' });
    },
    contactUs() {
      if (this.isCSOnline && this.$intercom) {
        this.$intercom.show();
      } else {
        window.open('https://help.like.co/', '_blank');
      }
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

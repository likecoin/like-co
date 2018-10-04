<template>
  <section class="donation-claim-page">
    <div class="lc-container-1 lc-section-block">
      <div class="lc-container-2">
        <div class="lc-container-3 lc-bg-gray-1 lc-padding-vertical-24" />
      </div>

      <div
        v-if="subscriptionId"
        class="donation-claim-page__header lc-container-2-extend"
      >
        <div class="lc-container-3-extend-bg" />
        <div class="lc-container-3">
          <div
            :class="[
              'lc-padding-top-32',
              'lc-padding-bottom-16',
              'lc-flex',
              'lc-flex-direction-column',
              'lc-padding-top-64-mobile'
            ]"
          >
            <div class="donation-claim-page__clap-icon-wrapper">
              <div
                v-for="i in 12"
                :key="i"
                class="donation-claim-page__clap-effect"
              >
                <simple-svg
                  :filepath="ClapEffectIcon"
                  fill="currentColor"
                  stroke="transparent"
                />
              </div>
              <div class="donation-claim-page__clap-icon">
                <simple-svg
                  :filepath="ClapIcon"
                  width="60px"
                  height="60px"
                  fill="#fff"
                />
              </div>
            </div>

            <div class="lc-text-align-center lc-margin-top-48">
              <h2>{{ $t('Donation.label.thanks') }}</h2>
              <h1 class="lc-margin-top-8">
                {{ $t('Donation.label.oneMoreStep') }}
              </h1>

              <md-button
                :class="[
                  'md-likecoin',
                  'outline',
                  'lc-margin-top-32',
                  {
                    disabled: isClaiming,
                  }
                ]"
                @click="onClickConnect"
              >{{ $t('Donation.button.connectID') }}</md-button>
            </div>

          </div>
        </div>
      </div>

      <div class="lc-container-2">
        <div class="lc-container-3 lc-bg-gray-1 lc-padding-vertical-24">
          <p class="lc-font-weight-600 lc-font-size-20">
            {{ $t('Donation.label.createToEnjoyContent') }}
          </p>

          <div class="lc-text-align-center lc-margin-vertical-24">
            <a
              :href="connectIdTutorialUrl"
              class="lc-font-size-20 lc-underline lc-font-weight-600"
              rel="noopener noreferrer"
              target="_blank"
            >{{ $t('Donation.button.howToCreateID') }}</a>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

import NarrowPageHeader from '~/components/header/NarrowPageHeader';

import ClapIcon from '~/assets/like-button/like-clap.svg';
import ClapEffectIcon from '~/assets/like-button/clap-effect.svg';

import { checkIsMobileClient } from '~/util/client';

export default {
  name: 'donation-claim-page',
  layout: 'narrowWithHeader',
  components: {
    NarrowPageHeader,
  },
  data() {
    return {
      isClaiming: false,
      ClapIcon,
      ClapEffectIcon,
    };
  },
  computed: {
    ...mapGetters([
      'getUserIsRegistered',
      'getUserId',
    ]),
    subscriptionId() {
      return this.$route.query.subscriptionId || '';
    },
    connectIdTutorialUrl() {
      return checkIsMobileClient()
        ? this.$t('Donation.url.createIdOnMobile')
        : this.$t('Donation.url.createIdOnComp');
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
    // hide menu button
    const menuBtn = document.querySelector('.toggle-menu-button');
    if (menuBtn) {
      menuBtn.style.display = 'none';
    }

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
    onClickConnect() {
      if (this.getUserIsRegistered) {
        this.onClickClaim();
      } else {
        this.onClickLogin();
      }
    },
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

$like-button-border-width: 6px;

.donation-claim-page {
  &__header {
    h2 {
      font-size: 28px;

      @media (max-width: 600px) {
        font-size: 22px;
      }
    }

    h1 {
      font-size: 48px;

      @media (max-width: 600px) {
        font-size: 28px;
      }
    }
  }

  &__clap-icon-wrapper {
    position: relative;

    align-self: center;

    width: 100px;
    height: 100px;
    margin-top: -88px;
  }

  &__clap-effect {
    position: absolute;
    top: calc(50% - 10px);
    left: calc(50% - 8px);

    width: 14px;
    height: 20px;

    color: $like-green;

    @for $i from 1 through 12 {
      &:nth-child(#{$i}) {
        transform: rotateZ(-15deg + 30deg * $i) translateY(-68px);
      }
    }
  }

  &__clap-icon {
    position: relative;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 100px;
    height: 100px;

    border-radius: 50%;
    background-image: linear-gradient(47deg, #d2f0f0, #f0e6b4);
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.25);

    &:before {
      position: absolute;
      top: $like-button-border-width;
      right: $like-button-border-width;
      bottom: $like-button-border-width;
      left: $like-button-border-width;

      content: ' ';

      border-radius: 50%;
      background-color: $like-green;
    }

    :global(svg) {
      z-index: 1;
    }
  }

  .md-button {
    padding: 0 6px;
  }
}
</style>

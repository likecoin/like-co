<template>
  <div class="tokensale-page">

    <section class="lc-container-0">
      <div class="lc-container-1 lc-section-block">

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 ">
              <narrow-page-header />
            </div>
          </div>
        </div>

        <tokensale-dashboard />

      </div>
    </section>

    <section class="lc-container-0">
      <!-- Loading -->
      <div
        v-if="getUserIsFetching"
        class="lc-container-1 lc-padding-vertical-32">
        <div class="lc-container-2">
          <md-progress-bar md-mode="indeterminate" />
        </div>
      </div>

      <div
        v-else
        class="lc-container-1 lc-section-block lc-margin-top-32 lc-padding-top-32">

        <div class="lc-container-2">
          <header>
            <div class="lc-section-header">
              <div class="lc-section-header-icon lc-raised-icon">
                <img src="/images/avatar/ckxpress.jpeg" />
              </div>
            </div>
          </header>

          <div class="lc-container-3 lc-padding-vertical-32 lc-bg-gray-1">
            
            <div class="lc-container-4 lc-margin-top-16">
              <h1 class="lc-margin-bottom-32 lc-color-like-green lc-font-size-32 lc-font-weight-600 lc-text-align-center">
                {{ $t('TokenSale.header.thankyou') }}
              </h1>

              <p class="lc-color-like-gray-4 lc-font-size-16 lc-line-height-1_6">
                {{ $t('TokenSale.label.thankyou') }}
              </p>
            </div>

            <div
              v-if="getUserIsRegistered"
              class="lc-container-4 lc-text-align-center lc-margin-top-24">
              <nuxt-link :to="{ name: 'in' }">
                <md-button
                  class="md-likecoin"
                  @click="redirectToRegister">
                  {{ $t('General.button.myAccount') }}
                </md-button>
              </nuxt-link>
            </div>
            <div 
              v-else
              class="lc-container-4 lc-text-align-center lc-margin-top-32">
              <md-button
                class="md-likecoin"
                @click="redirectToRegister">
                {{ $t('KYC.button.createID') }}
              </md-button>
              <br />
              <a
                class="lc-color-like-gray-4 lc-underline"
                href="#"
                @click="showLoginWindow">
                {{ $t('Home.Header.button.signIn') }}
              </a>
            </div>
          
          </div>

          <div
            v-if="!getUserIsRegistered"
            class="lc-container-3 lc-margin-top-16 lc-text-align-center">
            <div class="lc-container-4">
              <p class="lc-color-like-gray-4">
                {{ $t('KYC.label.createIDSendReceive') }}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>


<script>
import TokensaleDashboard from '~/components/TokensaleDashboard';
import NarrowPageHeader from '~/components/header/NarrowPageHeader';

import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'tokensale',
  layout: 'narrowWithHeader',
  components: {
    TokensaleDashboard,
    NarrowPageHeader,
  },
  head() {
    let meta;
    if (this.$route.query.from) {
      meta = [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('TokenSale.head.fromDescription'),
        },
        {
          hid: 'og_description',
          property: 'og:description',
          content: this.$t('TokenSale.head.fromDescription'),
        },
        {
          hid: 'og_image',
          property: 'og:image',
          content: 'https://like.co/images/og/tokensale.jpg',
        },
      ];
    } else {
      meta = [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('TokenSale.head.description'),
        },
        {
          hid: 'og_description',
          property: 'og:description',
          content: this.$t('TokenSale.head.description'),
        },
        {
          hid: 'og_image',
          property: 'og:image',
          content: 'https://like.co/images/og/sale.png',
        },
      ];
    }

    return {
      meta,
    };
  },
  computed: {
    ...mapGetters([
      'getUserIsFetching',
      'getUserIsRegistered',
    ]),
  },
  methods: {
    ...mapActions([
      'showLoginWindow',
    ]),
    redirectToRegister() {
      const { query } = this.$route;
      this.$router.push({ name: 'in-register', query: { ref: 'in-tokensale', ...query } });
    },
  },
};
</script>

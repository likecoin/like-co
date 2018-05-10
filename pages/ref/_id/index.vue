<template>
  <div class="referral-page">

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

    <section class="lc-container-0 lc-margin-top-16">
      <div class="lc-container-1 lc-section-block">
        <div class="lc-container-2">

          <header class="lc-padding-top-32">
            <div class="lc-section-header">
              <div class="lc-section-header-icon lc-raised-icon">
                <img :src="avatar" />
              </div>
            </div>
          </header>

          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 lc-padding-top-40 lc-padding-bottom-24">
              <h1
                class="lc-font-size-32 lc-font-weight-300
                lc-margin-bottom-12" v-html="$t('ReferralPage.title', { name: styledDisplayName })" />

              <div v-html="$t('ReferralPage.label.invitation', { name: styledDisplayName })" />

              <div class="lc-flex lc-justify-content-center lc-margin-top-32">
                <md-button class="md-likecoin" @click="onClickCreateLikeCoinIdButton">
                  {{ $t('KYC.button.createID') }}
                </md-button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

  </div>
</template>


<script>
import { mapGetters } from 'vuex';
import * as api from '@/util/api/api';

import NarrowPageHeader from '~/components/header/NarrowPageHeader';
import TokensaleDashboard from '~/components/TokensaleDashboard';

export default {
  name: 'referral-page',
  layout: 'narrowWithHeader',
  components: {
    NarrowPageHeader,
    TokensaleDashboard,
  },
  data() {
    return {
      avatar: '',
      displayName: '',
    };
  },
  computed: {
    referrerId() {
      return this.$route.params.id;
    },
    ...mapGetters([
      'getUserIsFetching',
      'getUserIsRegistered',
    ]),
  },
  methods: {
    onClickCreateLikeCoinIdButton() {
      this.$router.push({
        name: 'in-register',
        query: {
          from: this.referrerId,
          ref: 'in-tokensale',
        },
      });
    },
  },
  async asyncData({ params, error }) {
    try {
      const response = await api.apiGetUserMinById(params.id);
      const { avatar, displayName } = response.data;
      return {
        avatar,
        displayName,
        styledDisplayName: `<a class="lc-color-like-green lc-font-weight-600" href="/${params.id}">${displayName}</a>`,
      };
    } catch (err) {
      error({ statusCode: 404 });
      return {};
    }
  },
  head() {
    return {
      title: this.$t('ReferralPage.og.title', { name: this.displayName }),
      meta: [
        {
          hid: 'og_title',
          property: 'og:title',
          content: this.$t('ReferralPage.og.title', { name: this.displayName }),
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('ReferralPage.og.description', { name: this.displayName }),
        },
        {
          hid: 'og_description',
          property: 'og:description',
          content: this.$t('ReferralPage.og.description', { name: this.displayName }),
        },
        {
          hid: 'og_image',
          property: 'og:image',
          content: 'https://like.co/images/og/tokensale.jpg',
        },
      ],
    };
  },
  watch: {
    getUserIsFetching(f) {
      if (!f) {
        if (this.getUserIsRegistered) {
          this.$router.push({ name: 'in-tokensale' });
        }
      }
    },
  },
  mounted() {
    if (!this.getUserIsFetching) {
      if (this.getUserIsRegistered) {
        this.$router.push({ name: 'in-tokensale' });
      }
    }
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";
</style>

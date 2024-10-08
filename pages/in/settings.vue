<template>
  <div v-if="isPopupLayout">
    <nuxt />
    <div class="lc-container-1 lc-padding-vertical-32 md-layout md-alignment-center-center">
      <Button
        @click="onClickLogoutButton"
      >{{ $t('Menu.item.logout') }}</Button>
    </div>
  </div>
  <div
    v-else
    class="settings-page"
  >
    <section class="lc-container-0">

      <div class="lc-container-1 lc-padding-top-32">
        <div class="underlay lc-mobile-hide" />
        <div class="lc-container-2">
          <div class="lc-container-3">
            <h1 class="lc-font-size-20 lc-font-weight-400 lc-line-height-1_5 lc-color-like-gray-4">
              {{ $t('Settings.title' ) }}
            </h1>
          </div>
        </div>

        <md-tabs
          :md-active-tab="$route.name"
          class="md-transparent lc-container-2 lc-width-2-3 lc-padding-top-32"
        >

          <template
            slot-scope="{ tab }"
            slot="md-tab"
          >
            <span class="settings-page__tab-label">
              {{ tab.label }}
            </span>
          </template>

          <md-tab
            id="in-settings"
            :md-label="$t('Settings.button.profile')"
            to="/in/settings"
          />
          <md-tab
            id="in-settings-button"
            :md-label="$t('Settings.button.likeButton')"
            to="/in/settings/button"
          />
          <md-tab
            id="in-settings-others"
            :md-label="$t('Settings.button.otherSettings')"
            to="/in/settings/others"
          />

        </md-tabs>
      </div>

      <nuxt-child />

    </section>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';
import { POST_LOGOUT_ROUTE } from '~/constant';

import Button from '~/components/v2/Button';

export default {
  name: 'settings-page',
  layout({ query }) {
    return query.popup !== undefined ? 'popup' : 'defaultWithGrayHeader';
  },
  components: {
    Button,
  },
  middleware: 'authenticated',
  head() {
    return {
      title: this.$t('Settings.title'),
      meta: [
        {
          hid: 'og_title',
          property: 'og:title',
          content: this.$t('Settings.title'),
        },
      ],
    };
  },
  computed: {
    ...mapGetters(['getUserWalletAddress']),
    isPopupLayout() {
      return this.$route.query.popup !== undefined;
    },
    userWallet() {
      return this.$route.query.user_wallet;
    },
  },
  mounted() {
    // Force re-authenticate if not the same user
    if (
      this.isPopupLayout
      && this.userWallet
      && this.getUserWalletAddress !== this.userWallet
    ) {
      this.onClickLogoutButton();
    }
  },
  methods: {
    ...mapActions(['logoutUser']),
    async onClickLogoutButton() {
      await this.logoutUser();
      this.$nextTick(() => this.$router.push(POST_LOGOUT_ROUTE));
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.md-tabs {
  padding-right: 0;

  /deep/ a {
    @media (min-width: 600px + 1px) {
      flex: 1;
    }

    @media (max-width: 600px) {
      width: 50%;
    }
  }

  /deep/ .md-tabs-indicator {
    height: 3px;

    background-color: transparent;

    &::before {
      position: relative;

      display: block;

      width: 24px;
      height: 3px;
      margin: auto;

      content: " ";

      background-color: $like-green;
    }
  }

}

.settings-page__tab-label {
  a.md-active & {
    color: $like-green;

    font-weight: 600;
  }
  a:not(.md-active) & {
    color: $like-gray-4;
  }
}
</style>

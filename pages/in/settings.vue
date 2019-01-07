<template>
  <div class="settings-page">
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
            v-if="getUserInfo.wallet"
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
import { mapGetters } from 'vuex';

export default {
  name: 'settings-page',
  layout: 'defaultWithGrayHeader',
  middleware: 'authenticated',
  computed: {
    ...mapGetters([
      'getUserInfo',
    ]),
  },
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
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.md-tabs {
  padding-right: 0;

  :global(a) {
    @media (min-width: 600px + 1px) {
      flex: 1;
    }

    @media (max-width: 600px) {
      width: 50%;
    }
  }

  :global(.md-tabs-indicator) {
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

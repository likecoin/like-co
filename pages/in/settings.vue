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

            <md-tabs
              :md-active-tab="$route.name"
              class="md-transparent lc-padding-top-32"
            >

              <template
                slot="md-tab"
                slot-scope="{ tab }"
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
                id="in-settings-others"
                :md-label="$t('Settings.button.otherSettings')"
                to="/in/settings/others"
              />

            </md-tabs>
          </div>
        </div>
      </div>

      <nuxt-child />

    </section>
  </div>
</template>


<script>
export default {
  name: 'settings-page',
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.md-tabs {
  :global(a) {
    @media (min-width: 600px + 1px) {
      width: 15%;
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

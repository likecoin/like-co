<template>
  <div class="lc-layout">
    <tool-bars />

    <div class="lc-page-wrapper">

      <header class="lc-page-header">
        <div class="lc-container-0">
          <div class="lc-container-1">
            <div class="lc-container-2">
              <div class="lc-container-3 lc-margin-vertical-20">
                <img class="logo" :src="logo" />
                <language-switch color="#28646E" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="lc-page-content">
        <nuxt />
      </div>

      <footer class="lc-page-footer">
        <div class="lc-container-0">
          <my-footer />
        </div>
      </footer>

    </div>

  </div>
</template>


<script>
import localeMixin from '~/mixins/locale';

import LanguageSwitch from '~/components/LanguageSwitch';

import MyFooter from '~/components/footer/Footer';
import ToolBars from '~/components/toolbars/ToolBars';

import Logo from '~/assets/app/logo.svg';

export default {
  components: {
    LanguageSwitch,
    MyFooter,
    ToolBars,
  },
  computed: {
    logo() {
      return Logo;
    },
  },
  mixins: [localeMixin],
};
</script>

<style lang="scss" scoped>
.lc-layout {
  background: linear-gradient(39.16deg, #D2F0F0 -44.97%, #F0E6B4 157.73%);

  .lc-page-header .lc-container-3 {
    display: flex;
    align-items: center;
    justify-content: space-between;

    > * {
      flex: 0;
    }
  }
}
</style>

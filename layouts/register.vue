<template>
  <div class="container">
    <tool-bars :is-auth-dialog-disabled="true" />
    <div class="logo-wapper">
      <img
        :src="likerLandIcon"
        class="logo"
        alt="Liker Land"
      >
    </div>
    <div class="lc-page-wrapper">
      <div class="lc-page-content">
        <nuxt />
        <div class="md-layout md-alignment-center-center">
          <language-switch
            class="language-switch"
            :isShowLabel="true"
            color="black"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import localeMixin from '~/mixins/locale';

import LanguageSwitch from '~/components/LanguageSwitch';
import ToolBars from '~/components/toolbars/ToolBars';

import likerLandIcon from '@/assets/logo/liker-land.svg';

export default {
  components: {
    LanguageSwitch,
    ToolBars,
  },
  mixins: [localeMixin],
  head() {
    return {
      htmlAttrs: {
        layout: 'register-layout',
      },
    };
  },
  data() {
    return { likerLandIcon };
  },
};
</script>

<style lang="scss">
@import '~assets/variables';

html[layout=register-layout] {
  background-color: $like-gray-1 !important;

  body {
    background: transparent !important;
  }

  .container {
    display: flex;

    flex-flow: column;

    min-height: 100vh;
  }

  .logo-wapper {
    display: flex;
    justify-content: center;

    padding: 41px 0px;
  }

  .logo-wapper .logo {
    height: 24px;
  }
}

.language-switch {
  position: relative;
  z-index: 1001;

  margin-right: 12px;
}
</style>

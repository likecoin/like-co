<template>
  <div class="container">
    <div class="logo-wapper">
      <img
        :src="likerLandIcon"
        class="logo"
        alt="Liker Land"
      >
    </div>
    <tool-bars />
    <div class="lc-page-wrapper-1">
      <div class="lc-page-content">
        <nuxt />
      </div>
    </div>
  </div>
</template>

<script>
import localeMixin from '~/mixins/locale';

import ToolBars from '~/components/toolbars/ToolBars';

import likerLandIcon from '@/assets/logo/liker-land.svg';

export default {
  components: {
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
</style>

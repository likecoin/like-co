<template>
  <div class="lc-layout">
    <tool-bars />

    <div class="lc-page-wrapper">

      <div class="lc-page-content">
        <nuxt />
      </div>

    </div>

  </div>
</template>

<script>
import localeMixin from '~/mixins/locale';

import ToolBars from '~/components/toolbars/ToolBars';

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
};
</script>

<style lang="scss">
@import '~assets/variables';

html[layout=register-layout] {
  background-color: $like-green !important;

  body {
    background: transparent !important;
  }

  .lc-dialog {
    box-shadow: none;
  }
}
</style>

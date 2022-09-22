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
import ToolBars from '~/components/toolbars/ToolBars';

export default {
  components: {
    ToolBars,
  },
};
</script>

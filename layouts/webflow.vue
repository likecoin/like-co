<template>
  <div class="webflow">
    <nuxt />
  </div>
</template>

<script>
export default {
  head() {
    return {
      script: [
        { hid: 'jquery', src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js' },
        { hid: 'webflow', src: '/vendor/webflow/js/main.js' },
      ],
    };
  },
};
</script>

<style lang="scss">
@import "~/assets/webflow/css/normalize.css";
@import "~/assets/webflow/css/webflow.css";
@import "~/assets/webflow/css/main.scss";

.webflow {
  @include webflow;
}
</style>

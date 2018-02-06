<template>
  <div>
    <tool-bars :disableError="true" />
    <div class="container">
      <div class="landing">
        <site-header/>
      </div>
      <nuxt/>
    </div>
    <my-footer/>
  </div>
</template>

<script>
import ToolBars from '~/components/ToolBars';
import MyFooter from '~/components/Footer';
import SiteHeader from '~/components/Header';

export default {
  components: {
    ToolBars,
    MyFooter,
    SiteHeader,
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/index";
@import "../assets/default";
</style>

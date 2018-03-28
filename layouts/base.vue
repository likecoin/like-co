<template>
  <div class="fixed-footer">
    <tool-bars :disableError="['web3', 'locked']" />
    <div class="container">
      <div class="landing">
        <site-header :showLogin="true" />
      </div>
      <nuxt/>
    </div>
    <my-footer/>
  </div>
</template>

<script>
import ToolBars from '~/components/toolbars/ToolBars';
import MyFooter from '~/components/footer/Footer';
import SiteHeader from '~/components/header/Header';

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

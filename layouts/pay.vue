<template>
  <div class="fixed-footer">
    <tool-bars/>
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
import { mapGetters } from 'vuex';

export default {
  components: {
    ToolBars,
    MyFooter,
    SiteHeader,
  },
  computed: {
    ...mapGetters([
      'getHeaderSubtitle',
      'getHeaderIcon',
      'getHeaderTitle',
    ]),
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/index";
@import "../assets/default";

</style>

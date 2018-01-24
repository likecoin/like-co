<template>
  <div>
    <tool-bars/>
    <div class="container">
      <div class="landing">
        <site-header/>
        <avatar-header :title="getHeaderTitle" :icon="getHeaderIcon" :content="getHeaderSubtitle"/>
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
import AvatarHeader from '~/components/AvatarHeader';
import { mapGetters } from 'vuex';

export default {
  components: {
    ToolBars,
    MyFooter,
    SiteHeader,
    AvatarHeader,
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
@import "../assets/index.scss";
@import "../assets/default.scss";

</style>

<template>
  <div class="fixed-footer">
    <tool-bars/>
    <div class="container">
      <div class="landing">
        <div class="upper-left-corner" />
        <site-header />
        <introduction :title="getHeaderTitle" :icon="getHeaderIcon" />
        <Description
          :content="getDesc"
          :showButton="false"
        />
      </div>
      <div class="section-title-wrapper">
        <h2 class="title">{{ getHeaderSubtitle || title }}</h2>
      </div>
      <nuxt/>
    </div>
    <my-footer/>
  </div>
</template>

<script>
import ToolBars from '~/components/toolbars/ToolBars';
import MyFooter from '~/components/Footer';
import SiteHeader from '~/components/Header';
import Introduction from '~/components/Introduction';
import Description from '~/components/Description';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      title: 'Create LikeCoin ID and Redeem',
    };
  },
  components: {
    ToolBars,
    MyFooter,
    SiteHeader,
    Introduction,
    Description,
  },
  computed: {
    ...mapGetters([
      'getDesc',
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

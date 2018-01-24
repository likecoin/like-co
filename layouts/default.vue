<template>
  <div>
    <tool-bars/>
    <div class="container">
      <div class="landing">
        <div class="upper-left-corner" />
        <site-header/>
        <introduction :title="getHeaderTitle" :icon="getHeaderIcon" />
        <description :content="getDesc" />
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
import ToolBars from '~/components/ToolBars';
import MyFooter from '~/components/Footer';
import SiteHeader from '~/components/Header';
import Introduction from '~/components/Introduction';
import Description from '~/components/Description';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      title: 'Create Account and Redeem',
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
@import "../assets/index.scss";
@import "../assets/default.scss";

.section-title-wrapper {
  display: inline-block;
  z-index: 1;
  margin-top: 60px;

  padding: 0 80px;

  text-align: center;

  background-color: $like-light-blue;
  width: 50%;

  > .title {
    letter-spacing: -0.3px;

    color: $like-dark-brown;

    font-size: 32px;
    line-height: 48px;
  }
}

.title
{
  color: #000;
  font-weight: 300;
  font-size: 2.5em;
  margin: 0;
}
</style>

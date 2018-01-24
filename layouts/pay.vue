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

<style lang="scss">
@import "../assets/index.scss";

$large-padding: 64px;
$mid-padding: 24px;
$small-padding: 16px;

html, body {
  background-color: #fff !important;
  height: 100%;
  width: 100%;
}

.landing {
  .upper-left-corner {
    width: 66.66%;
    height: 600px;
    margin-bottom: -600px;
    margin-left: -$large-padding;

    background-color: $like-gray-1;
  }
}

.section-title-wrapper {
  margin-top: 60px;
  z-index: 1;
  display: inline-block;
  padding: 0 80px;
  text-align: center;
  background-color: #d2f0f0;
  width: 50%;
}

.container {
  position: relative;

  display: flex;
  flex-direction: column;

  max-width: 1440px;
  margin: 0 auto;

  overflow: hidden;

  > * {
    margin-right: $large-padding;
    margin-left: $large-padding;
  }
}

@media (max-width: 768px) {
  .container {
    > * {
      margin-right: $mid-padding;
      margin-left: $mid-padding;
    }
    .landing .upper-left-corner {
      margin-left: -$mid-padding;
    }
    .section-title-wrapper {
      width: 100%;
    }
  }
}

@media (max-width: 500px) {
  .container {
    > * {
      margin-right: $small-padding;
      margin-left: $small-padding;
    }

    .landing .upper-left-corner {
      margin-left: -$small-padding;
    }
  }
}

.button, .button:visited
{
  display: inline-block;
  color: black;
  letter-spacing: 1px;
  background-color: #fff;
  border: 2px solid #000;
  text-decoration: none;
  text-transform: uppercase;
  padding: 15px 45px;
}

.button:hover, .button:focus
{
  color: #fff;
  background-color: #000;
}

.title
{
  color: #000;
  font-weight: 300;
  font-size: 2.5em;
  margin: 0;
}
</style>

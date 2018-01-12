<template>
  <div>
    <div class="toolbars">
      <popup-dialog ref="dialog" :allowClose="false"
         :header="dialogHeader" :message="getPopupError"/>
      <loading-toolbar :isLoading="getIsLoading" :isInTransaction="getIsInTransaction"/>
      <error-toolbar :message="getErrorMsg" :icon="getErrorIcon"/>
    </div>
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
import MyFooter from '~/components/Footer';
import ErrorToolbar from '~/components/ErrorToolbar';
import LoadingToolbar from '~/components/LoadingToolbar';
import PopupDialog from '~/components/PopupDialog';
import SiteHeader from '~/components/Header';
import Introduction from '~/components/Introduction';
import Description from '~/components/Description';
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      title: 'Create Account and Redeem',
      dialogHeader: 'Error',
    };
  },
  components: {
    MyFooter,
    LoadingToolbar,
    ErrorToolbar,
    PopupDialog,
    SiteHeader,
    Introduction,
    Description,
  },
  computed: {
    ...mapGetters([
      'getDesc',
      'getHeaderSubtitle',
      'getErrorIcon',
      'getErrorMsg',
      'getPopupError',
      'getHeaderIcon',
      'getHeaderTitle',
      'getIsLoading',
      'getIsInTransaction',
    ]),
  },
  methods: {
    ...mapActions([
      'setErrorMsg',
      'setDialog',
    ]),
  },
};
</script>

<style lang="scss">
@import "../styles/index.scss";

$large-padding: 64px;
$mid-padding: 24px;
$small-padding: 16px;

html, body {
  background-color: #fff !important;
  height: 100%;
  width: 100%;
}

.toolbars {
  top: 0px;
  width: 100%;
  position: fixed;
  z-index: 999;
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

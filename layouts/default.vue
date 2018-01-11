<template>
  <div>
    <div class="toolbars">
      <popup-dialog ref="dialog" :allowClose="false"
         :header="dialogHeader" :message="dialogMsg" :eventName="''" />
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
import EthHelper from '@/util/EthHelper';
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
      web3Error: 'Like function will not work without a wallet, is &nbsp;<a href="https://metamask.io/"> Metamask </a>&nbsp; installed?',
      testnetError: 'You are in wrong ETH network, please switch to testnet '
      + ' &nbsp;<a href="https://www.rinkeby.io/"> Rinkeby </a>&nbsp; in metamask.',
      lockedError: 'Cannot obtain your ETH wallet, please make sure it is UNLOCKED.',
      dialogHeader: 'Error',
      dialogMsg: '',
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
    onConfim() {
      console.log('hihi');
    },
  },
  mounted() {
    console.log(this);
    EthHelper.initApp(
      (err) => {
        let errMsg = '';
        if (err === 'web3') errMsg = this.web3Error;
        else if (err === 'testnet') errMsg = this.testnetError;
        else if (err === 'locked') errMsg = this.lockedError;
        this.setErrorMsg(errMsg);
        if (this.$route.name !== 'index') {
          if (this.dialogMsg === '') this.$refs.dialog.toggleSync();
          this.dialogMsg = errMsg;
        }
      },
      () => {
        this.setErrorMsg('');
        if (this.dialogMsg !== '') this.$refs.dialog.toggleSync();
        this.dialogMsg = '';
      },
    );
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

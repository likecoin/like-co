<template>
  <div>
    <div class="toolbars">
      <loading-toolbar :isLoading="getIsLoading" :isInTransaction="getIsInTransaction"/>
      <error-toolbar :message="getErrorMsg" :icon="getErrorIcon"/>
    </div>
    <div class="container">
      <div class="landing">
        <div class="upper-left-corner" />
        <site-header />
        <introduction :title="getHeaderMsg" :icon="getHeaderIcon" />
        <description />
      </div>
      <div class="section-title-wrapper">
        <span class="title">{{ title }}</span>
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

    };
  },
  components: {
    MyFooter,
    LoadingToolbar,
    ErrorToolbar,
    SiteHeader,
    Introduction,
    Description,
  },
  computed: {
    ...mapGetters([
      'getErrorIcon',
      'getErrorMsg',
      'getHeaderIcon',
      'getHeaderMsg',
      'getIsLoading',
      'getIsInTransaction',
    ]),
  },
  methods: {
    ...mapActions([
      'setErrorMsg',
    ]),
  },
  mounted() {
    EthHelper.initApp(
      (err) => {
        let errMsg = '';
        if (err === 'web3') errMsg = this.web3Error;
        else if (err === 'testnet') errMsg = this.testnetError;
        else if (err === 'locked') errMsg = this.lockedError;
        this.setErrorMsg(errMsg);
      },
      () => {
        this.setErrorMsg('');
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

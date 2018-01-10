<template>
  <div>
    <loading-toolbar :isLoading="getIsLoading"/>
    <error-toolbar :message="getErrorMsg" :icon="getErrorIcon"/>
    <nuxt/>
    <my-footer/>
  </div>
</template>

<script>
import EthHelper from '@/util/EthHelper';
import MyFooter from '~/components/Footer';
import ErrorToolbar from '~/components/ErrorToolbar';
import LoadingToolbar from '~/components/LoadingToolbar';
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
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
  },
  computed: {
    ...mapGetters({
      getErrorIcon: 'getErrorIcon',
      getErrorMsg: 'getErrorMsg',
      getIsLoading: 'getIsLoading',
    }),
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

<style>
.container
{
  margin: 0;
  width: 100%;
  padding: 100px 0;
  text-align: center;
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

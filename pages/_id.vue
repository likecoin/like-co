<template>
  <div class="hello">
    <md-toolbar class="md-layout" v-if="errMsg"><md-progress-spinner md-mode="indeterminate" class="md-warn" /><md-icon class="md-warn">warning</md-icon><div class="md-layout-item" v-html="errMsg" /></md-toolbar>
    <div class="inner-container">
      <h1> {{ displayName }} </h1>
      <form id="paymentInfo" v-on:submit.prevent="onSubmit">
        <img :src="avatar" />
        <md-field :class="isBadAddress?'md-input-invalid':''">
          <label>Author ETH wallet address</label>
          <md-input v-model="wallet" maxlength="42" required />
          <span v-if="isBadAddress" class="md-error">Invalid address format</span>
        </md-field>
        <md-field :class="isBadAmount?'md-input-invalid':''">
          <label>LIKECOIN</label>
          <md-input v-model="amount" maxlength="20" required></md-input>
          <span v-if="isBadAmount" class="md-error">Invalid amount</span>
        </md-field>
        <hr />
        <md-button class="md-raised" type="submit" form="paymentInfo">OK</md-button>
      </form>
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';

import EthHelper from '@/util/EthHelper';
import * as api from '@/util/api/api';
import axios from '~/plugins/axios';

const ONE_LIKE = new BigNumber(10).pow(18);

export default {
  name: 'HelloWorld',
  data() {
    return {
      isBadAddress: false,
      isBadAmount: false,
      errMsg: '',
      web3Error: 'Like function will not work without a wallet, is &nbsp;<a href="https://metamask.io/"> Metamask </a>&nbsp; installed?',
      testnetError: 'You are in wrong ETH network, please switch to testnet '
      + ' &nbsp;<a style="color:#EBB33F" href="https://www.rinkeby.io/"> Rinkeby </a>&nbsp; in metamask.',
      lockedError: 'Cannot obtain your ETH wallet, please make sure it is UNLOCKED.',
    };
  },
  asyncData({ params, error }) {
    return axios.get(`/api/users/${params.id}`)
      .then((res) => {
        const { wallet, avatar, displayName } = res.data;
        const amount = params.amount || 1;
        return {
          wallet,
          avatar,
          displayName,
          amount,
        };
      })
      .catch((e) => { // eslint-disable-line no-unused-vars
        error({ statusCode: 404, message: 'User not found' });
      });
  },
  head() {
    return {
      title: `Pay Likecoin to ${this.displayName}`,
      meta: [
        { hid: 'og_title', property: 'og:title', content: `Pay Likecoin to ${this.displayName}, ` },
        { hid: 'description', name: 'description', content: `Pay Likecoin to ${this.displayName}. Likecoin is the settlement currency for Creative Contents powered by blockchain.` },
        { hid: 'og_description', property: 'og:description', content: `Pay Likecoin to ${this.displayName}. Likecoin is the settlement currency for Creative Contents powered by blockchain.` },
        { hid: 'og_image', property: 'og:image', content: `${this.avatar}` },
      ],
    };
  },
  methods: {
    checkAddress() {
      return this.wallet.length === 42 && this.wallet.substr(0, 2) === '0x';
    },
    onSubmit() {
      this.isBadAddress = false;
      if (!this.checkAddress()) {
        this.isBadAddress = true;
        return;
      }
      try {
        const amount = new BigNumber(this.amount);
        if (!amount || amount.lt('0.000000000000000001')) {
          this.isBadAmount = true;
          return;
        }
      } catch (err) {
        this.isBadAmount = true;
        return;
      }
      console.log(ONE_LIKE.times(new BigNumber(this.amount)).toString(10));
      EthHelper.signTransferDelegated(this.wallet, ONE_LIKE.times(new BigNumber(this.amount)), 0)
        .then(payload => api.apiPostPayment(payload))
        .then((result) => {
          if (!result || !result.data || !result.data.txHash) return;
          this.txHash = result.data.txHash;
          EthHelper.waitForTxToBeMined(
            result.data.txHash,
            () => {},
          );
        })
        .catch((err) => {
          this.errorMsg = err.message || err.response.data;
        });
    },
  },
  mounted() {
    EthHelper.initApp(
      (err) => {
        if (err === 'web3') this.errMsg = this.web3Error;
        else if (err === 'testnet') this.errMsg = this.testnetError;
        else if (err === 'locked') this.errMsg = this.lockedError;
      },
      () => {
        this.errMsg = '';
      },
    );
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

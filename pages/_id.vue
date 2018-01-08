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
        <md-field>
          <label>LIKECOIN</label>
          <md-input v-model="amount" type="number" required></md-input>
        </md-field>
        <hr />
        <md-button class="md-raised" type="submit" form="paymentInfo">OK</md-button>
      </form>
    </div>
  </div>
</template>

<script>
import BN from 'bn.js';

import EthHelper from '@/util/EthHelper';
import * as api from '@/util/api/api';
import axios from '~/plugins/axios';

const ONE_LIKE = new BN(10).pow(new BN(18));

export default {
  name: 'HelloWorld',
  data() {
    return {
      isBadAddress: false,
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
        return {
          wallet,
          avatar,
          displayName,
          amount: params.amount || 0,
        };
      })
      .catch((e) => { // eslint-disable-line no-unused-vars
        error({ statusCode: 404, message: 'User not found' });
      });
  },
  head() {
    return {
      meta: [
        { hid: 'description', name: 'description', content: `Pay Likecoin to ${this.displayName}` },
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
      EthHelper.signTransferDelegated(this.wallet, ONE_LIKE.mul(new BN(this.amount)), 0)
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

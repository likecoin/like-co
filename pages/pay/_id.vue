<template>
  <div class="hello">
    <popup-dialog ref="dialog" :allowClose="true"
       :header="dialogHeader" :message="dialogMsg" @onConfirm="onConfirm" />
    <div class="inner-container">
      <form id="paymentInfo" v-on:submit.prevent="onSubmit">
        <input v-model="wallet" hidden required disabled />
        <md-field :class="isBadAmount?'md-input-invalid':''">
          <label>Amount of LikeCoin to send</label>
          <md-input v-model="amount" maxlength="20" required />
          <span v-if="isBadAmount" class="md-error">Invalid amount</span>
        </md-field>
        <hr />
        <md-button class="md-raised md-primary" type="submit" form="paymentInfo">Send</md-button>
      </form>
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';

import EthHelper from '@/util/EthHelper';
import * as types from '@/store/mutation-types';
import axios from '~/plugins/axios';
import PopupDialog from '~/components/PopupDialog';
import { mapActions, mapGetters } from 'vuex';

const ONE_LIKE = new BigNumber(10).pow(18);

export default {
  name: 'HelloWorld',
  layout: 'pay',
  data() {
    return {
      isBadAddress: false,
      isBadAmount: false,
      dialogHeader: 'Success',
      dialogMsg: '',
    };
  },
  asyncData({ app, params, error }) {
    return axios.get(`/api/users/${params.id}`)
      .then((res) => {
        const { wallet, avatar, displayName } = res.data;
        const amount = params.amount || 1;
        app.store.commit(types.UI_HEADER_UPDATE, {
          title: displayName || params.id,
          subtitle: wallet,
          icon: avatar,
        });
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
  components: {
    PopupDialog,
  },
  head() {
    return {
      title: `Pay LikeCoin to ${this.displayName}`,
      meta: [
        { hid: 'og_title', property: 'og:title', content: `Pay LikeCoin to ${this.displayName}.` },
        { hid: 'description', name: 'description', content: `Pay LikeCoin to ${this.displayName}. LikeCoin is the settlement currency for Creative Contents powered by blockchain.` },
        { hid: 'og_description', property: 'og:description', content: `Pay LikeCoin to ${this.displayName}. LikeCoin is the settlement currency for Creative Contents powered by blockchain.` },
        { hid: 'og_image', property: 'og:image', content: `${this.avatar}` },
      ],
    };
  },
  computed: {
    ...mapGetters([
      'getUserIsRegistered',
    ]),
  },
  methods: {
    ...mapActions([
      'sendPayment',
      'setHeaderMsg',
      'setHeaderIcon',
    ]),
    checkAddress() {
      return this.wallet.length === 42 && this.wallet.substr(0, 2) === '0x';
    },
    async onSubmit() {
      this.isBadAddress = false;
      if (!this.checkAddress()) {
        this.isBadAddress = true;
        return;
      }
      const amount = new BigNumber(this.amount);
      if (!amount || amount.lt('0.000000000000000001')) {
        this.isBadAmount = true;
        return;
      }
      try {
        const payload = await EthHelper.signTransferDelegated(this.wallet, ONE_LIKE.mul(new
          BigNumber(this.amount)), 0);
        await this.sendPayment(payload);
        this.dialogMsg = `You sucessfully paid ${this.amount}LikeCoin to ${this.displayName}`;
        if (!this.getUserIsRegistered) this.dialogMsg += '<br/> Register your own likecoin.store page to get paid in LikeCoin!';
      } catch (error) {
        console.error(error);
      }
    },
    onConfirm() {
      if (!this.getUserIsRegistered) this.$router.push({ name: 'register' });
    },
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

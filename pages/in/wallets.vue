<template>
  <div class="wallet-page">
    <div> currentWallet: {{ getUserInfo.currentWallet || getUserInfo.wallet }} </div>
    <div>
      curentWalletList:
      <div
        v-for="d in getUserWallets"
        :key="d.wallet"
      >
        <a
          :href="d.wallet"
          @click.prevent="onClickWallet(d.wallet)"
        >
          {{ d.type }}: {{ d.wallet }}
        </a>
      </div>
    </div>
    <div v-if="!isBitAssetBinded">
      Bind bitasset:
      <form @submit.prevent="onSubmitBitassetForm">
        area code:
        <input
          v-model="areaCode"
          :disabled="isBitAssetSMSSent"
          required
          type="number"
        ><br>
        mobile phone number:
        <input
          v-model="mobileNumber"
          :disabled="isBitAssetSMSSent"
          required
          type="number"
        >
        SMS verification code:
        <input
          v-model="smsCode"
          :disabled="!isBitAssetSMSSent"
          :required="isBitAssetSMSSent"
          type="number"
        >
        <input
          type="submit"
          :value="isBitAssetSMSSent ? 'Submit' : 'Send SMS'"
        >
      </form>
    </div>
    <div v-else>
      Bitasset already binded
    </div>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'wallets',
  layout: 'in',
  data() {
    return {
      areaCode: undefined,
      mobileNumber: undefined,
      smsCode: undefined,
      isBitAssetSMSSent: false,
    };
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getUserWallets',
    ]),
    isBitAssetBinded() {
      return this.getUserWallets.find(w => w.type === 'bitasset');
    },
  },
  mounted() {
    if (!this.getUserWallets.length) {
      this.fetchUserWalletList();
    }
  },
  methods: {
    ...mapActions([
      'fetchUserWalletList',
      'updateUserWalletSelection',
      'initBitAssetSMS',
      'loginAndLinkBitAsset',
    ]),
    async onClickWallet(wallet) {
      await this.updateUserWalletSelection({ wallet });
    },
    async onSubmitBitassetForm() {
      if (!this.isBitAssetSMSSent) {
        await this.initBitAssetSMS({
          areaCode: this.areaCode,
          mobile: this.mobileNumber,
        });
        this.isBitAssetSMSSent = true;
      } else {
        await this.loginAndLinkBitAsset({
          areaCode: this.areaCode,
          mobile: this.mobileNumber,
          code: this.smsCode,
        });
      }
    },
  },
};
</script>

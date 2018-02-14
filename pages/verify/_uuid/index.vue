<template>
  <div>
    <span v-if="errorMsg">Error: {{ errorMsg }}, returning to 
      <nuxt-link :to="{ name: 'index' }">index</nuxt-link>...</span>
    <span v-else-if="isVerified">Success!, returning to 
      <nuxt-link :to="{ name: 'edit' }">account page</nuxt-link>...</span>
    <span v-else>Verifyinging</span>
    <claim-dialog ref="claimDialog" :couponCode="couponCode" :wallet="wallet" />
  </div>
</template>

<script>
import ClaimDialog from '~/components/ClaimDialog';
import { mapActions } from 'vuex';

export default {
  name: 'VerifyEmail',
  layout: 'base',
  data() {
    return {
      errorMsg: '',
      isVerified: false,
      wallet: '',
    };
  },
  components: {
    ClaimDialog,
  },
  computed: {
    uuid() {
      return this.$route.params.uuid;
    },
    couponCode() {
      return this.$route.params.coupon;
    },
  },
  methods: {
    ...mapActions([
      'verifyEmailByUUID',
    ]),
    async verifyEmail() {
      this.isVerified = false;
      try {
        this.wallet = await this.verifyEmailByUUID(this.uuid);
        this.isVerified = true;
        if (this.couponCode) {
          try {
            await this.$refs.claimDialog.onDirectClaimCoupon(this.wallet);
          } catch (err) {
            setTimeout(() => this.$router.push({ name: 'edit' }), 3000);
          }
        } else {
          setTimeout(() => this.$router.push({ name: 'edit' }), 3000);
        }
      } catch (err) {
        this.errorMsg = err.message || err;
        setTimeout(() => this.$router.push({ name: 'index' }), 3000);
      }
    },
  },
  mounted() {
    this.verifyEmail();
  },
};
</script>

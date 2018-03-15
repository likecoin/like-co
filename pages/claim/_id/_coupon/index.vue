<template>
  <div>
    <span v-if="errorMsg">{{ $t('General.label.error') }}: {{ errorMsg }}, 
      <nuxt-link :to="{ name: 'index' }">{{ $t('Verify.label.toIndex') }}</nuxt-link>...</span>
    <span v-else-if="isVerified">{{ $t('General.label.success') }}, 
      <nuxt-link :to="{ name: 'in-edit' }">{{ $t('Verify.label.toEdit') }}</nuxt-link>...</span>
    <span v-else>{{ $t('Verify.label.verifying') }}</span>
    <claim-dialog ref="claimDialog" :couponCode="couponCode" :wallet="wallet" />
  </div>
</template>

<script>
import ClaimDialog from '~/components/dialogs/ClaimDialog';
import { mapActions } from 'vuex';

export default {
  name: 'ClaimCoupon',
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
    user() {
      return this.$route.params.id;
    },
    couponCode() {
      return this.$route.params.coupon;
    },
  },
  methods: {
    ...mapActions([
      'getWalletByUser',
    ]),
    async claimCoupon() {
      this.isVerified = false;
      try {
        this.wallet = await this.getWalletByUser(this.user);
        if (!this.wallet) throw new Error(this.$t('Transaction.label.userNotFound'));
        this.isVerified = true;
        if (this.couponCode) {
          try {
            await this.$refs.claimDialog.onDirectClaimCoupon({
              wallet: this.wallet,
              coupon: this.couponCode,
            });
          } catch (err) {
            setTimeout(() => this.$router.push({ name: 'in-edit' }), 3000);
          }
        } else {
          setTimeout(() => this.$router.push({ name: 'in-edit' }), 3000);
        }
      } catch (err) {
        this.errorMsg = err.message || err;
        setTimeout(() => this.$router.push({ name: 'index' }), 3000);
      }
    },
  },
  mounted() {
    this.claimCoupon();
  },
};
</script>

<template>
    <md-dialog-confirm
      :md-active.sync="isConfirming"
      md-title="Claim coupon"
      :md-content="confirmContent"
      md-confirm-text="Confirm"
      md-cancel-text="Cancel"
      @md-cancel="onCancel"
      @md-confirm="onConfirm" />
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'claim-dialog',
  props: ['couponCode', 'wallet'],
  data() {
    return {
      isConfirming: false,
      confirmContent: '',
      onConfirm: () => {},
    };
  },
  methods: {
    ...mapActions([
      'setErrorMsg',
      'checkCoupon',
      'claimCoupon',
      'isUser',
    ]),
    onCancel() {
      this.$router.push({ name: 'edit' });
    },
    async onSubmit() {
      if (this.couponCode) {
        this.isConfirming = true;
        this.confirmContent = 'Loading coupon content...';
        try {
          const { value } = await this.checkCoupon(this.couponCode);
          if (!value) throw new Error('Invalid coupon');
          this.confirmContent = `Are you sure you want to claim ${value} LikeCoin?`;
          this.onConfirm = async () => {
            try {
              await this.claimCoupon({ coupon: this.couponCode, to: this.wallet });
              this.isUser(this.wallet);
            } catch (error) {
              this.isConfirming = true;
              this.confirmContent = `Error: ${error.message || error || 'Invalid coupon code'}! Redirecting to your account page...`;
              this.onConfirm = this.onCancel;
            }
          };
        } catch (error) {
          this.isConfirming = true;
          this.confirmContent = `Error: ${error.message || error || 'Invalid coupon code'}! Redirecting to your account page...`;
          this.onConfirm = this.onCancel;
        }
      }
    },
  },
};
</script>

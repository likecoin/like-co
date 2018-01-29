<template>
  <md-dialog 
      :md-active.sync="isConfirming">
    <div class="title-bar"></div>
    <md-dialog-title v-if="title">{{ title }}</md-dialog-title>
    <md-dialog-content v-if="confirmContent" v-html="confirmContent" />

    <section>
      <md-button id="btn-confirm" class="md-primary" @click="onConfirm">Confirm</md-button>
      <md-button id="btn-cancel" class="md-primary" @click="onCancel">Cancel</md-button>
    </section>
  </md-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'claim-dialog',
  props: ['couponCode', 'wallet'],
  data() {
    return {
      isConfirming: false,
      title: 'Claim coupon',
      confirmContent: '',
      onConfirm: () => {},
    };
  },
  computed: {
    ...mapGetters([
      'getIsShowingTxPopup',
    ]),
  },
  methods: {
    ...mapActions([
      'setErrorMsg',
      'checkCoupon',
      'claimCoupon',
      'isUser',
      'closeTxDialog',
    ]),
    onCancel() {
      this.isConfirming = false;
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
            this.isConfirming = false;
            try {
              const txHash = await this.claimCoupon({ coupon: this.couponCode, to: this.wallet });
              if (this.getIsShowingTxPopup) {
                this.closeTxDialog();
                this.$router.push({ name: 'tx-id', params: { id: txHash } });
              }
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

<style scoped>

.md-dialog {
  max-width: 500px;
  min-height: 188px;
  border-radius: 6px;
  overflow: hidden;
}

.title-bar {
  position: absolute;
  top: 0px;
  width: 100%;
  height: 48px;
  background-color: #e6e6e6;
}

.md-dialog-title {
  padding-top: 70px;
  margin-left: 20px;
  margin-right: 20px;
  font-size: 32px;
  font-weight: 300;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: -0.3px;
  text-align: left;
  color: #462405;
}

.md-dialog-content {
  margin-left: 20px;
  margin-right: 20px;
  font-size: 16px;
  font-weight: 300;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.63;
  letter-spacing: -0.1px;
  text-align: left;
  color: #737373;
}

.md-dialog-actions {
  display: table;
}

#btn-cancel {
  width: 256px;
  height: 40px;
  font-size: 24px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: -0.2px;
  text-align: center;
  color: #ffffff;
  background-color: #6e2828;
}

#btn-confirm {
  width: 256px;
  height: 40px;
  font-size: 24px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: -0.2px;
  text-align: center;
  color: #ffffff;
  background-color: #28646e;
}

.md-button {
  height: 40px;
  margin-left: 20%;
  margin-right: 20%;
  font-size: 20px;
  align-self: center;
}

section {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>

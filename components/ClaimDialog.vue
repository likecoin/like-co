<template>
  <md-dialog 
      :md-active.sync="showDialog">
    <div class="title-bar" />
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
      showDialog: false,
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
      this.showDialog = false;
    },
    async onSubmit() {
      if (this.couponCode) {
        this.showDialog = true;
        this.confirmContent = 'Loading coupon content...';
        try {
          const { value } = await this.checkCoupon(this.couponCode);
          if (!value) throw new Error('Invalid coupon');
          this.confirmContent = `Are you sure you want to claim ${value} LikeCoin?`;
          this.onConfirm = async () => {
            this.showDialog = false;
            try {
              const txHash = await this.claimCoupon({ coupon: this.couponCode, to: this.wallet });
              if (this.getIsShowingTxPopup) {
                this.closeTxDialog();
                this.$router.push({ name: 'tx-id', params: { id: txHash } });
              }
            } catch (error) {
              this.showDialog = true;
              this.confirmContent = `Error: ${error.message || error || 'Invalid coupon code'}! Redirecting to your account page...`;
              this.onConfirm = this.onCancel;
            }
          };
        } catch (error) {
          this.showDialog = true;
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
  min-width: 400px;
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
  line-height: normal;
  letter-spacing: -0.3px;
  color: #462405;
}

.md-dialog-content {
  margin-left: 20px;
  margin-right: 20px;
  font-size: 16px;
  line-height: 1.63;
  color: #737373;
}

#btn-cancel {
  background-color: #6e2828;
  color: #ffffff;
}

#btn-confirm {
  background-color: #28646e;
  color: #ffffff;
}

.md-button {
  width: 256px;
  height: 40px;
  margin-left: 20%;
  margin-right: 20%;
  align-self: center;
  font-size: 24px;
  text-align: center;
}

section {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>

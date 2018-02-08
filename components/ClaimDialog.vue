<template>
  <md-dialog
    :md-active.sync="showDialog"
    :md-close-on-esc="false"
    :md-click-outside-to-close="false"
    :md-fullscreen="false">
    <div class="title-bar" />
    <div class="dialog-content">
      <md-dialog-title v-if="title">{{ title }}</md-dialog-title>
      <md-dialog-content v-if="confirmContent">
        <md-icon v-if="isError">error</md-icon>
        <span v-html="confirmContent" />
      </md-dialog-content>
      <section>
        <md-button id="btn-confirm" class="md-primary" @click="onConfirm">Confirm</md-button>
        <md-button v-if="!isError" id="btn-cancel" class="md-primary" @click="onCancel">Cancel</md-button>
      </section>
    </div>
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
      isError: false,
      confirmContent: '',
      onConfirm: () => {},
    };
  },
  computed: {
    ...mapGetters([
      'getIsShowingTxPopup',
    ]),
    title() {
      return this.isError ? 'Coupon Error' : 'Claim coupon';
    },
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
        this.isError = false;
        this.confirmContent = 'Loading coupon content...';
        this.showDialog = true;
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
                this.$router.push({ name: 'tx-id', params: { id: txHash, tx: { to: this.wallet } } });
              }
            } catch (error) {
              this.isError = true;
              this.confirmContent = `Error: ${error.message || error || 'Invalid coupon code'}! <br /> Redirecting to your account page...`;
              this.onConfirm = this.onCancel;
              this.showDialog = true;
            }
          };
        } catch (error) {
          this.isError = true;
          this.confirmContent = `Error: ${error.message || error || 'Invalid coupon code'}!  <br /> Redirecting to your account page...`;
          this.onConfirm = this.onCancel;
          this.showDialog = true;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/dialog";

.md-dialog-container {
  .title-bar {
    background-color: #e6e6e6;
  }

  .dialog-content {
    > section {
      display: flex;
      flex-direction: column;
      margin-top: 36px;

      #btn-cancel {
        background-color: $like-gradient-3;
        color: $like-white;
      }

      #btn-confirm {
        background-color: $like-green;
        color: $like-white;
      }
    }
  }
}
</style>

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
        <md-button id="btn-confirm" class="md-primary" @click="onConfirm">
          {{ $t('General.button.confirm') }}
        </md-button>
        <md-button v-if="!isError" id="btn-cancel" class="md-primary" @click="onCancel">
          {{ $t('General.button.cancel') }}
        </md-button>
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
      return this.isError ? this.$t('Dialog.coupon.title.error') : this.$t('Dialog.coupon.title.claim');
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
        this.confirmContent = this.$t('Dialog.coupon.label.confirming');
        this.showDialog = true;
        try {
          const { value } = await this.checkCoupon(this.couponCode);
          if (!value) throw new Error(this.$t('Dialog.coupon.label.invalidCoupon'));
          this.confirmContent = this.$t('Dialog.coupon.label.confirmToClaim', { value });
          this.onConfirm = this.onDirectClaimCoupon;
        } catch (error) {
          this.isError = true;
          this.confirmContent = `${this.$t('General.label.error')}: ${error.message || error || this.$t('Dialog.coupon.label.error')}!  <br /> ${this.$t('Dialog.coupon.label.redirecting')}`;
          this.onConfirm = this.onCancel;
          this.showDialog = true;
        }
      }
    },
    async onDirectClaimCoupon({ wallet: claimWallet, coupon: claimCoupon }) {
      const wallet = claimWallet || this.wallet;
      const coupon = claimCoupon || this.couponCode;
      this.showDialog = false;
      try {
        const txHash = await this.claimCoupon({ coupon, to: wallet });
        if (this.getIsShowingTxPopup) {
          this.closeTxDialog();
          this.$router.push({ name: 'in-tx-id', params: { id: txHash, tx: { to: wallet } } });
        }
      } catch (error) {
        this.isError = true;
        this.confirmContent = `${this.$t('General.label.error')}: ${error.message || error || this.$t('Dialog.coupon.label.error')}! <br /> ${this.$t('Dialog.coupon.label.redirecting')}`;
        this.onConfirm = this.onCancel;
        this.showDialog = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/dialog";

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

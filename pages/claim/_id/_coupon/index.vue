<template>
  <div class="lc-margin-vertical-32">
    <div class="lc-container-0">
      <div class="lc-container-1">
        <div class="lc-container-2">
          <div class="lc-container-3">
            <div class="lc-container-4">
              <span v-if="errorMsg">
                {{ $t('General.label.error') }}: {{ errorMsg }},
                <nuxt-link :to="{ name: 'index' }">
                  {{ $t('Verify.label.toIndex') }}
                </nuxt-link>
                ...
              </span>
              <span v-else-if="isVerified">
                {{ $t('General.label.success') }},
                <nuxt-link :to="{ name: 'in-edit' }">
                  {{ $t('Verify.label.toEdit') }}
                </nuxt-link>
                ...
              </span>
              <span v-else>
                {{ $t('Verify.label.verifying') }}
              </span>
              <claim-dialog ref="claimDialog" :couponCode="couponCode" :wallet="wallet" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <tool-bars :disableError="['web3', 'locked']" />
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import ClaimDialog from '~/components/dialogs/ClaimDialog';
import ToolBars from '~/components/toolbars/ToolBars';

export default {
  name: 'ClaimCoupon',
  data() {
    return {
      errorMsg: '',
      isVerified: false,
      wallet: '',
    };
  },
  components: {
    ClaimDialog,
    ToolBars,
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

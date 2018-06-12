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
                <span v-if="hasReferrer">
                  {{ $t('Verify.label.referral') }},
                </span>
                <nuxt-link v-if="redirect" :to="{ name: redirect }">
                  {{ $t('Verify.label.redirect') }}
                </nuxt-link>
                <nuxt-link v-else :to="{ name: 'in', hash: '#earn' }">
                  {{ $t('Verify.label.toEdit') }}
                </nuxt-link>
                ...
              </span>
              <span v-else>{{ $t('Verify.label.verifying') }}</span>
              <claim-dialog ref="claimDialog" :couponCode="couponCode" :wallet="wallet" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { logTrackerEvent } from '@/util/EventLogger';
import ClaimDialog from '~/components/dialogs/ClaimDialog';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'VerifyEmail',
  data() {
    return {
      errorMsg: '',
      isVerified: false,
      wallet: '',
      hasReferrer: false,
      redirectTimer: null,
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
    redirect() {
      return this.$route.query.ref || '';
    },
    ...mapGetters([
      'getUserInfo',
    ]),
  },
  methods: {
    ...mapActions([
      'verifyEmailByUUID',
      'refreshUserInfo',
      'showLoginWindow',
    ]),
    async verifyEmail() {
      this.isVerified = false;
      try {
        const { referrer, wallet } = await this.verifyEmailByUUID(this.uuid);
        if (this.getUserInfo.user) await this.refreshUserInfo(this.getUserInfo.user);
        this.wallet = wallet;
        this.hasReferrer = referrer;
        logTrackerEvent(this, 'RegFlow', 'EmailVerifySuccessful', 'email verified successfully', 1);
        this.isVerified = true;
        if (this.couponCode) {
          try {
            await this.$refs.claimDialog.onDirectClaimCoupon({
              wallet,
              coupon: this.couponCode,
            });
            logTrackerEvent(this, 'RegFlow', 'GetRedPocketSuccessful', 'redeem the red pocket', 1);
          } catch (err) {
            this.redirectTimer = setTimeout(() => {
              this.showLoginWindow(); // force showing login window for redirect
              if (this.redirect) {
                this.$router.push({ name: this.redirect });
              } else {
                this.$router.push({ name: 'in', hash: '#earn' });
              }
            }, 3000);
          }
        } else if (!this.referrer) {
          this.redirectTimer = setTimeout(() => {
            this.showLoginWindow(); // force showing login window for redirect
            if (this.redirect) {
              this.$router.push({ name: this.redirect });
            } else {
              this.$router.push({ name: 'in', hash: '#earn' });
            }
          }, 3000);
        }
      } catch (err) {
        this.errorMsg = err.message || err;
        this.redirectTimer = setTimeout(() => this.$router.push({ name: 'index' }), 3000);
      }
    },
  },
  mounted() {
    this.verifyEmail();
  },
  beforeDestroy() {
    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer);
      this.redirectTimer = null;
    }
  },
};
</script>

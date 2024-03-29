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
                {{ $t('General.label.success') }}
                <nuxt-link
                  v-if="redirect"
                  :to="{ name: redirect }"
                >
                  {{ $t('Verify.label.redirect') }}
                </nuxt-link>
                <nuxt-link
                  v-else
                  :to="{ name: 'in', hash: '#earn' }"
                >
                  {{ $t('Verify.label.toEdit') }}
                </nuxt-link>
                ...
              </span>
              <span v-else>{{ $t('Verify.label.verifying') }}</span>
              <claim-dialog
                ref="claimDialog"
                :couponCode="couponCode"
                :wallet="wallet"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { logTrackerEvent } from '@/util/EventLogger';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'verify-email',
  data() {
    return {
      errorMsg: '',
      isVerified: false,
      wallet: '',
      redirectTimer: null,
    };
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
      'getUserIsRegistered',
    ]),
  },
  mounted() {
    if (this.getUserIsRegistered && this.getUserInfo.isEmailVerified) {
      this.postVerifyAction();
    } else {
      this.verifyEmail();
    }
  },
  beforeDestroy() {
    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer);
      this.redirectTimer = null;
    }
  },
  methods: {
    ...mapActions([
      'verifyEmailByUUID',
      'refreshUserInfo',
    ]),
    async verifyEmail() {
      this.isVerified = false;
      try {
        const { wallet } = await this.verifyEmailByUUID(this.uuid);
        this.wallet = wallet;
        logTrackerEvent(this, 'RegFlow', 'EmailVerifySuccessful', 'email verified successfully', 1);
        this.isVerified = true;
        this.refreshUserInfo();
        this.redirectTimer = setTimeout(() => {
          this.postVerifyAction();
        }, 3000);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errorMsg = this.$t('Verify.label.expiredOrNotFound');
        } else {
          this.errorMsg = err.message || err;
        }
        this.redirectTimer = setTimeout(() => this.$router.push({ name: 'index' }), 10000);
      }
    },
    postVerifyAction() {
      if (this.redirect) {
        this.$router.push({ name: this.redirect });
      } else {
        this.$router.push({ name: 'in', hash: '#earn' });
      }
    },
  },
};
</script>

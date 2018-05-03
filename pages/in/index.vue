<template>
  <div class="overview-page">

    <div class="bonus-container lc-margin-top-48 lc-mobile">
      <section class="lc-container-1">
        <div class="lc-container-header">
          <div class="lc-container-2 lc-container-header-overlay">
            <div class="lc-container-3 lc-bg-gray-1" />
          </div>
          <div class="lc-container-2">
            <div class="lc-container-3">
              <div class="lc-container-4">
                <div class="lc-container-header-title">
                  <h1 class="lc-font-size-32 lc-mobile">
                    {{ $t('BonusPage.title') }}
                  </h1>
                </div>
                <md-button
                  class="md-likecoin lc-container-header-button"
                  @click="$router.push({ name: 'in-bonus' })">
                  {{ $t('BonusPage.button.moreBonus') }}
                </md-button>
              </div>
            </div>
          </div>
        </div>

        <div class="lc-container-2">
          <div class="lc-container-3 lc-container-no-padding-mobile lc-padding-vertical-32 lc-bg-gray-1">
            <div class="lc-container-4 lc-container-no-padding-mobile">

              <mission-list
                :missions="getShortMissionList"
                :is-grid="false"
                @click="onMissionClick"/>

              <div class="section-btn-container lc-padding-top-24 bonus-button-container">
                <md-button
                  class="section-button md-likecoin"
                  @click="$router.push({ name: 'in-bonus' })">
                  {{ $t('BonusPage.button.moreBonus') }}
                </md-button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>


    <div id="coupon" class="lc-margin-top-48 lc-mobile">
      <section class="lc-container-1">

        <div class="lc-container-header">
          <div class="lc-container-2 lc-container-header-overlay">
            <div class="lc-container-3 lc-bg-gray-1" />
          </div>
          <div class="lc-container-2">
            <div class="lc-container-3">
              <div class="lc-container-4">
                <div class="lc-container-header-title">
                  <h1 class="lc-font-size-32 lc-mobile">
                    {{ $t('Edit.label.redeemCoin') }}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1 lc-padding-vertical-32">
            <div class="lc-container-4">
              <form id="redeemForm" v-on:submit.prevent="onSubmitCoupon">
                <md-field>
                  <label class="input-redeem-hint lc-font-size-20">
                    {{ $t('Edit.label.redeemCode') }}
                  </label>
                  <md-input
                    pattern="[2-9A-HJ-NP-Za-km-z]{8}"
                    v-model="couponCode"
                    :title="$t('Edit.label.validCodeRequired')"
                    required />
                </md-field>
                <div class="section-btn-container lc-padding-top-48 lc-mobile">
                  <md-button
                    class="section-button md-likecoin"
                    id="confirm-btn"
                    type="submit"
                    form="redeemForm"
                    :disabled="getIsInTransaction">
                    {{ $t('General.button.confirm') }}
                  </md-button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <claim-dialog
        ref="claimDialog"
        :couponCode="couponCode"
        :wallet="wallet" />
    </div>


    <div class="lc-margin-top-48 lc-mobile">
      <section class="lc-container-1">
        <div class="lc-container-header">
          <div class="lc-container-2 lc-container-header-overlay">
            <div class="lc-container-3 lc-bg-gray-1" />
          </div>
          <div class="lc-container-2">
            <div class="lc-container-3">
              <div class="lc-container-4">
                <div class="lc-container-header-title">
                  <h1 class="lc-font-size-32 lc-mobile">
                    {{ $t('TransactionHistory.title') }}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lc-container-2">
          <transaction-history
            ref="txHistory"
            :address="wallet"
            :showTokensale="true"
            />
        </div>
      </section>
    </div>

    <view-etherscan :address="wallet" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import LikeCoinAmount from '~/components/LikeCoinAmount';
import MaterialButton from '~/components/MaterialButton';
import MissionList from '@/components/Mission/List';
import ClaimDialog from '~/components/dialogs/ClaimDialog';
import InputDialog from '~/components/dialogs/InputDialog';
import TransactionHistory from '~/components/TransactionHistory';
import ViewEtherscan from '~/components/ViewEtherscan';

import EditIcon from '@/assets/icons/edit.svg';
import EditWhiteIcon from '@/assets/icons/edit-white.svg';
import TickIcon from '@/assets/tokensale/tick.svg';

export default {
  name: 'in',
  layout: 'in',
  data() {
    return {
      couponCode: '',
      wallet: '',
      EditIcon,
      EditWhiteIcon,
      TickIcon,
      freeCoupon: '',
    };
  },
  components: {
    ClaimDialog,
    InputDialog,
    LikeCoinAmount,
    MaterialButton,
    MissionList,
    TransactionHistory,
    ViewEtherscan,
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getIsInTransaction',
      'getIsPopupBlocking',
      'getCurrentLocale',
      'getUserIsReady',
      'getUserNeedAuth',
      'getUserIsRegistered',
      'getShortMissionList',
    ]),
  },
  methods: {
    ...mapActions([
      'newUser',
      'loginUser',
      'setInfoMsg',
      'checkCoupon',
      'sendVerifyEmail',
      'sendCouponCodeEmail',
      'refreshUserInfo',
      'fetchUserReferralStats',
      'refreshMissionList',
      'onMissionClick',
    ]),
    async updateInfo() {
      const user = this.getUserInfo;
      this.wallet = user.wallet;
      this.$refs.txHistory.updateTokenSaleHistory();
      this.refreshMissionList(this.getUserInfo.user);
    },
    async onSubmitCoupon() {
      try {
        await this.$refs.claimDialog.onSubmit();
      } catch (err) {
        console.error(err);
      }
    },
  },
  watch: {
    getUserIsReady(a) {
      if (a) {
        if (this.getUserIsRegistered) {
          this.updateInfo();
        }
      }
    },
  },
  mounted() {
    const { hash } = document.location;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) element.scrollIntoView();
    }
    if (this.getUserIsReady) {
      if (this.getUserIsRegistered) {
        this.updateInfo();
      }
    }
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

.section-redeem-edit-mode {
  opacity: .3;
}

#coupon {
  #redeemForm {
    :not(.md-focused) .input-redeem-hint {
      font-size: 20px;
    }
  }
}

.section-btn-container {
  text-align: center;

  @media (min-width: 768 + 1px) {
    text-align: right;

    .bonus-container & {
      text-align: center;
    }

    .section-button {
      width: calc(33.33% - 16px);
    }
  }

}

.bonus-container {
  .bonus-button-container {
    @media (min-width: 960 + 1px) {
      display: none;
    }
  }
}
</style>

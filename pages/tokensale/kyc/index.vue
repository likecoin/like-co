<template>
  <form id="kycForm" @submit.prevent="onNext">
    <div>Current KYC Status: {{ KYCStatus }}</div>
    <section v-if="stage == 0">
      <div class="md-layout">
        <label class="md-layout-item md-size-100">Are you a citizen of PRC?</label>
        <div class="md-layout md-layout-item">
          <md-radio v-model="notPRC" class="md-layout-item" :value="false">Yes</md-radio>
          <md-radio v-model="notPRC" class="md-layout-item" :value="true">No</md-radio>
        </div>
      </div>
      <div class="md-layout">
        <label class="md-layout-item md-size-100">Are you a citizen of USA?</label>
        <div class="md-layout md-layout-item">
          <md-radio v-model="notUSA" name="isUSA" class="md-layout-item" :value="false">Yes</md-radio>
          <md-radio v-model="notUSA" name="isUSA" class="md-layout-item" :value="true">No</md-radio>
        </div>
      </div>
      <md-button type="submit" form="kycForm">Next</md-button>
    </section>
    <section v-else-if="stage == 1">
      <div class="md-layout">
        <label class="md-layout-item md-size-100">Are you going to purchase more than USD10000?</label>
        <div class="md-layout md-layout-item">
          <md-radio v-model="isBelowThersold" class="md-layout-item" :value="false">Yes</md-radio>
          <md-radio v-model="isBelowThersold" class="md-layout-item" :value="true">No</md-radio>
        </div>
      </div>
      <md-button type="submit" form="kycForm">Next</md-button>
    </section>
    <section v-else-if="stage == 2">
        <h2>Advanced KYC</h2>
        Please contact us in intercom directly
    </section>
    <section v-else-if="stage == 9">
        <div>Please Sign your transaction and confirm!</div>
        <md-button v-if="!signed" @click="signKYC()">Try Again</md-button>
    </section>
    <section v-else-if="stage == 90">
        Your KYC is in progress.
    </section>
    <section v-else-if="stage == 91">
        You have already completed Standard KYC.
        <md-button @click="goToTokenSale">Go to TokenSale</md-button>
        <md-button type="submit" form="kycForm">Advance KYC</md-button>
        <!-- TODO: upload KYC -->
    </section>
    <section v-else-if="stage == 92">
        You have already completed Advanced KYC.
        <md-button @click="goToTokenSale">Go to TokenSale</md-button>
    </section>
    <section v-else-if="stage == 99">
        Please contact us in intercom directly
        <!-- TODO: upload KYC -->
    </section>
    <popup-dialog
      :allowClose="false"
      :header="$t('KYC.label.kyc')"
      :message="popupMessage"
      @onConfirm="goToEdit"/>
  </form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import PopupDialog from '~/components/dialogs/PopupDialog';
import User from '@/util/User';
import EthHelper from '@/util/EthHelper';

export default {
  name: 'KYC',
  layout: 'baseWithBackground',
  components: {
    PopupDialog,
  },
  data() {
    return {
      stage: 0,
      notPRC: true,
      notUSA: true,
      isBelowThersold: true,
      ended: false,
      signed: false,
      KYCStatus: 'None',
      popupMessage: '',
    };
  },
  computed: {
    ...mapGetters({
      getUserIsRegistered: 'getUserIsRegistered',
      getUserInfo: 'getUserInfo',
      getUserIsFetching: 'getUserIsFetching',
      wallet: 'getLocalWallet',
    }),
  },
  methods: {
    ...mapActions([
      'sendKYC',
      'startLoading',
      'stopLoading',
    ]),
    async onNext() {
      switch (this.stage) {
        case 0: {
          if (!this.notPRC || !this.notUSA) {
            this.stage = 99;
            if (this.$intercom) this.$intercom.show();
          } else {
            this.stage = 1;
          }
          break;
        }
        case 1: {
          if (this.isBelowThersold) {
            this.stage = 9;
            await this.signKYC();
          } else {
            if (this.$intercom) this.$intercom.show();
            this.stage = 2;
            console.log('TODO: upload KYC');
          }
          break;
        }
        case 91: {
          this.stage = 2;
          break;
        }
        default: {
          // do nothing
          break;
        }
      }
    },
    async signKYC() {
      const {
        notPRC,
        notUSA,
        isBelowThersold,
        wallet,
      } = this;
      const userInfo = {
        user: this.getUserInfo.user,
        wallet,
        notPRC,
        notUSA,
        isBelowThersold,
      };
      this.ended = true;
      const payload = await User.formatAndSignKYC(userInfo);
      this.signed = true;
      await this.sendKYC(payload);
    },
    async updateKYC() {
      if (!this.getUserInfo.isEmailVerified) {
        this.popupMessage = this.$t('KYC.label.emailVerify');
      }
      const status = this.getUserInfo.KYC;
      const isKYC = await EthHelper.queryKYCStatus(this.wallet);
      switch (status) {
        case 3: {
          this.KYCStatus = isKYC ? 'Advanced' : 'ProcessingTx';
          this.stage = isKYC ? 92 : 90;
          break;
        }
        case 2: {
          this.KYCStatus = isKYC ? 'Standard' : 'ProcessingTx';
          this.stage = isKYC ? 91 : 90;
          break;
        }
        case 1: {
          this.KYCStatus = 'InProgress';
          this.stage = 90;
          break;
        }
        default:
          this.KYCStatus = 'None';
      }
      this.stopLoading();
    },
    goToEdit() {
      this.$router.push({ name: 'edit', params: { showEmail: true } });
    },
    goToTokenSale() {
      this.$router.push({ name: 'tokensale' });
    },
  },
  watch: {
    getUserIsFetching(f) {
      if (!f) {
        if (!this.getUserIsRegistered) {
          this.$router.push({ name: 'register' });
        } else {
          this.updateKYC();
        }
      }
    },
  },
  mounted() {
    this.startLoading();
    if (!this.getUserIsFetching) {
      if (!this.getUserIsRegistered) {
        this.$router.push({ name: 'register' });
      } else {
        this.updateKYC();
      }
    }
  },
};
</script>

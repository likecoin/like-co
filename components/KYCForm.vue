<template>
  <form id="kycForm" @submit.prevent="onNext">
    <div>Current KYC Status: {{ status }}</div>
    <section v-if="stage == 0">
      <md-button type="submit" form="kycForm">Start KYC</md-button>
    </section>
    <section v-if="stage == 1">
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
    <section v-else-if="stage == 2">
      <div class="md-layout">
        <label class="md-layout-item md-size-100">Are you going to purchase more than USD{{ KYC_USD_LIMIT }}?</label>
        <div class="md-layout md-layout-item">
          <md-radio v-model="isBelowThersold" class="md-layout-item" :value="false">Yes</md-radio>
          <md-radio v-model="isBelowThersold" class="md-layout-item" :value="true">No</md-radio>
        </div>
      </div>
      <md-button type="submit" form="kycForm">Next</md-button>
    </section>
    <section v-else-if="stage == 3">
        <h2>Advanced KYC</h2>
        <md-field>
          <label>{{ $t('KYC.form.passportName') }}</label>
          <md-input v-model="passportName" />
        </md-field>
        <md-field>
          <label >Country</label>
          <md-select v-model="country">
            <md-option v-for="country in COUNTRY_LIST" :key="country.code" :value="country.code">{{country.name}}</md-option>
          </md-select>
        </md-field>
        <div class="id-container">
          <img class="id-image" :src="documentData0" />
          <md-button
            class="input-display-btn"
            @click="openPicker('inputFile0')">
            <md-icon>file_upload</md-icon> Passport Info
          </md-button>
          <input type="file" ref="inputFile0" accept="image/*" @change="previewImage0" required />
        </div>
        <div class="id-container">
          <img class="id-image" :src="documentData1" />
          <md-button
            class="input-display-btn"
            @click="openPicker('inputFile1')">
            <md-icon>file_upload</md-icon> Address Proof
          </md-button>
          <input type="file" ref="inputFile1" accept="image/*" @change="previewImage1" required />
        </div>
        <md-button type="submit" form="kycForm">Next</md-button>
    </section>
    <section v-else-if="stage == 9">
        <div>Please Sign your transaction and confirm!</div>
        <md-button v-if="!signed" @click="signKYC(this.isAdvanced)">Try Again</md-button>
    </section>
    <section v-else-if="stage == 90">
        Your KYC is in progress.
    </section>
    <section v-else-if="stage == 91">
        You have already completed Standard KYC.
        <md-button type="submit" form="kycForm">Start Advance KYC</md-button>
        <!-- TODO: upload KYC -->
    </section>
    <section v-else-if="stage == 92">
        You have already completed Advanced KYC.
    </section>
    <section v-else-if="stage == 99">
        Please contact us in intercom directly
    </section>
    <popup-dialog
      :allowClose="false"
      :header="$t('KYC.label.kyc')"
      :message="popupMessage"
      @onConfirm="goToEdit"/>
  </form>
</template>

<script>
import EditWhiteIcon from '@/assets/icons/edit-white.svg';
import { KYC_USD_LIMIT, KYC_STATUS_ENUM } from '@/constant';
import COUNTRY_LIST from '@/constant/country-list';
import User from '@/util/User';
import PopupDialog from '~/components/dialogs/PopupDialog';
import { mapActions } from 'vuex';

export default {
  name: 'KYC',
  props: ['KYCStatus', 'isKYCTxPass', 'user', 'wallet'],
  components: {
    PopupDialog,
  },
  data() {
    return {
      EditWhiteIcon,
      KYC_USD_LIMIT,
      COUNTRY_LIST,
      stage: 0,
      status: 'None',
      notPRC: true,
      notUSA: true,
      isBelowThersold: true,
      passportName: '',
      country: '',
      documentData0: null,
      documentData1: null,
      documentFile0: '',
      documentFile1: '',
      signed: false,
      popupMessage: '',
      isAdvanced: false,
    };
  },
  methods: {
    ...mapActions([
      'sendKYC',
      'refreshUserInfo',
    ]),
    openPicker(inputFile) {
      this.$refs[inputFile].click();
    },
    previewImage0(event) {
      const { files } = event.target;
      if (files && files[0]) {
        [this.documentFile0] = Object.values(files);
        const reader = new FileReader();
        reader.onload = (e) => {
          this.documentData0 = e.target.result;
        };
        reader.readAsDataURL(files[0]);
      }
    },
    previewImage1(event) {
      const { files } = event.target;
      if (files && files[0]) {
        [this.documentFile1] = Object.values(files);
        const reader = new FileReader();
        reader.onload = (e) => {
          this.documentData1 = e.target.result;
        };
        reader.readAsDataURL(files[0]);
      }
    },
    async onNext() {
      switch (this.stage) {
        case 0: {
          this.stage += 1;
          break;
        }
        case 1: {
          if (!this.notPRC || !this.notUSA) {
            this.stage = 99;
            if (this.$intercom) this.$intercom.show();
          } else {
            this.stage += 1;
          }
          break;
        }
        case 2: {
          if (this.isBelowThersold) {
            this.stage = 9;
            await this.signKYC();
          } else {
            if (this.$intercom) this.$intercom.show();
            this.stage += 1;
          }
          break;
        }
        case 3: {
          this.isAdvanced = true;
          this.stage = 9;
          await this.signKYC(true);
          break;
        }
        case 91: {
          this.stage = 3;
          break;
        }
        default: {
          // do nothing
          break;
        }
      }
    },
    async signKYC(isAdv) {
      const {
        notPRC,
        notUSA,
        isBelowThersold,
        wallet,
        passportName,
        country,
        documentFile0,
        documentFile1,
      } = this;
      const { user } = this.user;
      const userInfo = {
        user,
        wallet,
        notPRC,
        notUSA,
        isBelowThersold,
      };
      if (isAdv) {
        userInfo.passportName = passportName;
        userInfo.country = country;
        userInfo.documentFile0 = documentFile0;
        userInfo.documentFile1 = documentFile1;
      }
      const payload = await User.formatAndSignKYC(userInfo);
      this.signed = true;
      await this.sendKYC({ payload, isAdv });
      await this.refreshUserInfo(user);
      this.popupMessage = this.$t('KYC.label.done');
    },
    async updateKYC() {
      if (!this.getUserInfo.isEmailVerified) {
        this.popupMessage = this.$t('KYC.label.emailVerify');
      }
      const { isKYCTxPass, KYCStatus } = this;
      switch (KYCStatus) {
        case KYC_STATUS_ENUM.ADVANCED: {
          this.status = isKYCTxPass ? 'Advanced' : 'ProcessingTx';
          this.stage = isKYCTxPass ? 92 : 90;
          break;
        }
        case KYC_STATUS_ENUM.STANDARD: {
          this.status = isKYCTxPass ? 'Standard' : 'ProcessingTx';
          this.stage = isKYCTxPass ? 91 : 90;
          break;
        }
        case KYC_STATUS_ENUM.PENDING: {
          this.status = 'InProgress';
          this.stage = 90;
          break;
        }
        default:
          this.status = 'None';
      }
    },
    goToEdit() {
      this.$router.push({
        name: 'edit',
        params: { showEmail: !this.user.isEmailVerified },
        query: { ref: 'tokensale' },
      });
    },
  },
  mounted() {
    this.updateKYC();
  },
  watch: {
    isKYCTxPass() {
      this.updateKYC();
    },
    KYCStatus() {
      this.updateKYC();
    },
  },
};
</script>

<style lang="scss" scoped>

.id-image {
  display: inline;

  width: auto;
  height: 100%;
  margin: 0 auto;
}

.id-container {
  position: relative;

  overflow: hidden;

  width: auto;
  height: 100%;
  min-height: 300px;

  border: 1px solid rgba(0,0,0, 0.2);
}

.id-container .md-button {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  width: 100%;
  height: 100%;
  margin: auto;
}

.id-container .md-button:hover {
  color: white;
}

input[type="file"] {
  position: absolute;

  overflow: hidden;
  clip: rect(0 0 0 0);

  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;

  border: 0;
}

</style>

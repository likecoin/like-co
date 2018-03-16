<template>
  <form id="kycForm" @submit.prevent="onNext">
    <div class="kyc-status">
      <div class="description">
        <div v-if="stage === 92">
          <!-- Finished Advanced KYC -->
          {{  $t('KYC.label.canPurchaseMoreThanAmount', { amount: KYC_USD_LIMIT }) }}
        </div>
        <div v-else-if="stage === 91">
          <!-- Finished Standard KYC -->
          {{ $t('KYC.label.canPurchaseLessThanAmount', { amount: KYC_USD_LIMIT }) }}
          <br>
          <input type="submit" :value="$t('KYC.label.purchaseMore')" />
        </div>
        <div v-else-if="stage === 90">
          <!-- Waiting for confirmation -->
          {{ $t('KYC.label.submittedVerification') }}
        </div>
        <div v-else>
          <!-- other cases -->
          {{ $t('KYC.label.verifyToPurchase') }}
        </div>
      </div>

      <ol class="steps">
        <li
          v-for="step in this.kycSteps"
          :key="step.key">
          <img :src="step.icon" />
          {{ $t(`KYC.label.${step.key}Verification`) }}
        </li>
      </ol>
    </div>

    <section
      v-if="stage === 0"
      class="start-kyc-section">
      <!-- Email verified and KYC not yet started -->
      <div class="verified-wrapper">
        <div class="description">
          <h2>
            {{ $t('KYC.label.emailVerified') }}
            <img :src="TickIcon" />
          </h2>
          <p>{{ $t('KYC.label.proceedToAccountVerification') }}</p>
        </div>
      </div>
      <material-button type="submit" form="kycForm">
        {{ $t('KYC.button.start') }}
      </material-button>
    </section>

    <section
      v-if="stage === 1"
      class="standard-verification-section">
      <!-- Questions for Standard Verification -->
      <div class="standard-verification-wrapper">
        <div class="md-layout lc-verticle-inset-3">
          <label class="md-layout-item md-size-100">
            {{ $t('KYC.label.isPrcCitizen') }}
          </label>
          <div class="md-layout md-layout-item options">
            <md-radio v-model="notPRC" class="md-layout-item" :value="false">
              {{ $t('KYC.button.yes') }}
            </md-radio>
            <md-radio v-model="notPRC" class="md-layout-item" :value="true">
              {{ $t('KYC.button.no') }}
            </md-radio>
          </div>
        </div>
        <div class="md-layout lc-verticle-inset-3">
          <label class="md-layout-item md-size-100">
            {{ $t('KYC.label.isUsaCitizen') }}
          </label>
          <div class="md-layout md-layout-item options">
            <md-radio v-model="notUSA" name="isUSA" class="md-layout-item" :value="false">
              {{ $t('KYC.button.yes') }}
            </md-radio>
            <md-radio v-model="notUSA" name="isUSA" class="md-layout-item" :value="true">
              {{ $t('KYC.button.no') }}
            </md-radio>
          </div>
        </div>
      </div>
      <material-button type="submit" form="kycForm">
        {{ $t('General.button.confirm') }}
      </material-button>
    </section>

    <section
      v-else-if="stage === 2"
      class="advanced-verification-section">
      <!-- Questions for Advanced Verification   -->
      <div class="advanced-verification-wrapper lc-verticle-inset-5">
        <p class="lc-verticle-inset-3">
          {{ $t('KYC.label.verifyToPurchaseOverAmount', {
            amount: KYC_USD_LIMIT,
          }) }}
        </p>

        <md-field>
          <label>{{ $t('KYC.label.passportName') }}</label>
          <md-input v-model="passportName" required />
        </md-field>

        <md-field>
          <md-autocomplete
            v-model="country"
            :md-options="COUNTRY_NAME_LIST"
            md-dense
            required>
            <label>{{ $t('KYC.label.country') }}</label>
          </md-autocomplete>
        </md-field>

        <div class="image-upload-field">
          <label>{{ $t('KYC.label.passportIdPage') }}</label>
          <div class="image-upload-wrapper">
            <div v-if="!!passportIdPageFileName" class="image-name-text">
              {{ passportIdPageFileName }}
            </div>
            <md-button
              @click="openPicker('passportImageInput')">
              {{ !!passportIdPageFileName ? $t('KYC.button.reupload') : $t('KYC.button.upload') }}
            </md-button>
          </div>
          <input
            type="file"
            ref="passportImageInput"
            accept="image/*"
            @change="handlePassportImageChange"
            required />
        </div>

        <div class="image-upload-field">
          <label>{{ $t('KYC.label.addressProof') }}</label>
          <div class="image-upload-wrapper">
            <div v-if="!!addressProofFileName" class="image-name-text">
              {{ addressProofFileName }}
            </div>
            <md-button
              @click="openPicker('addressProofImageInput')">
              {{ !!addressProofFileName ? $t('KYC.button.reupload') : $t('KYC.button.upload') }}
            </md-button>
          </div>
          <input
            type="file"
            ref="addressProofImageInput"
            accept="image/*"
            @change="handleAddressProofImageChange"
            required />
        </div>
      </div>
      <material-button type="submit" form="kycForm">
        {{ $t('KYC.button.next') }}
      </material-button>
    </section>

    <section
      v-else-if="stage === 20 || stage === 21"
      class="verify-email-section">
      <!-- Email verification not yet started / completed -->
      <md-field :class="stage === 21 ? 'disabled' : ''">
        <label>
          {{ $t('KYC.label.verifyEmailPlaceholder') }}
        </label>
        <md-input
          type="email"
          v-model="email"
          ref="inputEmail"
          required />
      </md-field>

      <material-button
        v-if="stage === 20"
        type="submit"
        form="kycForm">
        {{ $t('General.button.confirm') }}
      </material-button>

      <div
        v-if="stage === 21"
        class="email-sent-wrapper">
        <p>{{ $t('KYC.label.checkEmail') }}</p>
        <md-button
          type="submit"
          form="kycForm">
          {{ $t('KYC.button.sendEmailAgain') }}
        </md-button>
      </div>
    </section>

    <section
      v-else-if="stage === 90"
      class="kyc-in-progress-section">
      <!-- Account / Advanced Verification Waiting for Confirmation -->
      <div class="description">
        <h2>
          {{ $t('KYC.label.waitingConfirmation') }}
        </h2>
        <p>
          {{ $t(`KYC.label.timeWaitFor${pendingKYC ? 'Advanced' : 'Account'}Verification`) }}
        </p>
      </div>
    </section>

    <section
      v-else-if="stage === 91 || stage === 92"
      class="account-verified-section">
      <!-- Account / Advanced Verification Passed -->
      <div class="verified-wrapper">
        <div class="description">
          <h2>
            {{ $t('KYC.label.accountVeritifed') }}
            <img :src="TickIcon" />
          </h2>
          <p>{{ $t('KYC.label.canPurchaseWhenPublicSale') }}</p>
        </div>
      </div>
    </section>

    <section
      v-else-if="stage === 99"
      class="contact-intercom-section">
        Please contact us in intercom directly
    </section>
  </form>
</template>

<script>
import CircleIcon from '@/assets/tokensale/circle.svg';
import PendingIcon from '@/assets/tokensale/pending.svg';
import TickIcon from '@/assets/tokensale/tick.svg';

import MaterialButton from '~/components/MaterialButton';

import { KYC_USD_LIMIT, KYC_STATUS_ENUM } from '@/constant';
import COUNTRY_LIST from '@/constant/country-list';
import User from '@/util/User';
import EthHelper from '@/util/EthHelper';
import PopupDialog from '~/components/dialogs/PopupDialog';
import { mapActions } from 'vuex';

export default {
  name: 'KYC',
  props: ['isKYCTxPass', 'user', 'wallet'],
  components: {
    MaterialButton,
    PopupDialog,
  },
  data() {
    return {
      TickIcon,

      KYC_USD_LIMIT,

      email: '',
      stage: 0,
      status: 'None',
      notPRC: true,
      notUSA: true,
      isBelowThersold: true,
      passportName: '',
      country: '',
      // documentData0: null,
      // documentData1: null,
      passportIdPageFileName: null,
      addressProofFileName: null,
      documentFile0: '',
      documentFile1: '',
      txHash: '',

      txConfirmed: false,
      isAdvanced: false,
      isWaitingEmailVerification: false,
    };
  },
  computed: {
    KYCStatus() {
      return this.user.KYC;
    },
    pendingKYC() {
      return this.user.pendingKYC;
    },
    COUNTRY_NAME_LIST() {
      return COUNTRY_LIST.map(country => country.name);
    },
    kycSteps() {
      let emailStatusIcon = TickIcon;
      let accountStatusIcon = CircleIcon;
      let advancedStatusIcon = CircleIcon;

      const {
        stage,
        pendingKYC,
        KYCStatus,
        isKYCTxPass,
      } = this;

      if (!this.user.isEmailVerified) {
        emailStatusIcon = CircleIcon;
      } else if (this.isWaitingEmailVerification) {
        emailStatusIcon = PendingIcon;
      }

      if (stage === 90 && !pendingKYC) {
        // pending state but not about advanced verification
        accountStatusIcon = PendingIcon;
      } else if (KYCStatus === KYC_STATUS_ENUM.STANDARD && isKYCTxPass) {
        accountStatusIcon = TickIcon;
      }

      if (pendingKYC) {
        advancedStatusIcon = PendingIcon;
      } else if (KYCStatus === KYC_STATUS_ENUM.ADVANCED && isKYCTxPass) {
        accountStatusIcon = TickIcon;
      }

      const steps = [
        {
          key: 'email',
          icon: emailStatusIcon,
        },
        {
          key: 'account',
          icon: accountStatusIcon,
        },
      ];

      // show advanced step only when advanced verification is in progress / clicked
      if (stage === 92 || stage === 2 || pendingKYC) {
        steps.push({
          key: 'advanced',
          icon: advancedStatusIcon,
        });
      }

      return steps;
    },
  },
  methods: {
    ...mapActions([
      'newUser',
      'sendVerifyEmail',
      'sendKYC',
      'refreshUserInfo',
    ]),
    openPicker(inputFile) {
      this.$refs[inputFile].click();
    },
    handlePassportImageChange(event) {
      const { files } = event.target;
      if (files && files[0]) {
        this.passportIdPageFileName = files[0].name;

        [this.documentFile0] = Object.values(files);
        const reader = new FileReader();
        reader.onload = (e) => {
          this.documentData0 = e.target.result;
        };
        reader.readAsDataURL(files[0]);
      }
    },
    handleAddressProofImageChange(event) {
      const { files } = event.target;
      if (files && files[0]) {
        this.addressProofFileName = files[0].name;

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
            await this.signKYC();
          }
          break;
        }
        case 2: {
          this.isAdvanced = true;
          await this.signKYC(true);
          break;
        }
        case 20: {
          await this.updateEmail();
          await this.sendVerifyEmail({ id: this.user.user, ref: 'tokensale' });
          this.stage += 1;
          this.isWaitingEmailVerification = true;
          break;
        }
        case 21: {
          // allow user to change the inputted email address
          this.stage -= 1;
          this.isWaitingEmailVerification = false;
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
    async signKYC(isAdv) {
      const {
        notPRC,
        notUSA,
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
      };
      if (isAdv) {
        userInfo.passportName = passportName;
        // retrieve country code from choice
        userInfo.country = COUNTRY_LIST.find(c => c.name === country).code;
        userInfo.documentFile0 = documentFile0;
        userInfo.documentFile1 = documentFile1;
      }
      const payload = await User.formatAndSignKYC(userInfo);
      this.txHash = '';
      this.txConfirmed = false;
      const { txHash } = await this.sendKYC({ payload, isAdv });
      this.txHash = txHash;

      // show waiting for confirmation section
      this.stage = 90;

      await EthHelper.waitForTxToBeMined(txHash);
      this.txConfirmed = true;
      /* refreshing user will cause kyc form to refresh as well */
      setTimeout(() => this.refreshUserInfo(user), 3000);
    },
    async updateEmail() {
      const userInfo = {
        user: this.user.user,
        displayName: this.user.displayName,
        wallet: this.wallet,
        email: this.email,
      };
      const data = await User.formatAndSignUserInfo(userInfo);
      return this.newUser(data);
    },
    async updateKYC() {
      if (this.user.isEmailVerified) {
        this.email = this.user.email;
        this.stage = 20;
        return;
      }
      const { isKYCTxPass, KYCStatus, pendingKYC } = this;
      if (pendingKYC) {
        this.status = 'AdvanedInProgress';
        this.stage = 90;
        return;
      }
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
    user() {
      this.updateKYC();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/index";

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

#kycForm {
  .md-button {
    width: 256px;
    height: 40px;
    margin-bottom: 24px;
  }

  .kyc-status {
    display: flex;
    flex-direction: row;
    margin-top: 12px;
    line-height: 24px;

    .description {
      color: $like-gray-4;
      flex: 1;

      input {
        border: none;
        background-color: transparent;
        color: $like-green;
        cursor: pointer;
        text-decoration: underline;
        font-size: 14px;
        transition: opacity .2s ease-in-out;
        &:hover {
          opacity: .7;
        }
      }
    }

    .steps {
      flex-shrink: 0;
      min-width: 120px;
      > li {
        position: relative;

        img {
          position: absolute;
          left: -36px;
          top: 4px;
        }
      }
    }
  }

  .start-kyc-section,
  .account-verified-section {
    text-align: center;
    .verified-wrapper {
      margin: 80px 0;
      .description {
        p {
          margin-top: 8px;
        }
      }
    }
  }

  h2 {
    display: inline-flex;
    position: relative;
    font-weight: normal;
    color: $like-green-2;

    img {
      position: absolute;
      width: 30px;
      height: 30px;
      top: 2px;
      left: -48px;
    }
  }

  .standard-verification-section {
    text-align: center;

    .standard-verification-wrapper {
      height: 220px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .md-layout {
      text-align: left;
      label {
        color: $like-dark-brown-1;
      }
      .options {
        padding: 12px 0 8px;
        border-bottom: 2px solid #d8d8d8;
        color: $like-gray-5;
      }
    }
    .md-radio {
      justify-content: center;
      :global(.md-radio-container) {
        border-color: $like-gray-4;

        :global(.md-ripple) {
          color: $like-green;
        }
        &:after {
          background-color: $like-green;
        }
      }
    }

  }

  .verify-email-section {
    text-align: center;

    .md-field {
      margin: 62px 0 76px;
    }

    .email-sent-wrapper {
      p {
        font-size: 24px;
      }
      .md-button {
        font-size: 14px;
        width: 124px;
        color: $like-green;

        margin: 8px 0 40px;
        text-decoration: underline;
      }
    }
  }

  .contact-intercom-section {
    color: $like-green-2;
    text-align: center;
    margin: 64px 0;
    font-size: 18px;
  }

  .kyc-in-progress-section {
    text-align: center;

    .description {
      margin: 80px 0 124px;
    }
  }

  .advanced-verification-section {
    text-align: center;
    .advanced-verification-wrapper {
      text-align: left;

      > p {
        color: $like-gray-4;
      }
      .image-upload-field {
        margin-top: 24px;
        > label {
          color: $like-dark-brown-1;
        }

        .image-upload-wrapper {
          position: relative;

          display: flex;
          flex-direction: row;
          align-items: center;

          &::after {
            content: '';
            width: 232px;
            height: 2px;
            background-color: $like-gray-3;
            position: absolute;
            bottom: 0;
          }
          .image-name-text {
            color: $like-gray-5;
            font-size: 20px;
            font-weight: 300;
            width: 232px;
            height: 24px;
            margin-top: 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .md-button {
            width: 88px;
            color: $like-green;
          }
        }
        .md-button {
          margin-bottom: 0;
        }
      }
    }
  }

  // fine-tune input color
  .md-field {
    &::before {
      background-color: $like-gray-3;
    }
    &::after {
      background-color: $like-gray-3;
      height: 2px;
    }
    label {
      color: #9b9b9b;
    }
    :global(.md-input) {
      color: $like-gray-5;
      font-size: 20px;
      font-weight: 300;
    }

    &.md-focused,
    &.md-has-value {
      label {
        color: $like-dark-brown-1;
      }
    }
    &:not(.md-focused):not(.md-has-value) {
      label {
        margin-top: -4px;
      }
    }
  }
}
</style>

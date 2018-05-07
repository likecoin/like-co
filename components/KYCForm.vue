<template>
  <form id="kycForm" @submit.prevent="onNext">
    <div class="kyc-status">
      <div class="description">
        <div v-if="stage === 92">
          <!-- Finished Advanced KYC -->
          {{  $t('KYC.label.canPurchaseMoreThanAmount', { amount: KYC_ETH_LIMIT }) }}
        </div>
        <div v-else-if="isPreSale && KYCStatus >= KYC_STATUS_ENUM.STANDARD">
          {{ $t('KYC.label.preSaleBonusDescription') }}
        </div>
        <div v-else-if="pendingKYC || isSubmittedAdvancedVerification">
          {{ $t('KYC.label.advancedVerificationInProgress', { amount: KYC_ETH_LIMIT }) }}
        </div>
        <div v-else-if="stage === 91">
          <!-- Finished Standard KYC -->
          {{ $t('KYC.label.canPurchaseLessThanAmount', { amount: KYC_ETH_LIMIT }) }}
          <br>
          <input type="submit" :value="$t('KYC.label.purchaseMore')" />
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

    <!-- Email verified and KYC not yet started -->
    <section
      v-if="stage === 0"
      class="start-kyc-section">
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

    <!-- Questions for Standard Verification -->
    <section
      v-if="stage === 1"
      class="standard-verification-section">
      <div class="standard-verification-wrapper">
        <div class="md-layout lc-verticle-inset-3">
          <label class="md-layout-item md-size-100">
            {{ $t('KYC.label.isPrcCitizen') }}
          </label>
          <div class="md-layout md-layout-item options">
            <md-radio v-model="notPRC" class="md-layout-item" :value="false">
              {{ $t('General.button.yes') }}
            </md-radio>
            <md-radio v-model="notPRC" class="md-layout-item" :value="true">
              {{ $t('General.button.no') }}
            </md-radio>
          </div>
        </div>
        <div class="md-layout lc-verticle-inset-3">
          <label class="md-layout-item md-size-100">
            {{ $t('KYC.label.isUsaCitizen') }}
          </label>
          <div class="md-layout md-layout-item options">
            <md-radio v-model="notUSA" name="isUSA" class="md-layout-item" :value="false">
              {{ $t('General.button.yes') }}
            </md-radio>
            <md-radio v-model="notUSA" name="isUSA" class="md-layout-item" :value="true">
              {{ $t('General.button.no') }}
            </md-radio>
          </div>
        </div>
        <div v-if="!notUSA" class="md-layout lc-verticle-inset-3">
          <label class="md-layout-item md-size-100">
            {{ $t('KYC.label.isUsaAccredited') }}
          </label>
          <div class="md-layout md-layout-item options">
            <md-radio v-model="isUSAAccredited" name="isUSAAccredited" class="md-layout-item" :value="true">
              {{ $t('General.button.yes') }}
            </md-radio>
            <md-radio v-model="isUSAAccredited" name="isUSAAccredited" class="md-layout-item" :value="false">
              {{ $t('General.button.no') }}
            </md-radio>
          </div>
        </div>
      </div>
      <material-button :disabled="KYCNotPass" type="submit" form="kycForm">
        {{ $t('General.button.confirm') }}
      </material-button>
      <div v-if="KYCNotPass">{{ $t('KYC.label.contactUs') }}</div>
    </section>

    <!-- Questions for Advanced Verification   -->
    <section
      v-else-if="stage === 2"
      class="advanced-verification-section">
      <div class="advanced-verification-wrapper lc-verticle-inset-5">
        <p class="lc-verticle-inset-3">
          {{ $t('KYC.label.verifyToPurchaseOverAmount', {
            amount: KYC_ETH_LIMIT,
          }) }}
        </p>

        <md-field>
          <label>{{ $t('KYC.label.firstName') }}</label>
          <md-input v-model="firstName" required />
        </md-field>
        <md-field>
          <label>{{ $t('KYC.label.lastName') }}</label>
          <md-input v-model="lastName" required />
        </md-field>
        <md-autocomplete
          v-model="country"
          :md-options="COUNTRY_LIST"
          md-dense
          required>
          <label>{{ $t('KYC.label.country') }}</label>
        </md-autocomplete>
        <span v-if="isCountryInvalid" class="invalid-country-error">
          {{ $t('KYC.label.invalidCountry') }}
        </span>
        <md-autocomplete
          v-model="nationality"
          :md-options="NATIONALITY_LIST"
          md-dense
          required>
          <label>{{ $t('KYC.label.nationality') }}</label>
        </md-autocomplete>
        <span v-if="isNationalityInvalid" class="invalid-country-error">
          {{ $t('KYC.label.invalidNationality') }}
        </span>

        <div class="image-upload-field">
          <label>{{ $t('KYC.label.recentSelfie') }}</label>
          <div class="image-upload-wrapper">
            <div v-if="!!selfieFileName" class="image-name-text">
              {{ selfieFileName }}
            </div>
            <md-button
              @click="openPicker('selfieImageInput')">
              {{ !!selfieFileName ? $t('KYC.button.reupload') : $t('KYC.button.upload') }}
            </md-button>
          </div>
          <input
            type="file"
            ref="selfieImageInput"
            accept="image/png, image/jpeg"
            @change="handleSelfieImageChange"
            required />
        </div>

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
            accept="image/png, image/jpeg"
            @change="handlePassportImageChange"
            required />
        </div>

      </div>
      <material-button type="submit" form="kycForm">
        {{ $t('General.button.confirm') }}
      </material-button>
    </section>

    <!-- Email verification not yet started / completed -->
    <section
      v-else-if="stage === 20 || stage === 21"
      class="verify-email-section">
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

    <!-- Account / Advanced Verification Waiting for Confirmation -->
    <section
      v-else-if="stage === 90"
      class="kyc-in-progress-section">
      <div class="description">
        <h2>
          {{ $t('KYC.label.waitingConfirmation') }}
        </h2>
        <p>
          {{ $t(`KYC.label.timeWaitFor${(pendingKYC || isSubmittedAdvancedVerification) ? 'Advanced' : 'Account'}Verification`) }}
        </p>
      </div>
      <material-button
        type="submit"
        form="kycForm"
        v-if="pendingKYC || isSubmittedAdvancedVerification"
        @click="handleShowPaymentForm(true)">
        {{ $t('General.button.ok') }}
      </material-button>
    </section>

    <!-- Account / Advanced Verification Passed -->
    <section
      v-else-if="!(isPreSale || isICOStarted) && (stage === 91 || stage === 92)"
      class="account-verified-section">
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

import { KYC_ETH_LIMIT, KYC_STATUS_ENUM } from '@/constant';
import { logTrackerEvent } from '@/util/EventLogger';
import COUNTRY_LIST from '@/constant/country-list';
import NATIONALITY_LIST from '@/constant/nationality-list';
import User from '@/util/User';
import EthHelper from '@/util/EthHelper';
import { mapActions } from 'vuex';

export default {
  name: 'KYC',
  props: ['isKYCTxPass', 'isPreSale', 'isICOStarted', 'user', 'wallet'],
  components: {
    MaterialButton,
  },
  data() {
    return {
      TickIcon,
      COUNTRY_LIST,
      NATIONALITY_LIST,

      KYC_ETH_LIMIT,
      KYC_STATUS_ENUM,

      email: '',
      stage: 0,
      notPRC: true,
      notUSA: true,
      isUSAAccredited: false,
      isBelowThersold: true,
      firstName: '',
      lastName: '',
      country: '',
      nationality: '',
      // documentData0: null,
      // documentData1: null,
      passportIdPageFileName: null,
      selfieFileName: null,
      documentFile0: '',
      documentFile1: '',
      txHash: '',

      isAdvanced: false,
      isCountryInvalid: false,
      isNationalityInvalid: false,
      isWaitingEmailVerification: false,
      isSubmittedAdvancedVerification: false,
    };
  },
  computed: {
    KYCStatus() {
      return this.user.KYC;
    },
    pendingKYC() {
      return this.user.pendingKYC;
    },
    KYCNotPass() {
      return (!this.notPRC || (!this.notUSA && !this.isUSAAccredited));
    },
    kycSteps() {
      let emailStatusIcon = TickIcon;
      let accountStatusIcon = CircleIcon;
      let advancedStatusIcon = CircleIcon;


      const {
        stage,
        pendingKYC,
        KYCStatus,
        isSubmittedAdvancedVerification,
      } = this;

      // show advanced step only when advanced verification is in progress / clicked
      const shouldShowAdvancedStep = (
        stage === 92 || stage === 2 || pendingKYC || isSubmittedAdvancedVerification
      );

      if (!this.user.isEmailVerified) {
        emailStatusIcon = CircleIcon;
      } else if (this.isWaitingEmailVerification) {
        emailStatusIcon = PendingIcon;
      }

      if (stage === 90 && (!pendingKYC || !isSubmittedAdvancedVerification)) {
        accountStatusIcon = PendingIcon;
      } else if (KYCStatus === KYC_STATUS_ENUM.STANDARD || shouldShowAdvancedStep) {
        accountStatusIcon = TickIcon;
      }

      if (pendingKYC || isSubmittedAdvancedVerification) {
        advancedStatusIcon = PendingIcon;
      } else if (KYCStatus === KYC_STATUS_ENUM.ADVANCED) {
        advancedStatusIcon = TickIcon;
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

      if (shouldShowAdvancedStep) {
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
    handleSelfieImageChange(event) {
      const { files } = event.target;
      if (files && files[0]) {
        this.selfieFileName = files[0].name;

        [this.documentFile0] = Object.values(files);
        const reader = new FileReader();
        reader.onload = (e) => {
          this.documentData1 = e.target.result;
        };
        reader.readAsDataURL(files[0]);
      }
    },
    handlePassportImageChange(event) {
      const { files } = event.target;
      if (files && files[0]) {
        this.passportIdPageFileName = files[0].name;

        [this.documentFile1] = Object.values(files);
        const reader = new FileReader();
        reader.onload = (e) => {
          this.documentData0 = e.target.result;
        };
        reader.readAsDataURL(files[0]);
      }
    },
    async onNext() {
      switch (this.stage) {
        case 0: {
          this.stage += 1;
          logTrackerEvent(this, 'TokenSale', 'StartKYC', 'press "start" on tokensale page', 1);
          break;
        }
        case 1: {
          if (!this.notPRC || (!this.notUSA && !this.isUSAAccredited)) {
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
          await this.sendVerifyEmail({ id: this.user.user, ref: 'in-tokensale' });
          logTrackerEvent(this, 'RegFlow', 'StartEmailVerify', 'click confirm after enter email and the email is valid', 1);
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
          if (!this.isSubmittedAdvancedVerification) {
            // hide payment form and show advanced kyc questions
            this.handleShowPaymentForm(false);
            this.stage = 2;
          }
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
        isUSAAccredited,
        wallet,
        firstName,
        lastName,
        documentFile0,
        documentFile1,
      } = this;
      let {
        nationality,
        country,
      } = this;
      const { user } = this.user;
      const userInfo = {
        user,
        wallet,
        notPRC,
        notUSA,
        isUSAAccredited,
      };
      nationality = nationality.trim().toUpperCase();
      country = country.trim().toUpperCase();
      if (isAdv) {
        userInfo.firstName = firstName;
        userInfo.lastName = lastName;
        if (!COUNTRY_LIST.includes(country)) {
          this.isCountryInvalid = true;
          return;
        }
        if (!NATIONALITY_LIST.includes(nationality)) {
          this.isNationalityInvalid = true;
          return;
        }
        userInfo.country = country;
        userInfo.nationality = nationality;
        userInfo.documentFile0 = documentFile0;
        userInfo.documentFile1 = documentFile1;
      }
      const payload = await User.formatAndSignKYC(userInfo, this.$t('Sign.Message.signKYC'));
      this.txHash = '';
      const { txHash } = await this.sendKYC({ payload, isAdv });
      logTrackerEvent(
        this,
        'TokenSale',
        isAdv ? 'FinishAdvancedKYC' : 'FinishStandardKYC',
        'press "confirm" on tokensale page',
        1,
      );
      this.txHash = txHash;

      // show waiting for confirmation section
      this.stage = 90;
      if (isAdv) {
        this.isSubmittedAdvancedVerification = true;
      } else {
        // wait for tx confirm only for standard verification
        await EthHelper.waitForTxToBeMined(txHash);
        /* refreshing user will cause kyc form to refresh as well */
        setTimeout(() => this.refreshUserInfo(user), 3000);
      }
    },
    async updateEmail() {
      const userInfo = {
        user: this.user.user,
        displayName: this.user.displayName,
        wallet: this.wallet,
        email: this.email,
      };
      const data = await User.formatAndSignUserInfo(userInfo, this.$t('Sign.Message.signKYC'));
      return this.newUser(data);
    },
    async updateKYC() {
      if (!this.user.isEmailVerified) {
        this.email = this.user.email;
        this.stage = 20;
        return;
      }

      const {
        isKYCTxPass,
        isSubmittedAdvancedVerification,
        KYCStatus,
        pendingKYC,
      } = this;

      if (pendingKYC) {
        // do not change the stage until user's press confirm
        if (!isSubmittedAdvancedVerification) {
          this.stage = 93;
        }
        return;
      }
      switch (KYCStatus) {
        case KYC_STATUS_ENUM.ADVANCED: {
          this.stage = isKYCTxPass ? 92 : 91;
          break;
        }
        case KYC_STATUS_ENUM.STANDARD: {
          this.stage = isKYCTxPass ? 91 : 90;
          break;
        }
        case KYC_STATUS_ENUM.PENDING: {
          this.stage = 90;
          break;
        }
        default:
          break;
      }
    },
    goToEdit() {
      this.$router.push({
        name: 'in',
        query: { ref: 'tokensale' },
      });
    },
    handleShowPaymentForm(show) {
      if (show) {
        // back to stage of finishing standard verification
        this.stage = 91;
      }
      this.$emit('showPaymentForm', show);
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
@import "~assets/variables";

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

    line-height: 24px;

    @media (max-width: 600px) {
      align-items: center;
      flex-direction: column;

      > *:not(:first-child) {
        margin-top: 8px;
      }
    }

    .description {
      flex: 1;

      color: $like-gray-4;

      line-height: 1.5;

      @media (max-width: 600px) {
        text-align: center;
      }

      input {
        cursor: pointer;
        transition: opacity .2s ease-in-out;
        text-decoration: underline;

        color: $like-green;
        border: none;
        background-color: transparent;

        font-size: 14px;

        &:hover {
          opacity: .7;
        }
      }
    }

    .steps {
      flex-shrink: 0;

      min-width: 120px;
      padding-left: 42px;

      > li {
        position: relative;

        img {
          position: absolute;
          top: 4px;
          left: -36px;
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
    position: relative;

    display: inline-flex;

    color: $like-green-2;

    font-weight: normal;

    img {
      position: absolute;
      top: 2px;
      left: -48px;

      width: 30px;
      height: 30px;
    }
  }

  .standard-verification-section {
    text-align: center;

    .standard-verification-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;

      min-height: 220px;
    }

    .md-layout {
      text-align: left;
      label {
        color: $like-dark-brown-1;
      }
      .options {
        padding: 12px 0 8px;

        color: $like-gray-5;
        border-bottom: 2px solid $like-gray-3;
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
    .md-button {
      margin-top: 20px;
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
        width: 124px;
        margin: 8px 0 40px;

        text-decoration: underline;

        color: $like-green;

        font-size: 14px;
      }
    }
  }

  .contact-intercom-section {
    margin: 64px 0;

    text-align: center;

    color: $like-green-2;

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
          align-items: center;
          flex-direction: row;

          &::after {
            position: absolute;
            bottom: 0;

            width: 232px;
            height: 2px;

            content: '';

            background-color: $like-gray-3;
          }
          .image-name-text {
            overflow: hidden;

            width: 232px;
            height: 24px;
            margin-top: 12px;

            white-space: nowrap;
            text-overflow: ellipsis;

            color: $like-gray-5;

            font-size: 20px;
            font-weight: 300;
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
    .invalid-country-error {
      color: $like-green-2;
    }
  }
}
</style>

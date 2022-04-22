<template>
  <div class="register-form v2-form">

    <header class="v2-form__header">
      <div class="v2-form__header-left-slot">
        <img
          src="~assets/v2/icons/star.svg"
          alt=""
        >
        <h2>{{ headerTitle }}</h2>
      </div>
      <div
        v-if="step !== STEP.COMPLETED"
        class="v2-form__header-right-slot"
      >
        <div>
          <Stepper
            :total="3"
            :step="stepNumber"
          />
          <i18n
            class="register-form__step-label"
            path="V2_AuthDialog_Step"
            :places="{
              step: stepNumber,
              total: 3,
            }"
            tag="div"
          />
        </div>
      </div>
    </header>

    <CreateLikerIdForm
      v-if="step === STEP.CREATE_LIKER_ID"
      :liker-id="likerId"
      @confirm="handleCreateLikerId"
    />
    <InputBioForm
      v-else-if="step === STEP.INPUT_BIO"
      :display-name="displayName"
      :description="description"
      @skip="handleInputBio"
      @confirm="handleInputBio"
    />
    <InputEmailForm
      v-else-if="step === STEP.INPUT_EMAIL"
      :email="email"
      @skip="handleSkipEmail"
      @confirm="handleInputEmail"
    />
    <AwaitEmailVerifyForm
      v-else-if="step === STEP.AWAIT_EMAIL_VERIFY"
      @skip="handleSkipEmailVerify"
    />
    <CompletedForm
      v-else-if="step === STEP.COMPLETED"
      :liker-id="likerId"
      :display-name="displayName"
      :avatar="avatar"
      @upload-avatar="handleUploadAvatar"
      @confirm="handleComplete"
    />

    <Modal
      name="skip-verify-email"
      classes="v2-card-view"
      height="auto"
      :adaptive="true"
    >
      <SkipEmailWarningView
        @skip="handleForceSkipEmail"
        @confirm="$modal.hide('skip-verify-email')"
      />
    </Modal>
  </div>
</template>

<script>
import Stepper from '../Stepper';

import AwaitEmailVerifyForm from './AwaitEmailVerifyForm';
import CompletedForm from './CompletedForm';
import CreateLikerIdForm from './CreateLikerIdForm';
import InputBioForm from './InputBioForm';
import InputEmailForm from './InputEmailForm';
import SkipEmailWarningView from './SkipEmailWarningView';

const STEP = {
  CREATE_LIKER_ID: 'create-liker-id',
  INPUT_BIO: 'input-profile',
  INPUT_EMAIL: 'input-email',
  AWAIT_EMAIL_VERIFY: 'await-email-verify',
  COMPLETED: 'completed',
};


export default {
  components: {
    AwaitEmailVerifyForm,
    CompletedForm,
    CreateLikerIdForm,
    InputBioForm,
    InputEmailForm,
    SkipEmailWarningView,
    Stepper,
  },
  props: {
    initialStep: {
      type: String,
      default: STEP.CREATE_LIKER_ID,
    },
    userInfo: {
      type: Object,
      default: () => ({
        avatar: '',
        displayName: '',
        email: '',
        user: '',
      }),
    },
  },
  data() {
    const {
      user: likerId,
      displayName,
      email,
      avatar,
    } = this.userInfo;
    return {
      step: this.initialStep,
      likerId,
      avatar,
      displayName,
      description: '',
      email,
      isSubscribeNewsletter: false,
    };
  },
  computed: {
    STEP() {
      return STEP;
    },
    headerTitle() {
      switch (this.step) {
        case STEP.CREATE_LIKER_ID:
          return this.$t('V2_AuthDialog_Title_CreateLikerId');

        case STEP.INPUT_BIO:
          return this.$t('V2_AuthDialog_Title_InputBio');

        case STEP.INPUT_EMAIL:
          return this.$t('V2_AuthDialog_Title_InputEmail');

        case STEP.AWAIT_EMAIL_VERIFY:
          return this.$t('V2_AuthDialog_Title_AwaitEmailVerify');

        case STEP.COMPLETED:
          return this.$t('V2_AuthDialog_Title_RegisterCompleted');

        default:
          return this.step;
      }
    },
    stepNumber() {
      switch (this.step) {
        case STEP.CREATE_LIKER_ID:
          return 1;

        case STEP.INPUT_BIO:
          return 2;

        default:
          return 3;
      }
    },
  },
  watch: {
    initialStep(step) {
      this.step = step;
    },
  },
  methods: {
    handleCreateLikerId({ likerId } = {}) {
      this.likerId = likerId;
      this.step = STEP.INPUT_BIO;
    },
    handleInputBio({ displayName = '', description = '' } = {}) {
      this.displayName = displayName;
      this.description = description;
      this.step = STEP.INPUT_EMAIL;
    },
    handleInputEmail({ email = '', isSubscribeNewsletter = false } = {}) {
      if (email) {
        this.email = email;
        this.isSubscribeNewsletter = isSubscribeNewsletter;
        this.step = STEP.AWAIT_EMAIL_VERIFY;
      } else {
        this.step = STEP.COMPLETED;
      }
      this.$emit('register', {
        user: this.likerId,
        avatar: this.avatar,
        displayName: this.displayName,
        description: this.description,
        email: this.email,
        isSubscribeNewsletter: false,
      });
    },
    handleSkipEmail() {
      this.$modal.show('skip-verify-email');
    },
    handleForceSkipEmail() {
      this.$modal.hide('skip-verify-email');
      this.handleInputEmail();
    },
    handleSkipEmailVerify() {
      this.step = STEP.COMPLETED;
    },
    handleUploadAvatar(file) {
      this.$emit('upload-avatar', file);
    },
    handleComplete() {
      this.$emit('complete');
    },
  },
};
</script>

<style>
.register-form__step-label {
  display: block;

  margin-top: 4px;

  color: #9b9b9b;
}
</style>

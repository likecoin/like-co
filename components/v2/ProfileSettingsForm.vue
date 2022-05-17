<template>
  <div class="profile-settings-form">
    <div class="v2-form v2-card-view">
      <div class="v2-form__content v2-card-view__content">
        <header class="v2-form__header">
          <div class="v2-form__header-left-slot">
            <img
              src="~assets/v2/icons/star.svg"
              alt=""
            >
            <h2>{{ $t('V2_ProfileSettings_Title') }}</h2>
          </div>
        </header>
        <div class="v2-form__body">
          <ProfileView
            :avatar="avatar"
            :liker-id="likerId"
            :description="description"
            :display-name="displayName"
            @upload-avatar="handleAvatarUpload"
          />
        </div>
      </div>
    </div>

    <div class="v2-form v2-card-view">
      <div class="v2-form__content v2-card-view__content">
        <div class="v2-form__body">
          <InputField
            v-model="internalEmail"
            :is-readonly="!isEditingEmail"
            :label="$t('V2_Form_Email_label')"
            :placeholder="$t('V2_Form_Email_placeholder')"
          >
            <template #append-outer>
              <Button
                v-if="!isEditingEmail"
                preset="outlined"
                @click="toggleEmailEditing"
              >{{ $t('V2_Form_Button_Edit') }}</Button>
              <Button
                v-else
                @click="handleEmailUpdate"
              >{{ $t('V2_Form_Button_Confirm') }}</Button>
            </template>
          </InputField>
        </div>
      </div>
    </div>

    <div class="v2-form v2-card-view">
      <div class="v2-form__content v2-card-view__content">
        <div class="v2-form__body">
          <InputField
            :value="likerId"
            :is-readonly="true"
            :label="$t('V2_Form_LikerId_label')"
          />

          <InputField
            :value="walletAddress"
            :is-readonly="true"
            :label="$t('V2_Form_Wallet_label')"
          />

          <InputField
            v-model="internalDisplayName"
            :label="$t('V2_Form_DisplayName_label')"
            :placeholder="$t('V2_Form_DisplayName_placeholder')"
          />

          <InputField
            v-model="internalDescription"
            :label="$t('V2_Form_Description_label')"
            :placeholder="$t('V2_Form_Description_placeholder')"
          />
        </div>

        <div class="v2-form__footer">
          <div class="v2-form__footer-right-slot">
            <Button
              :is-disabled="!hasBioChanged"
              @click="saveChanges"
            >{{ $t('V2_Form_Button_Save') }}</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from './Button';
import InputField from './InputField';
import ProfileView from './ProfileView';

export default {
  components: {
    Button,
    InputField,
    ProfileView,
  },
  props: {
    likerId: {
      type: String,
      default: '',
    },
    walletAddress: {
      type: String,
      default: '',
    },
    displayName: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      internalEmail: this.email,
      isEditingEmail: false,
      internalDescription: this.description,
      internalDisplayName: this.displayName,
    };
  },
  computed: {
    hasBioChanged() {
      return (
        this.description !== this.internalDescription
        || this.displayName !== this.internalDisplayName
      ) && (!this.description || this.internalDescription)
        && (!this.displayName || this.internalDisplayName);
    },
  },
  watch: {
    email(email) {
      this.internalEmail = email;
    },
    displayName(displayName) {
      this.internalDisplayName = displayName;
    },
    description(description) {
      this.internalDescription = description;
    },
  },
  methods: {
    toggleEmailEditing() {
      this.isEditingEmail = !this.isEditingEmail;
    },
    handleEmailUpdate() {
      this.isEditingEmail = false;
      this.$emit('update-email', this.internalEmail);
    },
    saveChanges() {
      this.$emit('save', {
        displayName: this.internalDisplayName,
        description: this.internalDescription,
      });
    },
    handleAvatarUpload(file) {
      this.$emit('upload-avatar', file);
    },
  },
};
</script>

<style scoped>
.profile-settings-form {
  display: grid;
  grid-auto-flow: row;
  row-gap: 16px;

  padding: 32px;
}

.profile-settings-form .v2-form {
  width: 100%;
  max-width: 616px;
  margin: 0 auto;
}
</style>

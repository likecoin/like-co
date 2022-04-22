<template>
  <div class="v2-completed-form v2-form__content">
    <ProfileView
      :avatar="avatar"
      :liker-id="likerId"
      :description="description"
      :display-name="displayName"
      @upload-avatar="handleAvatarUpload"
    />
    <div class="v2-completed-form__action-items">
      <Button
        @click="handleConfirm"
      >{{ $t('V2_Form_Button_GoBack') }}</Button>
      <NuxtLink
        class="edit-profile"
        :to="{ name: 'in-settings' }"
      >{{ $t('V2_Form_Button_EditProfile') }}</NuxtLink>
    </div>
  </div>
</template>

<script>
import Button from '../Button';
import ProfileView from '../ProfileView';

export default {
  components: {
    Button,
    ProfileView,
  },
  props: {
    avatar: {
      type: String,
      default: '',
    },
    displayName: {
      type: String,
      default: '',
    },
    likerId: {
      type: String,
      default: '',
    },
  },
  methods: {
    handleConfirm() {
      this.$emit('confirm');
    },
    handleAvatarUpload(file) {
      this.$emit('upload-avatar', file);
    },
  },
};
</script>

<style scoped>
.v2-completed-form__action-items {
  display: flex;
  align-items: center;
  flex-direction: column;

  margin-top: 20px;
}
.v2-completed-form__action-items a {
  margin-top: 10px;

  text-decoration: underline;

  color: #9b9b9b;
}
</style>

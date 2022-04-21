<template>
  <div class="v2-completed-form v2-register-form__content">
    <div class="v2-register-form__body">
      <div class="v2-completed-form__profile">
        <img
          class="v2-completed-form__avatar"
          :src="internalAvatar"
          :alt="displayName"
        >
        <div>
          <div class="v2-completed-form__display-name">{{ displayName }}</div>
          <div class="v2-completed-form__liker-id">{{ likerId }}</div>
        </div>
      </div>
      <Button
        preset="outlined"
        @click="handleAvatarUploadButtonClick"
      ><PictureIcon />{{ $t('V2_Form_Button_UploadPicture') }}</Button>
      <input
        ref="fileUploader"
        class="v2-completed-form__file-uploader"
        type="file"
        accept="image/png, image/jpeg"
        @change="handleAvatarUpload"
      >
    </div>
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
import PictureIcon from '../icons/Picture';

export default {
  components: {
    Button,
    PictureIcon,
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
  data() {
    return {
      internalAvatar: this.avatar,
    };
  },
  watch: {
    avatar(avatar) {
      this.internalAvatar = avatar;
    },
  },
  methods: {
    handleConfirm() {
      this.$emit('confirm');
    },
    handleAvatarUploadButtonClick() {
      const { fileUploader } = this.$refs;
      if (!fileUploader) return;
      fileUploader.click();
    },
    handleAvatarUpload(event) {
      const { files } = event.target;
      if (!files || !files[0]) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.internalAvatar = e.target.result;
        this.$emit('upload-avatar', files[0]);
      };
      reader.readAsDataURL(files[0]);
    },
  },
};
</script>

<style scoped>
.v2-completed-form .v2-register-form__body {
  display: flex;
  align-items: center;

  padding: 32px 24px;

  border: 3px solid #ebebeb;
  border-radius: 12px;
  justify-items: center;
}

.v2-completed-form__profile {
  display: flex;
  align-items: center;

  margin-right: 24px;
}
.v2-completed-form__avatar {
  width: 88px;
  height: 88px;
  margin-right: 24px;

  border: 4px solid #ebebeb;
  border-radius: 9999px;

  object-fit: cover;
  object-position: center center;
}
.v2-completed-form__display-name {
  color: #4a4a4a;

  font-size: 16px;
  font-weight: 600;
}
.v2-completed-form__liker-id {
  margin-top: 4px;

  font-size: 12px;
}
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
.v2-completed-form__file-uploader {
  display: none;
}
</style>

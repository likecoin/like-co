<template>
  <div class="profile-view">
    <div class="profile-view__profile">
      <div
        v-if="!internalAvatar"
        class="profile-view__avatar"
      />
      <img
        v-else
        class="profile-view__avatar"
        :src="internalAvatar"
        :alt="displayName"
      >
      <div>
        <div class="profile-view__display-name">{{ displayName }}</div>
        <div class="profile-view__liker-id">{{ likerId }}</div>
      </div>
    </div>
    <Button
      preset="outlined"
      @click="handleAvatarUploadButtonClick"
    ><PictureIcon />{{ $t('V2_Form_Button_UploadPicture') }}</Button>
    <input
      ref="fileUploader"
      class="profile-view__file-uploader"
      type="file"
      accept="image/png, image/jpeg"
      @change="handleAvatarUpload"
    >
  </div>
</template>

<script>
import Button from './Button';
import PictureIcon from './icons/Picture';

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
.profile-view {
  display: flex;
  align-items: center;

  padding: 32px 24px;

  border: 3px solid #ebebeb;
  border-radius: 12px;
  justify-items: center;
}

@media screen and (max-width: 640px) {
  .profile-view {
    flex-direction: column;
    gap: 24px;
  }
}

.profile-view__profile {
  display: flex;
  align-items: center;
  flex-grow: 1;

  margin-right: 24px;
}
.profile-view__avatar {
  width: 88px;
  height: 88px;
  margin-right: 24px;

  border: 4px solid #ebebeb;
  border-radius: 9999px;

  object-fit: cover;
  object-position: center center;
}
.profile-view__display-name {
  color: #4a4a4a;

  font-size: 16px;
  font-weight: 600;
}
.profile-view__liker-id {
  margin-top: 4px;

  font-size: 12px;
}
.profile-view__file-uploader {
  display: none;
}
</style>

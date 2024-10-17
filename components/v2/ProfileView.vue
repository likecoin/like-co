<template>
  <div class="profile-view">
    <div class="profile-view__profile">
      <div
        class="profile-view__avatar profile-view__avatar--editable"
        @click="handleAvatarUploadButtonClick"
      >
        <img
          v-if="internalAvatar"
          class="profile-view__avatar-image"
          :src="internalAvatar"
          :alt="displayName"
        >
        <div
          v-else
          class="profile-view__avatar-placeholder"
        />
        <span class="profile-view__edit-overlay">{{ $t('General.edit') }}</span>
      </div>
      <div>
        <div class="profile-view__display-name">{{ displayName }}</div>
        <div class="profile-view__liker-id">{{ likerId }}</div>
      </div>
    </div>

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
export default {
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
  justify-items: center;

  padding: 32px 24px;

  border: 3px solid #ebebeb;
  border-radius: 12px;
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
  position: relative;

  overflow: hidden;

  width: 88px;
  height: 88px;

  margin-right: 24px;

  cursor: pointer;

  border: 4px solid #ebebeb;
  border-radius: 9999px;

  object-fit: cover;
  object-position: center center;
}

.profile-view__avatar--editable:hover .profile-view__edit-overlay {
  opacity: 1;
}

.profile-view__edit-overlay {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;

  padding: 4px;

  transition: opacity 0.3s ease;

  text-align: center;

  opacity: 0;

  color: #fff;

  border-bottom-right-radius: 9999px;
  border-bottom-left-radius: 9999px;

  background-color: rgba(0, 0, 0, 0.6);

  font-size: 12px;
}

.profile-view__avatar-image {
  width: 100%;
  height: 100%;

  border-radius: 9999px;
}

.profile-view__avatar-placeholder {
  width: 100%;
  height: 100%;

  border-radius: 9999px;
  background-color: #ebebeb;
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

<template>
  <article class="mansory-article-item-placeholder">
    <div class="mansory-article-item-placeholder__wrapper">
      <div class="mansory-article-item-placeholder__header">
        <div class="mansory-article-item-placeholder__author">
          <div class="background-masker mansory-article-item-placeholder__avatar" />
          <div class="background-masker mansory-article-item-placeholder__name" />
        </div>

        <div class="background-masker mansory-article-item-placeholder__like-count" />
      </div>

      <div class="background-masker mansory-article-item-placeholder__og-image" />

      <div class="mansory-article-item-placeholder__content">
        <div class="background-masker mansory-article-item-placeholder__url" />

        <div
          :style="{ width: titleWidth }"
          class="background-masker mansory-article-item-placeholder__title"
        />

        <div
          v-if="isShowDescription"
          class="mansory-article-item-placeholder__description-wrapper"
        >
          <div class="background-masker mansory-article-item-placeholder__description" />
          <div
            :style="{ width: descriptionLastLineWidth }"
            class="background-masker mansory-article-item-placeholder__description"
          />
        </div>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  name: 'mansory-article-item-placeholder-placeholder',
  data() {
    return {
      titleWidth: `${50 + Math.random() * 45}%`,
      isTitleTwoLines: Math.random() > 0.5,

      isShowDescription: Math.random() > 0.5,
      descriptionLastLineWidth: `${20 + Math.random() * 55}%`,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

$author-avatar-size: 36px;

.background-masker {
  background-color: $gray-e6;
}

.mansory-article-item-placeholder {
  break-inside: avoid;

  img {
    border: 1px solid $gray-e6;
  }

  &__wrapper {
    border: 1px solid $gray-e6;
    border-radius: 8px;
    background-color: $like-white;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 16px 24px 12px;

    @media (max-width: 600px) {
      padding-right: 16px;
      padding-left: 16px;
    }
  }

  &__author {
    display: flex;
    align-items: center;
  }

  &__avatar {
    width: $author-avatar-size;
    height: $author-avatar-size;
    margin-right: 8px;

    border-radius: 50%;
  }

  &__name {
    width: 88px;
    height: 24px;
  }

  &__like-count {
    width: 72px;
    height: 20px;
  }

  &__og-image {
    height: 250px;

    border: 1px solid $gray-e6;

    @media (min-width: 600px + 1px) {
      width: calc(100% + 16px);
      max-width: unset;
      margin-left: -8px;
    }

    @media (max-width: 600px) {
      border-right: none;
      border-left: none;
    }
  }

  &__content {
    padding: 8px 24px 16px;
  }

  &__url {
    width: 60%;
    height: 20px;
    margin-bottom: 4px;
  }

  &__title {
    width: 100%;
    height: 26px;
    margin-bottom: 2px;
  }

  &__description-wrapper {
    margin-top: 8px;
  }
  &__description {
    width: 100%;
    height: 18px;
    margin-top: 4px;
  }
}
</style>

<template>
  <article class="mansory-article-item">
    <div class="mansory-article-item__wrapper">
      <div class="mansory-article-item__header">
        <div class="mansory-article-item__author">
          <img
            v-if="author"
            :src="author.avatar"
          >
          <nuxt-link
            v-if="author"
            :to="{ name: 'id', params: { id: article.user } }"
          >{{ author.displayName }}</nuxt-link>
        </div>

        <div
          class="mansory-article-item__like-count"
          @click="onClickLikeCount"
        >
          {{ article.like }}
          <simple-svg
            :filepath="LikeTextIcon"
            width="34px"
            height="14px"
            fill="currentColor"
          />
        </div>
      </div>

      <div
        v-if="article.image"
        class="mansory-article-item__og-image"
      >
        <img :src="article.image">
      </div>

      <div class="mansory-article-item__content">
        <a
          :href="article.url"
          rel="noopener noreferrer"
          target="_blank"
        >{{ decodeURIComponent(article.url) }}</a>

        <h1>{{ article.title }}</h1>

        <p v-if="description">
          {{ description }}
        </p>
      </div>
    </div>
  </article>
</template>

<script>
import { mapGetters } from 'vuex';

import LikeTextIcon from '@/assets/like-button/like-text.svg';

const MAX_DESCRIPTION_LENGTH = 120;

export default {
  name: 'mansory-article-item',
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      LikeTextIcon,
    };
  },
  computed: {
    ...mapGetters(['getUserMinInfoById']),
    description() {
      if (this.article.description && this.article.description.length > MAX_DESCRIPTION_LENGTH) {
        return `${this.article.description.slice(0, MAX_DESCRIPTION_LENGTH)}...`;
      }
      return this.article.description;
    },
    author() {
      return this.getUserMinInfoById(this.article.user);
    },
  },
  methods: {
    onClickLikeCount() {
      this.$emit('click-like-stat', {
        id: this.article.user,
        referrer: this.article.referrer,
        title: this.article.title,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

$author-avatar-size: 36px;

.mansory-article-item {
  break-inside: avoid;

  img {
    border: 1px solid $gray-e6;
  }

  &__wrapper {
    color: $like-gray-5;
    border: 1px solid $gray-e6;
    border-radius: 8px;
    background-color: $like-white;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 16px 24px 12px;

    font-weight: 600;

    @media (max-width: 600px) {
      padding-right: 16px;
      padding-left: 16px;
    }
  }

  &__author {
    display: flex;
    align-items: center;

    font-size: 18px;

    img {
      width: $author-avatar-size;
      height: $author-avatar-size;
      margin-right: 8px;

      border: $border-style-2;
      border-radius: 50%;
      background-color: $like-white;
    }
  }

  &__like-count {
    display: flex;

    .simple-svg-wrapper {
      margin-top: -4px;
      margin-left: 8px;
    }
  }

  &__og-image {
    img {
      background-color: $like-white;

      object-fit: cover;

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
  }

  &__content {
    padding: 8px 24px 16px;

    a {
      display: block;
      overflow: hidden;

      width: 80%;

      white-space: nowrap;
      text-overflow: ellipsis;

      color: $like-gray-5;
    }

    h1 {
      padding: 4px 0 8px;

      color: $like-black;

      font-size: 20px;
      font-weight: 600;
      line-height: normal;
    }
  }
}
</style>

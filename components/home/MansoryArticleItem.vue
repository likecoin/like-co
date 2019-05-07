<template>
  <article class="mansory-article-item">
    <div class="mansory-article-item__wrapper">
      <div class="mansory-article-item__header">
        <div class="mansory-article-item__author">
          <nuxt-link
            v-if="author"
            :to="{ name: 'id', params: { id: article.user } }"
          >
            <img v-lazy="resizedAuthorAvatarSrc">
            {{ author.displayName }}
          </nuxt-link>
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

      <a
        :href="article.url"
        rel="noopener noreferrer"
        target="_blank"
        class="mansory-article-item__og-wrapper"
      >
        <div
          v-if="hasImg && resizedImage"
          class="mansory-article-item__og-image"
        >
          <img
            v-lazy="resizedImage"
            @error="hasImg = false;"
          >
        </div>

        <div class="mansory-article-item__content">
          <span>{{ articleUrlHost }}</span>

          <h2>{{ article.title }}</h2>

          <p v-if="description">
            {{ description }}
          </p>
        </div>
      </a>
    </div>
  </article>
</template>

<script>
import { mapGetters } from 'vuex';

import { getImageResizeAPI } from '@/util/api/api';
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
      hasImg: true,
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
    resizedImage() {
      if (!(this.article && this.article.image)) return undefined;
      return getImageResizeAPI(this.article.image, { width: 600 });
    },
    resizedAuthorAvatarSrc() {
      if (!(this.author && this.author.avatar)) return undefined;
      return getImageResizeAPI(this.author.avatar, { width: 36 });
    },
    author() {
      return this.getUserMinInfoById(this.article.user);
    },
    articleUrlHost() {
      try {
        const url = new URL(this.article.url);
        return url.hostname.replace(/^www./, '');
      } catch (err) {
        return '';
      }
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

    a {
      display: flex;
      align-items: center;
    }

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

    cursor: pointer;

    .simple-svg-wrapper {
      margin-top: -4px;
      margin-left: 8px;
    }
  }

  &__og-wrapper {
    text-decoration: none !important;

    &:hover {
      .mansory-article-item__og-image {
        &:after {
          opacity: 1;
        }
      }

      .mansory-article-item__content {
        background-color: $gray-e6;
      }
    }
  }

  &__og-image {
    position: relative;

    @media (min-width: 600px + 1px) {
      width: calc(100% + 16px);
      margin-left: -8px;
    }

    &:after {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;

      content: ' ';
      transition: opacity .2s ease-in;

      opacity: 0;
      background-color: rgba(28, 28, 28, 0.08);
    }

    img {
      width: 100%;

      background-color: $like-white;

      object-fit: cover;

      @media (max-width: 600px) {
        border-right: none;
        border-left: none;
      }
    }
  }

  &__content {
    padding: 8px 24px 16px;

    transition: background-color .2s ease-in;

    color: $like-gray-5;

    span {
      display: block;
      overflow: hidden;

      width: 80%;

      white-space: nowrap;
      text-transform: lowercase;
      text-overflow: ellipsis;

      color: $like-gray-5;
    }

    h2 {
      padding: 4px 0 8px;

      color: $like-black;

      font-size: 20px;
      font-weight: 600;
      line-height: normal;
    }
  }
}
</style>

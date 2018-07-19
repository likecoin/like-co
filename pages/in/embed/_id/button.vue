<template>
  <div
    :class="[
      'likecoin-embed',
      'likecoin-embed--button',
      {
        'likecoin-embed--flipped': isShowBackside,
      },
    ]"
  >

    <transition
      name="likecoin-embed__badge-flip-"
      mode="out-in"
    >
      <div
        v-if="isShowBackside"
        key="back"
        class="likecoin-embed__badge likecoin-embed__badge--back"
      >
        <div class="likecoin-embed__badge__content">

          <div
            class="likecoin-embed__badge__close-btn"
            @click="onClickCloseButton"
          >
            <md-icon>close</md-icon>
          </div>

          <div class="text-content">
            <div class="text-content__subtitle">
              {{ $t('Embed.label.subtitle') }}
            </div>
            <div class="text-content__title">
              <span class="title-message">
                {{ $t('Embed.label.title') }}
              </span>
            </div>
          </div>

          <div class="embed-superlike-button-wrapper">
            <md-button
              id="embed-superlike-button"
              :href="getUserPath"
              class="md-likecoin"
              target="_blank"
            >
              {{ $t('Embed.button.sendLike') }}
            </md-button>
          </div>
        </div>
      </div>
      <div
        v-else
        key="front"
        class="likecoin-embed__badge likecoin-embed__badge--front"
      >
        <div class="likecoin-embed__badge__content">

          <embed-user-info
            :avatar="avatar"
            :display-name="displayName"
            :link="getUserPath"
          />

          <div class="text-content">
            <div class="text-content__subtitle">
              {{ $t('Embed.label.subtitle') }}
            </div>
            <div class="text-content__title">
              <span class="title-message">
                {{ $t('Embed.label.title') }}
              </span>
            </div>
          </div>

        </div>
      </div>
    </transition>

    <footer>
      <social-media-connect
        :username="id"
        :platforms="platforms"
        :limit="5"
      />

      <embed-create-widget-button :link="getReferralLink" />
    </footer>

    <md-button
      class="md-likecoin"
      @click="onClickLike"
    >
      LIKE <span v-if="likeCount">{{ likeCount }}</span>
    </md-button>

  </div>
</template>

<script>
import { apiPostLikeButton } from '@/util/api/api';

import mixin from '~/components/embed/mixin';

const debounce = require('lodash.debounce');

const debouncedOnClick = debounce((that) => {
  /* eslint-disable no-param-reassign */
  const count = that.likeCount - that.likeSent;
  apiPostLikeButton(that.id, count);
  that.likeSent += that.likeCount;
  /* eslint-enable no-param-reassign */
}, 500);

export default {
  name: 'embed-id-button',
  layout: 'embed',
  mixins: [mixin],
  data() {
    return {
      likeCount: 0,
      likeSent: 0,
      shouldShowBackside: true,
    };
  },
  computed: {
    isSuperLike() {
      return (this.likeCount >= 5);
    },
    isShowBackside() {
      return this.isSuperLike && this.shouldShowBackside;
    },
  },
  methods: {
    onClickLike() {
      if (this.isSuperLike) {
        this.shouldShowBackside = true;
      } else {
        this.likeCount += 1;
      }
      debouncedOnClick(this);
    },
    onClickCloseButton() {
      this.shouldShowBackside = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/embed";

$close-btn-width: 56;

.likecoin-embed {
  perspective: 800px;

  &__badge {
    backface-visibility: hidden;
    transform-style: preserve-3d;

    &--back {
      margin-right: normalized($button-width / 2 + $button-shadow-width);

      .likecoin-embed__badge__content {
        padding-right: normalized($button-width / 2 + $button-shadow-width);
        padding-left: normalized($close-btn-width + 24);
      }
    }

    &-flip-- {
      &enter-active,
      &leave-active {
        transition-property: opacity, transform;
      }
      &enter-active {
        transition-timing-function: ease-out;
        transition-duration: 0.3s;
      }
      &leave-active {
        transition-timing-function: ease-in;
        transition-duration: 0.2s;
      }
      &enter {
        transform: translateZ(normalized(-100)) rotateX(-90deg);
      }
      &leave-to {
        transform: translateZ(normalized(-100)) rotateX(90deg);
      }
    }

    &__close-btn {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;

      display: flex;
      align-items: center;
      justify-content: center;

      width: normalized($close-btn-width);

      cursor: pointer;

      transition: background-color 0.2s ease;

      border-top-left-radius: $badge-border-radius;
      border-bottom-left-radius: $badge-border-radius;

      background-color: rgba(white, 0.5);

      &:hover:not(:active) {
        background-color: rgba(white, 0.7);
      }

      :global(.md-icon) {
        color: $like-green;

        font-size: normalized(20) !important;
      }
    }
  }

  &__badge--front,
  footer {
    margin-right: normalized($button-border-width + $button-shadow-width);
  }
}

.text-content {
  position: relative;

  letter-spacing: 0;

  &__subtitle {
    color: $like-gray-5;

    font-size: normalized(16);
    font-weight: 500;
    line-height: normalized(16.5);
  }

  &__title {
    margin-top: normalized(2);

    color: black;

    font-size: normalized(18);
    font-weight: 600;
    line-height: normalized(18.5);
  }
}

.social-media-connect {
  transition: opacity 0.3s ease;

  .likecoin-embed--flipped & {
    pointer-events: none;

    opacity: 0;
  }
}
</style>

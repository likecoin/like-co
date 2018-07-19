<template>
  <div class="likecoin-embed likecoin-embed--button">

    <div class="likecoin-embed__badge likecoin-embed__badge">
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

    <footer>
      <social-media-connect
        :username="id"
        :platforms="platforms"
        :limit="5"
      />

      <embed-create-widget-button :link="getReferralLink" />
    </footer>

    <md-button
      v-if="isSuperLike"
      :href="getUserPath"
      class="md-likecoin"
      target="_blank"
    >
      SuperLike
    </md-button>
    <md-button
      v-else
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
    };
  },
  computed: {
    isSuperLike() {
      return (this.likeCount >= 5);
    },
  },
  methods: {
    onClickLike() {
      if (!this.isSuperLike) this.likeCount += 1;
      debouncedOnClick(this);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/embed";

.likecoin-embed {
  &__badge,
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
</style>

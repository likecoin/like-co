<template>
  <div
    :class="[
      'likecoin-embed',
      'likecoin-embed--button',
      'likecoin-embed--logged-in',
      {
        'likecoin-embed--flipped': shouldShowBackside,
      },
    ]"
  >

    <transition
      name="likecoin-embed__badge-flip-"
      mode="out-in"
    >
      <div
        v-if="shouldShowBackside"
        key="back"
        class="likecoin-embed__badge likecoin-embed__badge--back"
      >
        <div class="likecoin-embed__badge__content">

          <div
            class="likecoin-embed__badge__close-btn"
            @click="onClickCloseButton"
          >
            <simple-svg
              :filepath="CloseButtonIcon"
              fill="currentColor"
              stroke="transparent"
            />
          </div>

          <div class="text-content">
            <i18n
              tag="div"
              class="text-content__subtitle"
              path="Embed.label.rewardUserWithLikeToken"
            >
              <a
                :href="getUserPath"
                place="user"
                rel="noopener noreferrer"
                target="_blank"
              >{{ displayName }}</a>
            </i18n>
            <div class="text-content__title text-content__title--amount">
              {{ amount }} LIKE
              <span class="amount-in-usd">= USD {{ amountInUSD }}</span>
            </div>
          </div>

          <div class="embed-superlike-button-wrapper">
            <a
              id="embed-superlike-button"
              ref="superLikeButton"
              :href="getUserPath"
              target="_blank"
            >
              <div class="button-content-wrapper">
                <div class="button-content">
                  {{ $t('Embed.button.sendLike') }}
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div
        v-else
        key="front"
        class="likecoin-embed__badge likecoin-embed__badge--front"
      >
        <div class="likecoin-embed__badge__content">

          <embed-user-info :avatar="avatar" />

          <div class="text-content">
            <div class="text-content__subtitle">
              {{ $t('Embed.label.clickLikeButton') }}
            </div>
            <i18n
              tag="div"
              class="text-content__title"
              path="Embed.label.supportUser"
            >
              <a
                :href="getUserPath"
                place="user"
                rel="noopener noreferrer"
                target="_blank"
              >{{ displayName }}</a>
            </i18n>
          </div>

          <div
            v-if="!isLoggedIn"
            class="login-tooltip"
          >
            <div>
              <div class="login-tooltip__trigger-wrapper">
                <transition
                  name="login-tooltip__trigger--flip"
                  mode="out-in"
                >
                  <button
                    v-if="isLoginTooltipOpen"
                    key="close"
                    class="login-tooltip__trigger login-tooltip__trigger--close"
                    @click="isLoginTooltipOpen = false"
                  >
                    <simple-svg
                      :filepath="CloseButtonIcon"
                      fill="currentColor"
                      stroke="transparent"
                    />
                  </button>
                  <button
                    v-else
                    key="open"
                    class="login-tooltip__trigger login-tooltip__trigger--open"
                    @click="isLoginTooltipOpen = true"
                  >
                    <simple-svg
                      :filepath="QuestionButtonIcon"
                      fill="currentColor"
                      stroke="transparent"
                    />
                  </button>
                </transition>
              </div>
              <div class="login-tooltip__bubble-wrapper">
                <transition name="login-tooltip__bubble--pop-up">
                  <i18n
                    v-if="isLoginTooltipOpen"
                    tag="div"
                    path="Embed.label.loginAdvice"
                    class="login-tooltip__bubble"
                  >
                    <a
                      href="/in"
                      target="_blank"
                      rel="noopener"
                      place="login"
                      @click="isLoginTooltipOpen = false"
                    >{{ $t('Embed.button.login') }}</a>
                  </i18n>
                </transition>
              </div>
            </div>
          </div>

        </div>
      </div>
    </transition>

    <like-button
      :like-count="likeCount"
      :total-like="totalLike"
      :is-toggled="shouldShowBackside"
      :is-super-like="isSuperLike"
      @toggle="onToggleLikeButton"
      @like="onClickLike"
      @super-like="onClickSuperLike"
      @click-stats="onClickLikeStats"
    />

    <footer>
      <social-media-connect
        v-if="id"
        :username="id"
        :platforms="platforms"
        :limit="5"
      />

      <embed-create-widget-button
        :link="getReferralLink"
        is-button
      />
    </footer>

  </div>
</template>

<script>
import EmbedCreateWidgetButton from '~/components/embed/EmbedCreateWidgetButton';
import EmbedUserInfo from '~/components/embed/EmbedUserInfo';
import SocialMediaConnect from '~/components/SocialMediaConnect';

import { apiQueryLikeCoinFiatPrice } from '@/util/api/api';

import CloseButtonIcon from '~/assets/like-button/close-btn.svg';
import QuestionButtonIcon from '~/assets/like-button/question-btn.svg';

import LikeButton from '~/components/LikeButton';

const debounce = require('lodash.debounce');

const debouncedOnClick = debounce((that) => {
  /* eslint-disable no-param-reassign */
  const count = that.likeCount - that.likeSent;
  that.likeSent += count;
  that.totalLike += count;
  /* eslint-enable no-param-reassign */
}, 500);

export default {
  name: 'in-preview',
  layout: 'embed',
  components: {
    EmbedCreateWidgetButton,
    EmbedUserInfo,
    SocialMediaConnect,
    LikeButton,
  },
  async asyncData({ params }) {
    const amountInUSD = 0.25;
    let USD_TO_LIKE = 0.0082625;
    try {
      const res = await apiQueryLikeCoinFiatPrice();
      USD_TO_LIKE = res.data.market_data.current_price.usd;
    } catch (err) {
      console.error(err);
    }
    const amount = (amountInUSD / USD_TO_LIKE).toFixed(2);

    return {
      id: params.id,
      amount,
      amountInUSD,
    };
  },
  data() {
    return {
      CloseButtonIcon,
      QuestionButtonIcon,

      isLoggedIn: false,
      isLoginTooltipOpen: false,
      likeCount: 0,
      likeSent: 0,
      totalLike: 883,
      shouldShowBackside: false,

      /* through parent post message */
      id: '',
      displayName: '',
      avatar: '',
      platforms: {},
      /* through parent post message */
    };
  },
  computed: {
    referrer() {
      return this.$route.query.referrer || document.referrer || '';
    },
    isSuperLike() {
      return (this.likeCount >= 5);
    },
    getUserPath() {
      const amount = this.amount ? `/${this.amount}` : '';
      const referrer = this.urlReferrer ? `/?referrer=${this.urlReferrer}` : '';
      return `/${this.id}${amount}${referrer}`;
    },
    urlReferrer() {
      const { query } = this.$route;
      return query.referrer || '';
    },
    getReferralLink() {
      const referrer = this.urlReferrer ? `/?referrer=${this.urlReferrer}` : '';
      return `https://like.co/ref/${this.id}${referrer}`;
    },
  },
  mounted() {
    window.addEventListener('message', this.onMessage);
  },
  methods: {
    onMessage({ data }) {
      if (typeof data === 'object' && data.type === 'updatePreviewInfo') {
        const { user, platforms } = data.message;
        if (user) {
          this.id = user.user;
          this.displayName = user.displayName;
          this.avatar = user.avatar;
        }
        if (platforms) {
          this.platforms = platforms;
        }
      }
    },
    onClickLike() {
      if (this.isSuperLike) {
        this.shouldShowBackside = true;
      } else {
        this.likeCount += 1;
      }
      debouncedOnClick(this);
    },
    onToggleLikeButton(isSuperLike) {
      this.shouldShowBackside = isSuperLike;
    },
    onClickSuperLike(e) {
      if (
        this.shouldShowBackside
        && this.$refs.superLikeButton
      ) {
        this.$refs.superLikeButton.click(e);
      }
    },
    onClickLikeStats() {
      const { id } = this.$route.params;
      const { referrer } = this.$route.query;
      window.open(
        `/in/embed/${id}/list${referrer ? `?referrer=${referrer}` : ''}`,
        '_blank',
        'menubar=no,location=no,width=576,height=768',
      );
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

    .likecoin-embed--logged-out & {
      background: #e6e6e6;
    }

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

      > div {
        width: normalized(28);
        height: normalized(28);

        color: $like-green;
      }
    }
  }

  &__badge--front,
  footer {
    margin-right: normalized($button-border-width + $button-shadow-width);
  }
}

#embed-superlike-button {
  @keyframes super-like-button-shake {
    0%, 86% { transform: rotateZ(0deg); }
    88% { transform: rotateZ(2deg); }
    90% { transform: rotateZ(-2deg); }
    92% { transform: rotateZ(3deg); }
    94% { transform: rotateZ(-3deg); }
    98% { transform: rotateZ(1deg); }
    100% { transform: rotateZ(0deg); }
  }
  animation-name: super-like-button-shake;
  animation-duration: 3s;
  animation-timing-function: ease-out;
  animation-delay: -2s;
  animation-iteration-count: infinite;
  animation-fill-mode: forwards;
}

.text-content {
  &__title {
    font-size: normalized(24);
    line-height: normalized(24.5);

    &--amount {
        color: $like-green;

        .amount-in-usd {
          margin-left: normalized(6);

          color: $like-gray-5;

          font-size: normalized(10);
          line-height: normalized(10.5);
        }
      }
  }
}

.login-tooltip {
  position: absolute;
  right: 0;

  margin-right: normalized(12);

  > div {
    position: relative;
  }

  &__trigger {
    display: block;

    width: normalized(16);
    height: normalized(16);

    transition-timing-function: ease;
    transition-duration: 0.25s;
    transition-property: transform, background, color;

    border: none;
    border-radius: 50%;

    @media screen and (max-width: 414px) {
      width: normalized(18);
      height: normalized(18);
    }

    &--flip- {
      &enter-active {
        transition-timing-function: ease-out;
        transition-duration: 0.15s;
      }
      &leave-active {
        transition-timing-function: ease-in;
        transition-duration: 0.05s;
      }
      &enter,
      &leave-to {
        transform: scale(0);
      }
    }

    &--open {
      color: #9b9b9b;
      background: none;

      &:hover {
        color: darken(#9b9b9b, 10);
      }
      &:active {
        color: darken(#9b9b9b, 20);
      }
    }

    &--close {
      color: white;
      background: $like-green;

      &:hover {
        color: darken(white, 20);
        background: darken($like-green, 5);
      }
      &:active {
        color: darken(white, 50);
        background: darken($like-green, 15);
      }
    }

    > div {
      width: inherit;
      height: inherit;
    }
  }

  &__bubble {
    &-wrapper {
      position: absolute;
      top: 50%;
      right: calc(100% + #{normalized(4.5)});

      transform: translateY(-50%);
    }

    position: relative;

    width: normalized(208);

    margin-right: normalized(8);
    padding: normalized(8) normalized(12);

    transform-origin: center right;

    color: #9b9b9b;

    border-radius: normalized(6);
    background-color: white;

    font-size: normalized(10);
    line-height: normalized(14);

    @media screen and (max-width: 414px) {
      width: normalized(260);

      font-size: normalized(12);
      line-height: normalized(16);
    }

    &--pop-up- {
      &enter-active {
        transition-timing-function: ease-out;
        transition-duration: 0.2s;
      }
      &leave-active {
        transition-timing-function: ease-in;
        transition-duration: 0.1s;
      }
      &enter,
      &leave-to {
        transform: scale(0);
      }
    }

    // Triangle
    &::before {
      position: absolute;
      top: 50%;
      left: 100%;

      width: 0;
      height: 0;

      content: '';

      transform: translateY(-50%);

      border-top: normalized(8) solid transparent;
      border-bottom: normalized(8) solid transparent;
      border-left: normalized(8) solid white;
    }

    a {
      text-decoration: underline;

      font-weight: 600;
    }
  }
}

.like-button {
  position: absolute;

  margin-top: normalized(-18);
  margin-left: normalized(44);
}

.social-media-connect {
  transition: opacity 0.3s ease;

  .likecoin-embed--flipped & {
    pointer-events: none;

    opacity: 0;
  }
}
</style>

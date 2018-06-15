<template>
  <div class="user-info-div">
    <div class="user-avatar-border">
      <div class="user-avatar-wrapper">
        <img class="avatar" :src="avatar" />
      </div>
    </div>
    <div class="user-identity">
      <div class="support-div">
        <span class="support-message">Support </span>
        <nuxt-link :to="getUserPath"
          target="_blank"
          class="display-name">{{ displayName }}</nuxt-link>
      </div>
      <div class="provided-by-div">by LikeCoin reinvented LikeButton</div>
    </div>
    <nuxt-link :to="getUserPath"
      target="_blank">
      <img :src="getLikeButtonSrc"
           alt="like-button"
           class="like-button"
           @mouseover="setLikeButtonState('hover')"
           @mousedown="setLikeButtonState('click')"
           @mouseup="setLikeButtonState('normal')"
           @mouseout="setLikeButtonState('normal')"
           >
    </nuxt-link>
  </div>
</template>

<script>
import { LIKE_BTN_IMG_URL } from '~/constant/';
import { apiGetUserMinById } from '@/util/api/api';

export default {
  name: 'embed',
  layout: 'embed',
  data() {
    return {
      LIKE_BTN_IMG_URL,
      id: '',
      displayName: '',
      avatar: '',
      likeButtonState: 'normal',
    };
  },
  asyncData({ params }) {
    return apiGetUserMinById(params.id)
      .then((res) => {
        const {
          displayName,
          avatar,
        } = res.data;
        return {
          id: params.id,
          displayName,
          avatar,
        };
      })
      .catch(() => {});
  },
  head() {
    return {
      link: [
        {
          rel: 'prefetch',
          href: LIKE_BTN_IMG_URL.normal,
        },
        {
          rel: 'prefetch',
          href: LIKE_BTN_IMG_URL.hover,
        },
        {
          rel: 'prefetch',
          href: LIKE_BTN_IMG_URL.click,
        },
      ],
    };
  },
  computed: {
    getUserPath() {
      return `/${this.id}`;
    },
    getLikeButtonSrc() {
      return this.LIKE_BTN_IMG_URL[this.likeButtonState];
    },
  },
  methods: {
    setLikeButtonState(state) {
      this.likeButtonState = state;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

$profile-icon-size: 128px;
$like-button-pos: 80px;

.user-info-div {
  align-items: center;

  .user-avatar-border {
    background: linear-gradient(242deg, #d2f0f0, #f0e6b4);
    padding: 5px;
    border-radius: 50%;
    width: $profile-icon-size;
    height: $profile-icon-size;
    float: left;

    .user-avatar-wrapper {
      overflow: hidden;
      border: 1px solid rgba(0,0,0, 0.2);
      border-radius: 50%;
      @media (min-width: #{768px + 1px}) {
        width: $profile-icon-size;
        height: $profile-icon-size;
      }

      .avatar {
        width: auto;
        height: auto;
      }
    }
  }

  .user-identity {
    width: 100%;
    height: $profile-icon-size;
    vertical-align: middle;
    display: table-cell;
    padding: 8px;

    .support-div {
      font-size: 24px;

      .support-message {
        color: $like-dark-brown-1;
        -webkit-text-fill-color: $like-dark-brown-1;
      }

      .display-name {
        color: $like-green;
        font-weight: 600;
        -webkit-text-fill-color: $like-green;
      }
    }

    .provided-by-div {
      color: $like-gray-4;
      padding-top: 4px;
    }
  }

  .like-button {
    position: fixed;
    top: $like-button-pos;
    left: $like-button-pos;
  }
}

</style>

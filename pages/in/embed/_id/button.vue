<template>
  <div v-if='id' class="user-info-div">
    <div class="user-avatar-border">
      <div class="user-avatar-wrapper">
        <img class="avatar" :src="avatar" />
      </div>
    </div>
    <div class="user-identity">
      <div class="support-div">
        <span class="support-message">{{ $t('Embed.label.support') }} </span>
        <nuxt-link :to="getUserPath"
          target="_blank"
          class="display-name">{{ displayName }}</nuxt-link>
      </div>
      <div class="provided-by-div">{{ $t('Embed.label.providedBy') }}</div>
    </div>
    <nuxt-link :to="getUserPath"
      target="_blank">
      <img :src="likeButtonSrc"
           alt="like-button"
           class="like-button"
           @mouseover="setLikeButtonState('hover')"
           @mousedown="setLikeButtonState('click')"
           @mouseup="setLikeButtonState('normal')"
           @mouseout="setLikeButtonState('normal')"
           >
    </nuxt-link>
  </div>
  <div v-else> Not found. </div>
</template>

<script>
import { apiGetUserMinById } from '@/util/api/api';
import likeButtonNormal from '@/assets/like-button/likebtn-normal.png';
import likeButtonHover from '@/assets/like-button/likebtn-hover.png';
import likeButtonClick from '@/assets/like-button/likebtn-click.png';

const LIKE_BUTTON_STATE = {
  normal: likeButtonNormal,
  hover: likeButtonHover,
  click: likeButtonClick,
};

export default {
  name: 'embed-button',
  layout: 'embed',
  data() {
    return {
      id: '',
      displayName: '',
      avatar: '',
      likeButtonNormal,
      likeButtonHover,
      likeButtonClick,
      likeButtonSrc: likeButtonNormal,
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
  computed: {
    getUserPath() {
      const referrer = this.urlReferrer ? `/?referrer=${this.urlReferrer}` : '';
      return `https://button.like.co/${this.id}${referrer}`;
    },
    urlReferrer() {
      const { query } = this.$route;
      return query.referrer || '';
    },
  },
  methods: {
    setLikeButtonState(state) {
      this.likeButtonSrc = LIKE_BUTTON_STATE[state];
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

    float: left;

    width: $profile-icon-size;
    height: $profile-icon-size;

    padding: 5px;

    border-radius: 50%;
    background: linear-gradient(242deg, #d2f0f0, #f0e6b4);

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

    display: table-cell;
    width: 100%;
    height: $profile-icon-size;

    padding: 8px;

    vertical-align: middle;

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
      padding-top: 4px;

      color: $like-gray-4;
    }
  }

  .like-button {
    position: fixed;
    top: $like-button-pos;
    left: $like-button-pos;
  }
}

</style>

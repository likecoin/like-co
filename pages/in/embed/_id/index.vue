<template>
  <div v-if='id'
    class="user-info-div lc-flex"
    @mouseenter="onHover(true)"
    @mouseleave="onHover(false)"
    >
    <div class="user-avatar-border">
      <div class="user-avatar-wrapper">
        <img class="avatar" :src="avatar" />
      </div>
      <div class="display-name lc-text-align-center lc-padding-vertical-8">
        <nuxt-link :to="getUserPath"
          target="_blank"
          >
          {{ displayName }}
        </nuxt-link>
      </div>
    </div>
    <div class="user-identity">
      <div class="subtitle-div">{{ $t('Embed.label.subtitle') }}</div>
      <div class="title-div">
        <span class="title-message">{{ $t('Embed.label.title') }} </span>
      </div>
    </div>
    <div class="embed-superlike-div" :class="{ hover: hovering }">
      <md-button
        id="embed-superlike-button"
        class="md-likecoin"
        @click="toUserPath"
      >
        {{ $t('Embed.button.sendLike') }}
      </md-button>
    </div>
    <div class="poweredby-message lc-text-align-right">
      powered by
      <a
        href="https://like.co"
        target="_blank"
        rel="noopener"
        >
        LikeCoin
      </a>
    </div>
  </div>
  <div v-else> Not found. </div>
</template>

<script>
import { apiGetUserMinById } from '@/util/api/api';

export default {
  name: 'embed-id',
  layout: 'embed',
  data() {
    return {
      id: '',
      displayName: '',
      avatar: '',
      hovering: false,
    };
  },
  asyncData({ params }) {
    let amount = 8;
    try {
      const parse = parseInt(params.amount, 10);
      if (parse && !Number.isNaN(parse)) amount = parse;
    } catch (e) {
      // no op;
    }
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
          amount,
        };
      })
      .catch(() => {});
  },
  computed: {
    getUserPath() {
      const amount = this.amount ? `/${this.amount}` : '';
      const referrer = this.urlReferrer ? `/?referrer=${this.urlReferrer}` : '';
      return `/${this.id}${amount}${referrer}`;
    },
    urlReferrer() {
      const { query } = this.$route;
      return query.referrer || '';
    },
  },
  methods: {
    toUserPath() {
      window.open(this.getUserPath, 'noopener');
    },
    onHover(hovering) {
      this.hovering = hovering;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

$profile-icon-size: 110px;
$icon-border-size: 5px;
$like-button-width: 90px;
$margin-top-offset: 20px;
$margin-right-offset: 45px;

.user-info-div {
  position:relative;
  align-items: center;
  margin: $margin-top-offset $margin-right-offset $margin-top-offset 5px;
  max-width: 425px;
  max-height: 83px;
  border-radius: 8px;
  background-image: linear-gradient(238deg, $like-light-blue, $like-gradient-1);

  .user-avatar-border {
    left: $icon-border-size;
    margin: $margin-top-offset 8px;
    background: linear-gradient(242deg, $like-light-blue, $like-gradient-1);
    padding: $icon-border-size;
    border-radius: 50%;
    width: $profile-icon-size + $icon-border-size * 2;
    height: $profile-icon-size + $icon-border-size * 2;

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

    .display-name {
      color: $like-green;
      font-size: 18px;
      font-weight: 600;
    }
  }

  .user-identity {
    padding: 8px;
    .title-div {
      .title-message {
        font-size: 24px;
        font-weight: 600;
      }
    }

    .subtitle-div {
      font-size: 16px;
      font-weight: 500;
      line-height: 1.31;
      color: $like-gray-5;
    }
  }

  .embed-superlike-div {
    position: relative;
    margin-left: auto;
    margin-right: -$margin-right-offset - 8px;
    border-radius: 20px;
    width: $like-button-width + $icon-border-size * 2;
    &:before {
      content: "";
      border-radius: 20px;
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      opacity: 0;
      transition: .4s cubic-bezier(.4,0,.2,1);
      background: linear-gradient(67deg, $like-light-blue, $like-gradient-1);
    }

    &.hover:before {
      opacity: 1;
    }
    .md-likecoin#embed-superlike-button {
      font-size: 20px;
      min-width: $like-button-width;
      max-width: $like-button-width;
      border-radius: 20px;
      &:active {
        color: $like-green;
        border-radius: 21px;
        box-sizing: border-box;
        background-color: $like-white;
        border: solid 4px $like-green;
      }
    }
  }
  .poweredby-message {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 12px;
    font-size: 10px;
    font-weight: 600;
    color: $gray-9b;
    a {
      color: $gray-9b;
      text-decoration: underline;
    }
  }
}

</style>

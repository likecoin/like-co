<template>
  <div
    v-if="id"
    class="user-info-div lc-container-0 lc-flex"
    @mouseenter="onHover(true)"
    @mouseleave="onHover(false)"
  >
    <div class="user-avatar lc-container-1">
      <div class="user-avatar-border">
        <div class="user-avatar-wrapper">
          <img
            :src="avatar"
            class="avatar"
          >
        </div>
      </div>
      <div
        :class="[
          'display-name',
          'lc-text-align-center',
          'lc-padding-vertical-8',
          'lc-font-size-18',
          'lc-font-weight-600',
          'lc-mobile',
        ]"
      >
        <nuxt-link
          :to="getUserPath"
          target="_blank"
        >
          {{ displayName }}
        </nuxt-link>
      </div>
    </div>
    <div class="user-identity lc-container-1">
      <div
        :class="[
          'subtitle-div',
          'lc-font-size-16',
          'lc-line-height-1_6',
          'lc-mobile',
        ]"
      >
        {{ $t('Embed.label.subtitle') }}
      </div>
      <div class="title-div">
        <span
          :class="['title-message', 'lc-font-size-20', 'lc-font-weight-600',
                   'lc-line-height-1_2', 'lc-mobile']"
        >
          {{ $t('Embed.label.title') }}
        </span>
      </div>
    </div>
    <div
      :class="{ hover: hovering }"
      class="embed-superlike-div lc-container-1 lc-text-align-center"
    >
      <md-button
        id="embed-superlike-button"
        :href="getUserPath"
        class="md-likecoin"
        target="_blank"
      >
        {{ $t('Embed.button.sendLike') }}
      </md-button>
    </div>
    <div
      :class="['poweredby-message',
               'lc-margin-top-12',
               'lc-text-align-right',
               'lc-font-size-10',
               'lc-font-weight-600',
      ]"
    >
      <a
        :href="getReferralLink"
        target="_blank"
        rel="noopener"
      >
        {{ $t('Embed.label.createMyWidget') }}
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
    getReferralLink() {
      const referrer = this.urlReferrer ? `/?referrer=${this.urlReferrer}` : '';
      return `https://like.co/ref/${this.id}${referrer}`;
    },
  },
  methods: {
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
$responsive-offset: 15px;

.user-info-div {
  position:relative;

  align-items: center;

  max-width: 425px;
  max-height: 83px;

  margin: $margin-top-offset $margin-right-offset $margin-top-offset 5px;

  border-radius: 8px;
  background-image: linear-gradient(238deg, $like-light-blue, $like-gradient-1);
  @media (max-width: 480px) {
    margin-top: 5px;
  }
  .user-avatar {
    position:relative;

    margin: $margin-top-offset 8px;
    .user-avatar-border {
      left: $icon-border-size;

      min-width: $profile-icon-size - $responsive-offset;
      max-width: $profile-icon-size + $icon-border-size * 2;

      padding: $icon-border-size;

      border-radius: 50%;

      background: linear-gradient(242deg, $like-light-blue, $like-gradient-1);

      @media (max-width: 480px) {
        min-width: auto;
      }

      .user-avatar-wrapper {
        overflow: hidden;

        border-radius: 50%;
        @media (min-width: #{768px + 1px}) {
          width: $profile-icon-size;
          height: $profile-icon-size;
        }

        .avatar {
          display: block;

          width: 100%;
          height: 100%;
        }
      }
    }
    .display-name {
      position: absolute;
      top: 100%;

      width: 100%;

      color: $like-green;

      @media (max-width: 480px) {
        display: none;
      }
    }
  }
  .user-identity {
    .subtitle-div {
      color: $like-gray-5;
    }
  }

  .embed-superlike-div {
    position: relative;

    width: $like-button-width + $icon-border-size * 2;
    margin-right: -$margin-right-offset;
    margin-left: auto;

    border-radius: 20px;
    &:before {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;

      content: "";
      transition: .4s cubic-bezier(.4,0,.2,1);

      opacity: 0;
      border-radius: 20px;
      background: linear-gradient(67deg, $like-light-blue, $like-gradient-1);
      @media (max-width: 480px) {
        background: none;
      }
    }

    &.hover:before {
      opacity: 1;
    }
    .md-likecoin#embed-superlike-button {
      border-radius: 20px;
      box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.25);
      @media (min-width: 600px + 1px) {
        min-width: $like-button-width;

        font-size: 20px;
      }

      @media (max-width: 600px) {
        min-width: $like-button-width - $responsive-offset;

        font-size: 15px;
      }
      &:active {
        box-sizing: border-box;

        color: $like-green;
        border: solid 4px $like-green;
        border-radius: 21px;
        background-color: $like-white;
      }
    }
  }
  .poweredby-message {
    position: absolute;
    top: 100%;
    right: 0;

    color: $gray-9b;
    @media (max-width: 480px) {
      margin-top: 0px;
    }
    a {
      text-decoration: underline;

      color: $gray-9b;
    }
  }
}

</style>

<template>
  <div
    v-if='id'
    class="likecoin-embed"
  >

    <div class="likecoin-embed__badge">
      <div class="likecoin-embed__badge__content">

        <div class="user-info">
          <div class="user-info__avatar">
            <img :src="avatar" />
          </div>

          <div class="user-info__display-name">
            <div>
              <nuxt-link
                :to="getUserPath"
                target="_blank"
              >
                {{ displayName }}
              </nuxt-link>
            </div>
          </div>
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

        <div class="embed-superlike">
          <md-button
            id="embed-superlike__button"
            class="md-likecoin"
            :href="getUserPath"
            target="_blank"
          >
            {{ $t('Embed.button.sendLike') }}
          </md-button>
        </div>
      </div>
    </div>

    <social-media-connect
      class="social-media-connect"
      :username="id"
      :platforms="platforms"
      :limit="6"
    />

    <div class="powered-by-message">
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
import {
  apiGetUserMinById,
  apiGetSocialListById,
} from '@/util/api/api';

import SocialMediaConnect from '~/components/SocialMediaConnect';

export default {
  name: 'embed-id',
  layout: 'embed',
  components: {
    SocialMediaConnect,
  },
  asyncData({ params }) {
    let amount = 8;
    try {
      const parse = parseInt(params.amount, 10);
      if (parse && !Number.isNaN(parse)) amount = parse;
    } catch (e) {
      // no op;
    }
    const { id } = params;
    return Promise.all([
      apiGetUserMinById(id).catch(() => {}),
      apiGetSocialListById(id).catch(() => {}),
    ]).then((res) => {
      const {
        displayName,
        avatar,
      } = res[0].data;
      return {
        id,
        displayName,
        avatar,
        amount,
        platforms: res[1].data,
      };
    });
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
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

// badge size + offset superlike button width / 2
// 425 + 120 / 2
$full-width: 485;

$avatar-size: 110;
$avatar-border-width: 5;
$avatar-vertical-offset: 12;

$button-border-width: 4;
$button-shadow-width: 6;
$button-width: 108 + $button-border-width * 2;
$button-height: 42 + $button-border-width * 2;

@function normalized($value: $full-width) {
  @return $value / $full-width * 100vw;
}

.likecoin-embed {
  position: relative;

  width: normalized();
  margin-top: normalized($avatar-vertical-offset);
  padding-right: normalized($button-width / 2 + $button-shadow-width);

  user-select: none;

  &__badge {
    border-radius: normalized(8);
    background-image: linear-gradient(77deg, $like-light-blue, $like-gradient-1);

    &__content {
      position: relative;

      display: flex;
      align-items: center;

      min-height: normalized(82);
      padding-right: normalized($button-width / 2 + $button-shadow-width);
    }
  }
}

.user-info {
  position: relative;

  flex-shrink: 0;

  width: normalized($avatar-size);
  height: normalized($avatar-size);
  margin: normalized(-$avatar-vertical-offset) normalized(8);

  &__avatar {
    padding: normalized($avatar-border-width);

    border-radius: 50%;
    background: linear-gradient(70deg, $like-light-blue, $like-gradient-1);

    img {
      display: block;
      overflow: hidden;

      width: 100%;
      height: 100%;

      border-radius: inherit;
    }
  }

  &__display-name {
    position: absolute;
    top: 100%;

    display: flex;
    justify-content: center;

    min-width: 100%;
    margin-top: normalized(4);

    letter-spacing: 0;

    font-size: normalized(18);
    font-weight: 600;
    line-height: normalized(18.5);

    a {
      display: inline-block;

      white-space: nowrap;

      color: $like-green;

      font-size: inherit;
      font-weight: inherit;
      line-height: inherit;
    }
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

.embed-superlike {
  position: absolute;
  right: 0;

  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  width: auto;
  min-width: normalized($button-width);
  height: auto;
  min-height: normalized($button-height);
  margin-right: normalized(-$button-width / 2);
  padding: normalized($button-border-width);

  &:before {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    content: "";
    transition: 0.4s cubic-bezier(.4, 0, .2, 1);
    transition-property: background, opacity;

    opacity: 0;
    border-radius: normalized(25);
    background: linear-gradient(67deg, $like-light-blue, $like-gradient-1);
    box-shadow: 0 normalized(2) normalized($button-shadow-width) 0 rgba(0, 0, 0, 0.25);

    // Show button border when cursor fall into root element
    body:hover & {
      opacity: 1;
    }
  }

  #embed-superlike__button {
    position: relative;

    display: flex;
    align-items: center;
    flex-direction: column;
    flex-grow: 1;

    width: 100%;
    min-width: unset;
    margin: 0;

    transition-property: background;
    text-align: center;
    letter-spacing: 0;

    border-radius: normalized(20);
    box-shadow: 0 normalized(2) normalized(6) 0 rgba(0, 0, 0, 0.25);

    font-size: normalized(20);
    line-height: normalized(20);

    &:active {
      box-sizing: border-box;

      color: $like-green;
      border: solid normalized(4) $like-green;
      background-color: $like-white;
    }

    &::before {
      border-radius: inherit;
    }

    :global(.md-ripple) {
      flex-grow: 1;

      min-height: 0;
      padding: 0;

      border-radius: inherit;
    }
  }
}

.social-media-connect {
  margin-top: normalized(8);

  > :global(div) {
    justify-content: flex-end;

    margin-left: 38vw;

    :global(ul) {
      justify-content: flex-end;

      margin: normalized(-2);

      :global(li) {
        padding: normalized(2);
      }
    }
  }

  :global(.social-media-connect__button) {
    margin: normalized(2);

    :global(svg),
    :global(.simple-svg-wrapper) {
      width: normalized(32) !important;
      height: normalized(32) !important;
    }
  }
}

.powered-by-message {
  margin-top: normalized(8);

  text-align: right;

  color: $gray-9b;

  font-size: normalized(10);
  line-height: normalized(10.5);

  @media screen and (max-width: 414px) {
    margin-top: 0;

    font-size: normalized(12);
    line-height: normalized(13);
  }

  a {
    display: inline-block;

    text-decoration: underline;

    color: inherit;

    font-size: inherit;
    line-height: inherit;
  }
}
</style>

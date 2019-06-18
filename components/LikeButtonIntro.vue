<template>
  <div class="like-button-intro">
    <div class="lc-dialog-container-1">
      <div class="lc-dialog-container-2">
        <h1 class="lc-font-size-32 lc-margin-bottom-8">
          {{ $t('LikeButtonIntro.title.earn') }}
        </h1>
        <div class="like-button-intro__content-wrapper lc-margin-top-32 lc-text-align-center">
          <img :src="ContentIllustration">
        </div>
      </div>
    </div>

    <section class="like-button-intro__get-start-wrapper lc-margin-bottom-32">
      <div class="lc-dialog-container-1">
        <div class="lc-dialog-container-2 lc-padding-top-32 lc-padding-bottom-16">
          <div class="like-button-intro__content-wrapper">
            <div class="lc-flex lc-justify-content-center lc-margin-top-20">
              <div class="lc-text-align-center">
                <md-button
                  class="md-likecoin outline"
                  @click="onClickStart"
                >{{ actionButtonTitle }}</md-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="lc-margin-bottom-32">
      <div class="lc-dialog-container-1">
        <div class="lc-dialog-container-2 lc-padding-top-8 lc-padding-bottom-16">
          <div class="like-button-intro__content-wrapper">
            <div>
              <section>
                <div
                  v-for="item in exampleItems"
                  :ref="item.id"
                  :key="item.id"
                  class="like-button-intro__example-detail-wrapper"
                >
                  <div
                    v-if="item.logos && item.logos.length"
                    class="like-button-intro__example-logo-list"
                  >
                    <ul>
                      <li
                        v-for="logoPath in item.logos"
                        :key="logoPath"
                      >
                        <img :src="logoPath">
                      </li>
                    </ul>
                  </div>
                  <i18n
                    :path="`LikeButtonIntro.${item.id}.title`"
                    class="lc-margin-top-24 lc-margin-bottom-32"
                    tag="h2"
                  >
                    <span
                      class="lc-font-weight-600"
                      place="name"
                    >
                      {{ $t(`LikeButtonIntro.${item.id}.name`) }}
                    </span>
                  </i18n>
                  <i18n
                    :path="`LikeButtonIntro.${item.id}.content`"
                    class="like-button-intro__example-content"
                    tag="div"
                  >
                    <!-- WordPress -->
                    <a
                      :href="WORDPRESS_PLUGIN_URL"
                      place="installWp"
                      rel="noopener noreferrer"
                      target="_blank"
                    >{{ $t('LikeButtonIntro.wordpress.label.installWp') }}</a>
                    <a
                      :href="$t('LikeButtonIntro.wordpress.url.instruction')"
                      place="wpInstruction"
                      rel="noopener noreferrer"
                      target="_blank"
                    >{{ $t('LikeButtonIntro.wordpress.label.instruction') }}</a>
                    <!-- WordPress -->
                    <a
                      href="https://www.inmediahk.net/"
                      place="inmedia"
                      rel="noopener noreferrer"
                      target="_blank"
                    >{{ $t('LikeButtonIntro.inmedia') }}</a>
                    <a
                      href="https://thestandnews.com/"
                      place="standnews"
                      rel="noopener noreferrer"
                      target="_blank"
                    >{{ $t('LikeButtonIntro.standnews') }}</a>
                    <a
                      href="https://www.hkcnews.com/"
                      place="citizenNews"
                      rel="noopener noreferrer"
                      target="_blank"
                    >{{ $t('LikeButtonIntro.citizenNews') }}</a>
                    <span
                      class="lc-font-weight-600"
                      place="likeButtonUrl"
                    >{{ likeButtonUrl }}</span>
                    <span
                      v-if="getUserInfo.wallet"
                      place="setupWallet"
                    >{{ $t('LikeButtonIntro.setupWallet') }}</span>
                    <a
                      v-else
                      place="setupWallet"
                      @click="onClickStart"
                    >{{ $t('LikeButtonIntro.setupWallet') }}</a>
                  </i18n>

                  <!-- Medium -->
                  <template v-if="item.id === 'embedly' && getUserInfo.user">
                    <CopyTextField
                      class="lc-margin-top-24"
                      :text="likeButtonUrl"
                    />
                  </template>
                  <!-- Medium -->

                  <figure v-if="item.image">
                    <img v-lazy="item.image">
                    <i18n
                      :path="`LikeButtonIntro.${item.id}.caption`"
                      class="lc-text-align-center lc-margin-top-16"
                      tag="figcaption"
                    >
                      <!-- WordPress -->
                      <a
                        :href="WORDPRESS_PLUGIN_URL"
                        place="plugin"
                        rel="noopener noreferrer"
                        target="_blank"
                      >{{ $t('LikeButtonIntro.wordpress.label.plugin') }}</a>
                      <!-- WordPress -->
                    </i18n>
                  </figure>
                </div>
              </section>
            </div>

            <div class="lc-margin-top-64">
              <div class="lc-flex lc-justify-content-center lc-margin-top-20">
                <div class="lc-text-align-center">
                  <md-button
                    class="md-likecoin outline"
                    @click="onClickStart"
                  >{{ actionButtonTitle }}</md-button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

import CopyTextField from '@/components/CopyTextField';
import ContentIllustration from '@/assets/home/wordpress-poc.gif';

import {
  OICE_URL,
  WORDPRESS_PLUGIN_URL,
} from '@/constant';

const getAssetPath = require.context('~/assets/like-button-intro');
const exampleItems = [
  {
    id: 'integratedPlatform',
    logos: ['inmedia', 'standnews', 'hkcnews'].map(name => getAssetPath(`./${name}.svg`)),
  },
  {
    id: 'embedly',
    logos: ['matters', 'medium', 'vocus'].map(name => getAssetPath(`./${name}.svg`)),
    image: getAssetPath('./embedly_preview.gif'),
  },
  {
    id: 'wordpress',
    logos: [getAssetPath('./wordpress.svg')],
    image: getAssetPath('./wordpress_preview.png'),
  },
];

export default {
  name: 'like-button-intro',
  components: {
    CopyTextField,
  },
  data() {
    return {
      ContentIllustration,
      exampleItems,
      OICE_URL,
      WORDPRESS_PLUGIN_URL,
    };
  },
  computed: {
    ...mapGetters(['getUserInfo']),
    likeButtonUrl() {
      const id = this.getUserInfo.user;
      return id ? `https://button.like.co/${id}` : 'https://button.like.co/[Liker ID]';
    },
    actionButtonTitle() {
      if (this.getUserInfo.wallet) {
        return this.$t('LikeButtonIntro.setupLikeButton');
      }
      return this.$t('LikeButtonIntro.setupWallet');
    },
  },
  methods: {
    ...mapActions(['updateUserReadContentStatus']),
    onClickExample(id) {
      const ele = this.$refs[id];
      if (ele && ele[0]) {
        ele[0].scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    },
    onClickStart() {
      this.$emit('start');
      if (this.getUserInfo.user) {
        this.updateUserReadContentStatus({
          id: this.getUserInfo.user,
          payload: { likebuttonIntro: true },
        });
      }
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";
@import "~assets/mixin";

.lc-dialog-container-2 {
  @media (max-width: 600px) {
    padding: 0 !important;
  }
}

.like-button-intro {
  &__get-start-wrapper {
    margin-top: -40px;

    background-image: $like-linear-gradient;

    @media (max-width: 600px) {
      padding: 24px 0;
    }
  }

  h2 {
    color: $like-dark-brown-2;

    font-size: 28px;
    font-weight: 300;
  }

  &__content-wrapper {
    margin-top: 8px;
    padding: 0 60px;

    line-height: normal;

    p {
      margin-top: 32px !important;

      color: $like-gray-5;

      font-size: 16px;
    }

    @media (max-width: 600px) {
      padding: 0;
    }
  }

  &__examples {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 0 24px;
  }

  &__example {
    list-style: none;

    > div {
      cursor: pointer;
    }

    /deep/ svg {
      @media (max-width: 600px) {
        width: 48px !important;
        height: 48px !important;
      }
    }

    &:nth-child(2) {
      position: relative;

      padding: 0 20%;

      @media (max-width: 600px) {
        padding: 0 10%;
      }

      &:before,
      &:after {
        position: absolute;
        top: 50%;

        width: 1px;
        height: 40px;

        content: ' ';
        transform: translateY(-50%);

        background-color: #e6e6e6;
      }

      &:before {
        left: 0;
      }

      &:after {
        right: 0;
      }
    }
  }

  &__example-detail-wrapper {
    margin-top: 140px;

    @media (max-width: 600px) {
      margin-top: 100px;
    }

    a {
      text-decoration: underline;
    }

    figure {
      margin-top: 16px;

      img {
        width: 100%;
      }
    }

    figcaption {
      color: $like-gray-4;
    }
  }

  &__example-logo-list {
    ul {
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      margin: -28px;
      padding: 0;

      list-style: none;

      @media (max-width: 600px) {
        justify-content: center;

        margin: -14px;
      }
    }

    li {
      padding: 28px;

      @media (max-width: 600px) {
        padding: 14px;
      }
    }

    img {
      display: block;
    }
  }

  &__example-content {
    margin-bottom: 8px;

    a {
      font-weight: 600;
    }
  }

  .copy-text-field {
    position: relative;

    display: flex;
    align-items: center;

    min-height: 44px;
    padding: 12px 80px;

    user-select: all;
    word-break: break-all;

    border: none;
    background-color: $gray-e6;

    font-size: 16px;

    &::after {
      content: none;
    }

    /deep/ .md-input {
      text-align: center;

      color: $like-dark-brown-2;
      -webkit-text-fill-color: currentColor;

      font-family: menlo, 'Courier New', Courier, monospace;
    }

    /deep/ .md-button {
      position: absolute;
      right: 12px;

      font-size: 16px;
    }
  }
}
</style>

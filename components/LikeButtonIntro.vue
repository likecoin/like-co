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
            <p class="lc-font-size-20 lc-font-weight-600">
              {{ $t('LikeButtonIntro.label.earn') }}
            </p>

            <div class="lc-flex lc-justify-content-center lc-margin-top-20">
              <div
                class="lc-text-align-center"
                @click="onClickStart"
              >
                <md-button
                  :to="startBtnToObject"
                  class="md-likecoin outline"
                >{{ $t('LikeButtonIntro.button.startUsing') }}</md-button>
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
              <h2>{{ $t('LikeButtonIntro.title.poc') }}</h2>
              <p>{{ $t('LikeButtonIntro.label.poc') }}</p>
            </div>

            <div>
              <h2 class="lc-font-weight-600 lc-text-align-center lc-margin-vertical-64">
                {{ $t('LikeButtonIntro.title.slogan') }}
              </h2>

              <ul class="like-button-intro__examples">
                <li
                  v-for="item in exampleItems"
                  :key="item.id"
                  class="like-button-intro__example"
                >
                  <div @click="onClickExample(item.id)">
                    <simple-svg
                      :filepath="getIconPath(item.icon)"
                      :width="item.size"
                      :height="item.size"
                      fill="#28646e"
                    />
                  </div>
                </li>
              </ul>

              <div class="lc-margin-top-48">
                <h2>{{ $t('LikeButtonIntro.title.campaign') }}</h2>
                <p>{{ $t('LikeButtonIntro.label.campaign') }}</p>
              </div>

              <section>
                <div
                  v-for="item in exampleItems"
                  :ref="item.id"
                  :key="item.id"
                  class="like-button-intro__example-detail-wrapper"
                >
                  <div class="lc-flex">
                    <simple-svg
                      :filepath="getIconPath(item.icon)"
                      :width="item.size"
                      :height="item.size"
                      fill="#4a4a4a"
                    />
                  </div>
                  <h2 class="lc-margin-top-24 lc-margin-bottom-32">
                    <span class="lc-font-weight-600">
                      {{ $t(`Settings.label.${item.id}.title`) }}
                    </span>
                    – {{ $t(`LikeButtonIntro.${item.id}.title`) }}
                  </h2>
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

                    <!-- oice -->
                    <a
                      :href="OICE_URL"
                      place="oiceWebsite"
                      rel="noopener noreferrer"
                      target="_blank"
                    >oice.com</a>
                    <a
                      :href="$t('LikeButtonIntro.oice.url.instruction')"
                      place="oiceInstruction"
                      rel="noopener noreferrer"
                      target="_blank"
                    >{{ $t('LikeButtonIntro.oice.label.instruction') }}</a>
                    <!-- oice -->
                  </i18n>

                  <!-- Medium -->
                  <template v-if="item.id === 'medium' && likeButtonUrl">
                    <selectable-field class="lc-margin-top-24">
                      {{ likeButtonUrl }}
                    </selectable-field>
                  </template>
                  <!-- Medium -->

                  <figure>
                    <img v-lazy="getFigureImageSrc(item.image)">
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
              <h2>{{ $t('LikeButtonIntro.title.enroll') }}</h2>
              <p>{{ $t('LikeButtonIntro.label.enroll') }}</p>

              <div class="lc-flex lc-justify-content-center lc-margin-top-20">
                <div
                  class="lc-text-align-center"
                  @click="onClickStart"
                >
                  <md-button
                    :to="startBtnToObject"
                    class="md-likecoin outline"
                  >{{ $t('LikeButtonIntro.button.startUsing') }}</md-button>
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
import { mapGetters } from 'vuex';

import SelectableField from '@/components/SelectableField';
import ContentIllustration from '@/assets/home/wordpress-poc.gif';

import {
  OICE_URL,
  WORDPRESS_PLUGIN_URL,
} from '@/constant';

const assetFolder = require.context('@/assets/');
const exampleItems = [
  {
    id: 'wordpress',
    icon: 'wordpress-with-bg',
    size: '80px',
    image: 'wp_preview.png',
  },
  {
    id: 'medium',
    icon: 'medium-with-bg',
    size: '66px',
    image: 'medium_preview.gif',
  },
  {
    id: 'oice',
    icon: 'oice',
    size: '66px',
    image: 'oice_preview.gif',
  },
];

export default {
  name: 'like-button-intro',
  components: {
    SelectableField,
  },
  data() {
    return {
      ContentIllustration,
      exampleItems,
      OICE_URL,
      WORDPRESS_PLUGIN_URL,
      startBtnToObject: {
        name: 'in-settings-button',
        params: { isShowIntro: true },
      },
    };
  },
  computed: {
    ...mapGetters(['getUserInfo']),
    likeButtonUrl() {
      const id = this.getUserInfo.user;
      return id ? `https://button.like.co/${id}` : null;
    },
  },
  methods: {
    getIconPath(name) {
      return assetFolder(`./icons/social-media/${name}.svg`);
    },
    getFigureImageSrc(name) {
      return assetFolder(`./img/${name}`);
    },
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

    :global(svg) {
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
    padding-top: 72px;

    @media (max-width: 600px) {
      padding-top: 48px;
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

  &__example-content {
    margin-bottom: 8px;

    a {
      font-weight: 600;
    }
  }
}
</style>

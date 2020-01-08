<template>
  <section class="official-network-list lc-container-0">
    <div class="lc-container-1">

      <div class="lc-container-header">
        <div class="lc-container-2 lc-container-header-overlay">
          <div class="lc-container-3 lc-bg-gray-1 lc-mobile-hide" />
        </div>
        <div class="lc-container-2">
          <div class="lc-container-3">
            <div class="lc-container-4">
              <div class="lc-container-header-title">
                <h1 class="lc-font-size-32 lc-mobile">
                  {{ $t('Home.PlatformCoverage.title.seeOn') }}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lc-container-2">
        <div class="lc-container-3 lc-bg-gray-1">
          <div class="lc-container-4 lc-padding-top-24 lc-padding-bottom-48">
            <ImageGrid :items="channels" />

            <div class="official-network-list__app-banner lc-margin-top-56">
              <div>
                <img src="~/assets/app/logo.svg">
                <div>
                  <a
                    :href="likerLandAppPlatformURL.ios"
                    target="_blank"
                  >
                    <img src="~/assets/app/app-store.svg">
                  </a>
                  <a
                    :href="likerLandAppPlatformURL.android"
                    target="_blank"
                  >
                    <img src="~/assets/app/google-play.svg">
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ImageGrid from '~/components/ImageGrid';

import { LIKER_LAND_APP_LINK } from '~/constant';

const getChannelImage = require.context('~/assets/new-platforms');

export default {
  name: 'official-channel-list',
  components: {
    ImageGrid,
  },
  computed: {
    likerLandAppPlatformURL() {
      return LIKER_LAND_APP_LINK;
    },
    channels() {
      return [
        {
          id: 'bigdipper',
          link: 'https://likecoin.bigdipper.live/',
          isHideBorder: true,
        },
        {
          id: 'medium',
          link: 'https://medium.com/likecoin/',
        },
        {
          id: 'matters',
          link: 'https://matters.news/@likecoin/',
        },
        {
          id: 'github',
          link: 'https://github.com/likecoin/',
          isHideBorder: true,
        },
      ].map(({ id, ...rest }) => ({
        ...rest,
        src: getChannelImage(`./${id}.svg`),
      }));
    },
  },
};
</script>

<style lang="scss">
.official-network-list {
  &__app-banner {
    padding: 0 16px;

    > div {
      display: flex;
      align-items: center;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;

      padding: 48px;

      border-radius: 16px;
      background-color: white;

      img {
        height: 56px;
      }

      @media screen and (max-width: 1024px) {
        flex-direction: column;
        justify-content: center;
      }

      @media screen and (max-width: 414px) {
        padding: 0;

        img {
          height: 48px;
        }
      }

      > img {
        flex-grow: 0;

        margin: 16px;
      }

      > div {
        display: flex;
        align-items: center;
        flex-direction: row;
        flex-grow: 1;
        flex-wrap: wrap;
        justify-content: flex-end;

        @media screen and (max-width: 664px) {
          flex-direction: column;
          justify-content: center;
        }

        > a {
          display: block;

          padding: 16px;

          text-align: center;
        }
      }
    }
  }
}
</style>

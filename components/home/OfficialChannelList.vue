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

            <div class="official-network-list__newsletter-subscription lc-margin-top-56">
              <iframe
                src="https://likecoin.substack.com/embed"
                frameborder="0"
                scrolling="no"
              />
            </div>

            <div class="official-network-list__newsletter-grid">
              <ul>
                <li
                  v-for="newsletter in newsletters"
                  :key="newsletter.guid"
                >
                  <a
                    class="official-network-list__newsletter-grid-item"
                    :href="newsletter.link"
                    target="_blank"
                  >
                    <div
                      class="official-network-list__newsletter-author"
                    >{{ newsletter.author }}</div>
                    <img
                      class="official-network-list__newsletter-thumbnail"
                      :src="newsletter.thumbnail"
                    >
                    <div class="official-network-list__newsletter-grid-item-body">
                      <div
                        class="official-network-list__newsletter-pub-date"
                      >{{ newsletter.pubDate }}</div>
                      <div
                        class="official-network-list__newsletter-title"
                      >{{ newsletter.title }}</div>
                    </div>
                  </a>
                </li>
              </ul>
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
  data() {
    return {
      newsletters: [
        {
          title: 'LikeCoin Annual Report 2019',
          pubDate: '2020-01-01',
          link: 'https://medium.com/likecoin/likecoin-annual-report-2019-f831cb873801',
          guid: 'https://medium.com/p/f831cb873801',
          author: '高重建 | kin ko',
          thumbnail: 'https://cdn-images-1.medium.com/max/800/1*DaBijM-pBtWT9lR1w2L_Fg.png',
        },
        {
          title: 'Genesis — Republic of Liker Land',
          pubDate: '2019-11-07',
          link: 'https://medium.com/likecoin/genesis-republic-of-liker-land-3903bd4d3bc6',
          guid: 'https://medium.com/p/3903bd4d3bc6',
          author: '高重建 | kin ko',
          thumbnail: 'https://cdn-images-1.medium.com/max/800/1*-FfbO5nrur-DkqZ6OnFztQ.png',
        },
        {
          title: 'It’s time to migrate! Migration to the new LikeCoin (and phasing out LikeCoin ERC-20)',
          pubDate: '2019-12-02',
          link: 'https://medium.com/likecoin/its-time-to-migrate-migration-to-the-new-likecoin-and-phasing-out-likecoin-erc-20-111b087a9cad',
          guid: 'https://medium.com/p/111b087a9cad',
          author: 'Phoebe Poon',
          thumbnail: 'https://cdn-images-1.medium.com/max/800/1*nIHzc_LUixJg_cV236_9HQ.png',
        },
        {
          title: 'Why Build A New Blockchain — LikeCoin Chain',
          pubDate: '2019-11-21',
          link: 'https://medium.com/likecoin/why-build-a-new-blockchain-likecoin-chain-a5956ab4dc07',
          guid: 'https://medium.com/p/a5956ab4dc07',
          author: 'Phoebe Poon',
          thumbnail: 'https://cdn-images-1.medium.com/max/800/1*ndbs6sq6tAQo3WfC_fuVqg.png',
        },
        {
          title: 'LikeCoin Weekly Progress Update 2020.03.09',
          pubDate: '2020-03-10',
          link: 'https://medium.com/likecoin/likecoin-weekly-progress-update-2020-03-09-a6a08d252b7b',
          guid: 'https://medium.com/p/a6a08d252b7b',
          author: 'Phoebe Poon',
          thumbnail: 'https://miro.medium.com/max/800/1*AmX69VnAACE9MtMHXi1TxQ.jpeg',
        },
        {
          title: 'LikeCoin Weekly Progress Update 2020.03.02',
          pubDate: '2020-03-04',
          link: 'https://medium.com/likecoin/likecoin-weekly-progress-update-2020-03-02-60a92e4b43f1',
          guid: 'https://medium.com/p/60a92e4b43f1',
          author: 'Phoebe Poon',
          thumbnail: 'https://miro.medium.com/max/800/1*9zSXU4DqVHnH5yhmWycSaQ.jpeg',
        },
      ],
    };
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
        {
          id: 'gitbook',
          link: 'https://docs.like.co/',
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
@import "~assets/variables";

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

  &__newsletter-subscription {
    position: relative;

    overflow: hidden;

    iframe {
      width: 100%;
      padding: 0 16px;

      @media screen and (max-width: 600px) {
        min-height: 360px;
        padding: 0;
      }
    }
  }

  &__newsletter-grid {
    ul {
      margin: 0;
      padding: 12px 16px 0;

      list-style: none;

      column-count: 2;
      column-gap: 28px;

      @media (min-width: 1240px + 1px) {
        column-count: 3;
      }

      @media (max-width: 600px) {
        padding: 0;
        column-count: 1;
      }

      li {
        padding: 14px 0;
      }
    }
  }

  &__newsletter-grid-item {
    display: block;

    transition: 0.1s ease background-color;

    border: 1px solid $gray-e6;
    border-radius: 8px;

    background-color: white;

    break-inside: avoid-column;

    &:hover {
      text-decoration: none !important;

      background-color: rgba(230, 230, 230, 0.8);

      img {
        opacity: 0.5;
      }
    }
  }

  &__newsletter-grid-item-body {
    padding: 8px 16px 24px;
  }

  &__newsletter-author {
    padding: 16px;

    color: $like-black;

    font-size: 16px;
  }

  &__newsletter-thumbnail {
    display: block;

    width: 100%;

    transition: 0.1s ease opacity;

    border: 1px solid $gray-e6;
    border-right-width: 0;
    border-left-width: 0;
  }

  &__newsletter-pub-date {
    font-size: 12px;
  }

  &__newsletter-title {
    color: $like-black;

    font-size: 20px;
    font-weight: 600;
    line-height: normal;
  }
}
</style>

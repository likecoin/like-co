<template>
  <div class="platform-coverage">
    <section class="platform-coverage__info lc-container-0">
      <div class="lc-container-1">
        <div class="lc-container-header">
          <div class="lc-container-2">
            <div class="lc-container-3">
              <div class="lc-container-4">
                <div class="lc-container-header-title">
                  <h2 class="lc-font-size-32 lc-mobile">
                    {{ $t('Home.PlatformCoverage.title.seeOn') }}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="lc-container-2">
          <div class="lc-container-3">
            <div class="lc-container-4">
              <div class="platform-coverage__content platform-coverage__content--discover">
                <div
                  v-for="p in INFO_PLATFORMS"
                  :key="p.id"
                >
                  <a
                    :href="p.url"
                    class="platform-coverage__platform"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <img v-lazy="getImageSrc(p.image)">
                  </a>
                </div>
              </div>

              <hr class="lc-mobile-hide">
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="platform-coverage__trade lc-container-0">
      <div class="lc-container-1">
        <div class="lc-container-header">
          <div class="lc-container-2">
            <div class="lc-container-3">
              <div class="lc-container-4">
                <div class="lc-container-header-title">
                  <h2 class="lc-font-size-32 lc-mobile">
                    {{ $t('Home.PlatformCoverage.title.buyOn') }}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="lc-container-2">
          <div class="lc-container-3">
            <div class="lc-container-4">
              <div class="platform-coverage__content platform-coverage__content--trade">
                <div
                  v-for="p in TRADE_PLATFORMS"
                  :key="p.id"
                >
                  <a
                    :href="p.url"
                    class="platform-coverage__platform"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <img v-lazy="getImageSrc(p.image)">
                  </a>
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
import { LIQUID_LIKEETH_URL } from '@/constant';

const INFO_PLATFORMS = [
  {
    id: 'etherscan',
    image: 'etherscan.png',
    url: 'https://etherscan.io/token/0x02F61Fd266DA6E8B102D4121f5CE7b992640CF98',
  },
  {
    id: 'coinmarketcap',
    image: 'coinmarketcap.png',
    url: 'https://coinmarketcap.com/currencies/likecoin/',
  },
  {
    id: 'coingecko',
    image: 'coingecko.png',
    url: 'https://www.coingecko.com/en/coins/likecoin',
  },
  {
    id: 'feixiaohao',
    image: 'feixiaohao.png',
    url: 'https://www.feixiaohao.com/currencies/likecoin/',
  },
];

const TRADE_PLATFORMS = [
  {
    id: 'liquid',
    image: 'liquid.png',
    url: LIQUID_LIKEETH_URL,
  },
  // { ----------- pending for support
  //   id: 'myethshop',
  //   image: 'myethshop.png',
  //   url: '',
  // } ----------- pending for support
  {
    id: 'idex',
    image: 'idex.png',
    url: 'https://idex.market/eth/like',
  },
];
const platformImages = require.context('@/assets/platforms');

export default {
  name: 'platform-coverage',
  data() {
    return {
      INFO_PLATFORMS,
      TRADE_PLATFORMS,
    };
  },
  methods: {
    getImageSrc(filename) {
      return platformImages(`./${filename}`);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

.lc-container-header-title {
  @media (min-width: 768px + 1px) {
    width: calc(50% - 8px);
  }

  @media (max-width: 768px) and (min-width: 600px + 1px) {
    width: 66%;
  }
}

.platform-coverage {
  @media (min-width: 600px + 1px) {
    margin-top: 48px;
  }

  &__content {
    display: flex;
    flex-wrap: wrap;

    margin-top: 24px;
    margin-left: -6px;

    @media (max-width: 600px) {
      margin-top: 16px;

      > * {
        width: 50% !important;
      }
    }

    &--discover {
      padding-bottom: 24px;

      > * {
        width: 25%;
      }
    }

    &--trade {
      > * {
        width: 33.33%;
      }
    }
  }

  &__trade {
    @media (min-width: 600px + 1px) {
      margin-top: 24px;
    }

    .lc-container-header-title {
      @media (min-width: 600px + 1px) {
        width: unset;
        margin-right: 0 !important;

        background-color: transparent;
      }
    }
  }

  &__platform {
    display: block;

    margin: 6px;

    img {
      transition: transform .2s ease-in;

      border: 1px solid $gray-e6;
      border-radius: 16px;

      object-fit: cover;

      &:hover {
        transform: translateY(-4px);
      }
    }
  }
}

hr {
  border: 0;
  border-top: $border-style-1;
}
</style>

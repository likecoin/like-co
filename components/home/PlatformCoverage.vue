<template>
  <div class="platform-coverage">
    <section class="lc-container-0">
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
            <div class="lc-container-4 lc-padding-top-24 lc-padding-bottom-32">
              <ImageGrid :items="INFO_PLATFORMS" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="lc-container-0 lc-margin-top-48">
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
                    {{ $t('Home.PlatformCoverage.title.buyOn') }}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 lc-padding-top-24 lc-padding-bottom-32">
              <ImageGrid
                :items="TRADE_PLATFORMS"
                :is-narrow="true"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { PURCHASE_LIKE_URL } from '@/constant';
import ImageGrid from '../ImageGrid';

const getExchangeImage = require.context('~/assets/exchanges');
const getPlatformImage = require.context('~/assets/new-platforms');

const INFO_PLATFORMS = [
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
  src: getPlatformImage(`./${id}.svg`),
}));

const TRADE_PLATFORMS = [
  {
    id: 'bitasset',
    link: PURCHASE_LIKE_URL,
  },
  {
    id: 'myethshop',
    link: 'https://www.myethshop.com/',
    isHideBorder: true,
  },
  {
    id: 'liquid',
    link: 'https://app.liquid.com/exchange/LIKEETH',
    isHideBorder: true,
  },
].map(({ id, ...rest }) => ({
  src: getExchangeImage(`./${id}.svg`),
  ...rest,
}));

export default {
  name: 'platform-coverage',
  components: {
    ImageGrid,
  },
  data() {
    return {
      INFO_PLATFORMS,
      TRADE_PLATFORMS,
    };
  },
};
</script>

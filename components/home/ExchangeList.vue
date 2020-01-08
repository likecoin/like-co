<template>
  <section class="exhange-list lc-container-0 lc-margin-top-48">
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
              :items="exchanges"
              :is-narrow="true"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ImageGrid from '~/components/ImageGrid';

import { PURCHASE_LIKE_URL } from '~/constant';

const getExchangeImage = require.context('~/assets/exchanges');

export default {
  name: 'platform-coverage',
  components: {
    ImageGrid,
  },
  computed: {
    exchanges() {
      return [
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
    },
  },
};
</script>

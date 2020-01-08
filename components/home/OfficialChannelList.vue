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
          <div class="lc-container-4 lc-padding-top-24 lc-padding-bottom-32">
            <ImageGrid :items="channels" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ImageGrid from '~/components/ImageGrid';

const getChannelImage = require.context('~/assets/new-platforms');

export default {
  name: 'official-channel-list',
  components: {
    ImageGrid,
  },
  computed: {
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

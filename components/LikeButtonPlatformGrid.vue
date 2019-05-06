<template>
  <PlatformGrid :items="platforms" />
</template>

<script>
import PlatformGrid from '~/components/PlatformGrid';

const getLPlatformLogoSrc = require.context('@/assets/platforms');

export default {
  name: 'like-button-platform-grid',
  components: {
    PlatformGrid,
  },
  computed: {
    platforms() {
      return [
        {
          id: 'matters',
          url: 'https://matters.news/',
        },
        {
          id: 'hkcnews',
          url: 'https://www.hkcnews.com/',
        },
        {
          id: 'standnews',
          url: 'https://thestandnews.com/',
        },
        {
          id: 'inmedia',
          url: 'https://www.inmediahk.net/',
        },
      ].map(platform => ({ ...platform, logoSrc: getLPlatformLogoSrc(`./${platform.id}.svg`) }));
    },
  },
};
</script>

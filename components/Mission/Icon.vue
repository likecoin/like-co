<template>
  <simple-svg
    :filepath="src"
    class="mission-icon"
    fill="currentColor"
  />
</template>


<script>
import likeCoinIcon from '@/assets/logo/icon.svg';

const missionImages = require.context('@/assets/mission/icons');

export default {
  name: 'mission-icon',
  props: {
    missionId: {
      type: String,
      required: true,
    },
  },
  computed: {
    src() {
      try {
        let iconFilename = this.missionId;
        switch (iconFilename) {
          case 'refereeTokenSale':
            iconFilename = 'joinTokenSale';
            break;
          case 'twitterBitmart':
            iconFilename = 'twitterRetweet';
            break;
          default:
            break;
        }
        return missionImages(`./${iconFilename}.svg`);
      } catch (error) {
        return likeCoinIcon;
      }
    },
  },
};
</script>

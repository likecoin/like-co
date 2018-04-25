<template>
  <img class="mission-icon" :src="src" />
</template>


<script>
import LikeCoinIcon from '@/assets/like-coin.svg';

const missionImages = require.context('@/assets/mission/icons');

export default {
  name: 'mission-icon',
  props: {
    missionId: {
      type: String,
    },
  },
  computed: {
    src() {
      try {
        let iconFilename = this.missionId;
        if (iconFilename === 'refereeTokenSale') {
          iconFilename = 'joinTokenSale';
        }

        return missionImages(`./${iconFilename}.svg`);
      } catch (error) {
        return LikeCoinIcon;
      }
    },
  },
};
</script>

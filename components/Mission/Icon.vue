<template>
  <simple-svg
    class="mission-icon"
    :filepath="src"
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
        return likeCoinIcon;
      }
    },
  },
};
</script>

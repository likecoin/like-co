<template>
  <div>
    <div class="lc-padding-top-24 lc-padding-bottom-32">
      <image-grid :items="adopters" />
    </div>
  </div>
</template>

<script>
import ImageGrid from './ImageGrid';

const adopters = [
  {
    src: '/images/adopter-logo/oice.svg',
    link: 'https://oice.com/',
  },
  {
    src: '/images/adopter-logo/lakoo.png',
    link: 'https://lakoo.com/',
  },
];

export default {
  name: 'like-button-adopter',
  components: {
    ImageGrid,
  },
  data() {
    return {
      adopters,
    };
  },
};

</script>

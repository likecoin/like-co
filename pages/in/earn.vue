<template>
  <div class="earn-page">
    <div class="lc-container-1">
      <div class="lc-container-2">
        <div class="lc-container-3 lc-container-no-padding-mobile">
          <like-button-intro class="lc-margin-top-48" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LikeButtonIntro from '@/components/LikeButtonIntro';

export default {
  name: 'earn-page',
  components: {
    LikeButtonIntro,
  },
};
</script>

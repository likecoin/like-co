<template>
  <div class="about-redirect-page">
    <Spinner :size="56" />
  </div>
</template>
<script>
import Spinner from '~/components/Spinner';

export default {
  layout: 'blank',
  components: {
    Spinner,
  },
  mounted() {
    window.location.replace('https://about.like.co');
  },
};
</script>

<style lang="scss" scoped>
.about-redirect-page {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

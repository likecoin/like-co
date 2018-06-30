<template>
  <div
    v-if="!isHidden"
    :class="['lc-block-progress', { loading: isLoading }]"
    :style="style.root">
    <div :style="style.innerDiv">
      <spinner :size="56" />
    </div>
  </div>
</template>


<script>
import Spinner from '@/components/Spinner';

const SPINNER_SIZE = 56;

export default {
  components: {
    Spinner,
  },
  data() {
    return {
      isLoading: false,
      isHidden: true,
      style: {
        root: {
          position: 'fixed',
          zIndex: 2147483647,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#FFFFFFD0',
        },
        innerDiv: {
          position: 'fixed',
          top: `calc((100% - ${SPINNER_SIZE}px) / 2)`,
          left: `calc((100% - ${SPINNER_SIZE}px) / 2)`,
        },
      },
    };
  },
  methods: {
    start() {
      this.isLoading = true;
      this.isHidden = false;
    },
    finish() {
      this.isLoading = false;
      setTimeout(() => {
        this.isHidden = true;
      }, 150);
    },
  },
  mounted() {
    this.finish();
  },
};
</script>


<style lang="scss" scoped>
.lc-block-progress {
  transition: opacity .15s ease-in;

  &:not(.loading) {
    opacity: 0;
  }
}
</style>

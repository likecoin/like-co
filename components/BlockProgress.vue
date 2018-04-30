<template>
  <div
    :class="['lc-block-progress', { loading: isLoading }]"
    :style="style.root">
    <div :style="style.innerDiv">
      <img :src="LikeCoinSpin" :style="style.img" />
    </div>
  </div>
</template>


<script>
import LikeCoinSpin from '~/assets/img/likecoin-spin.gif';

const SPINNER_SIZE = '56px';

export default {
  data() {
    return {
      LikeCoinSpin,
      isLoading: true,
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
          top: `calc((100% - ${SPINNER_SIZE}) / 2)`,
          left: `calc((100% - ${SPINNER_SIZE}) / 2)`,
        },
        img: {
          display: 'block',
          width: SPINNER_SIZE,
          height: SPINNER_SIZE,
        },
      },
    };
  },
  methods: {
    start() {
      this.isLoading = true;
    },
    finish() {
      setTimeout(() => {
        this.isLoading = false;
      }, 300);
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
    pointer-events: none;
  }
}
</style>

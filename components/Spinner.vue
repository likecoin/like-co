<template>
  <img
    :src="LikeCoinSpin"
    :style="style"
    class="lc-spinner"
  >
</template>


<script>
import LikeCoinSpin from '~/assets/img/likecoin-spin.gif';

export default {
  name: 'lc-spinner',
  props: {
    size: Number,
  },
  data() {
    return {
      LikeCoinSpin,
    };
  },
  computed: {
    getSize() {
      return this.size ? `${this.size}px` : '100%';
    },
    style() {
      return {
        display: 'block',
        margin: 'auto',
        width: this.getSize,
        height: this.getSize,
      };
    },
  },
};
</script>

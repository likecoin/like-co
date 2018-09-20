<template>
  <div
    v-if="!isHidden"
    :class="['lc-page-blocker', { loading: isLoading }]"
  >
    <div>
      <spinner :size="SPINNER_SIZE" />
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
      SPINNER_SIZE,
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
};
</script>

<style lang="scss" scoped>
$spinner-size: 56px;

.lc-page-blocker {
  position: fixed;
  z-index: 9999;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  transition: opacity .15s ease-in;

  background-color: #FFFFFFD0;

  &:not(.loading) {
    opacity: 0;
  }

  > div {
    position: fixed;
    top: calc((100% - #{$spinner-size}) / 2);
    left: calc((100% - #{$spinner-size}) / 2);
  }
}
</style>

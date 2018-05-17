import { getIsTokenSaleEnded } from '@/util/helperFn';

export default {
  data() {
    return {
      isICOEnded: getIsTokenSaleEnded(),
      timer: undefined,
    };
  },
  methods: {
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = undefined;
      }
    },
  },
  mounted() {
    if (!this.isICOEnded) {
      this.timer = setInterval(() => {
        this.isICOEnded = getIsTokenSaleEnded();
      }, 1000);
    }
  },
  beforeDestroy() {
    this.clearTimer();
  },
};

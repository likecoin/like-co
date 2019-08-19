<script>
import { mapActions, mapGetters } from 'vuex';


export default {
  name: 'eth-mixin',
  data() {
    return {
      wallet: null,
      callbackFunc: async () => {},
    };
  },
  computed: {
    ...mapGetters([
      'getMetamaskError',
      'getLocalWeb3Wallet',
      'getIsWeb3Polling',
    ]),
  },
  watch: {
    getLocalWeb3Wallet() {
      this.wallet = this.getLocalWeb3Wallet;
      if (this.getIsWeb3Polling) {
        this.stopWeb3Polling();
        this.callbackFunc();
      }
    },
  },
  methods: {
    ...mapActions([
      'startWeb3Polling',
      'stopWeb3Polling',
    ]),
    async startWeb3AndCb(cb, isReset = false) {
      this.callbackFunc = cb;
      const isPolling = await this.startWeb3Polling(isReset);
      if (!isPolling) {
        this.callbackFunc();
      }
    },
  },
};
</script>

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
      'getLocalWallet',
      'getIsWeb3Polling',
    ]),
  },
  watch: {
    getLocalWallet() {
      this.wallet = this.getLocalWallet;
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
    async startWeb3AndCb(cb) {
      this.callbackFunc = cb;
      const isPolling = await this.startWeb3Polling();
      if (!isPolling) {
        this.callbackFunc();
      }
    },
  },
};
</script>

import { mapActions, mapGetters } from 'vuex';

import { logTrackerEvent } from '~/util/EventLogger';
import { signLoginMessage } from '@/util/cosmos/sign';

export default {
  data() {
    return {
      isLoginSuccessful: false,
      signInPayload: {},
    };
  },
  computed: {
    ...mapGetters(['getSigner', 'getAddress', 'getCurrentLocale']),
    platform() {
      return this.walletLoginMethod === 'liker-id' ? 'authcore' : 'likeWallet';
    },
  },
  methods: {
    ...mapActions([
      'openConnectWalletModal',
      'openAuthcoreModal',
      'disconnectWallet',
      'initWallet',
      'initWalletAndLogin',
      'initIfNecessary',
      'doPostAuthRedirect',
      'loginUser',
    ]),
    async connectWallet() {
      try {
        logTrackerEvent(
          this,
          'user',
          'connect_wallet_start',
          'connect_wallet_start',
          1,
        );
        const connection = await this.openConnectWalletModal({
          language: this.$i18n.locale.split('-')[0],
          connectWalletTitle: 'Login',
          connectWalletMobileWarning: this.$t(
            'connect_wallet_mobile_warning',
          ),
          shouldRecommendConnectionMethod: true,
          shouldShowLegacyAuthcoreOptions: true,
          onEvent: this.handleConnectWalletEvent,
        });
        if (!connection) return false;
        const { method } = connection;
        logTrackerEvent(
          this,
          'user',
          `connected_wallet_${method}`,
          'connected_wallet',
          1,
        );

        const res = await this.initWallet(connection);
        if (res) {
          logTrackerEvent(
            this,
            'user',
            'connect_wallet_done_with_login',
            'connect_wallet_done',
            1,
          );
        }
        return res;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        return false;
      }
    },
    async login(loginPayload = {}) {
      this.isLoginSuccessful = false;
      const signer = this.getSigner;
      const address = this.getAddress;
      const payload = await signLoginMessage(signer, address);
      const data = {
        locale: this.getCurrentLocale,
        platform: this.platform,
        ...payload,
        ...loginPayload,
      };
      this.signInPayload = data;
      try {
        await this.loginUser(this.signInPayload);
        this.isLoginSuccessful = true;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    },
    async handleConnectWallet() {
      try {
        await this.connectWallet();
        await this.login();
        if (this.isLoginSuccessful) {
          this.doPostAuthRedirect({ route: { query: this.$route.query }, router: this.$router });
        }
      } catch (error) {
        throw error;
      }
    },
    handleConnectWalletEvent({ type, ...payload }) {
      switch (type) {
        case 'toggle_collapsible_connection_method_list':
          logTrackerEvent(
            this,
            'user',
            `ConnectWalletMethodList${
              payload.isCollapsed ? 'Collapsed' : 'Expanded'
            }`,
            'ConnectWalletMethodListToggle',
            1,
          );
          break;

        case 'select_connection_method':
          logTrackerEvent(
            this,
            'user',
            `ConnectWalletSelected_${payload.method}`,
            'ConnectWalletSelected',
            1,
          );
          break;

        default:
          break;
      }
    },
  },
};

import { mapActions } from 'vuex';

import { logTrackerEvent } from '~/util/EventLogger';

export default {
  methods: {
    ...mapActions([
      'openConnectWalletModal',
      'disconnectWallet',
      'initWallet',
      'initWalletAndLogin',
      'initIfNecessary',
      'restoreSession',
    ]),
    async connectWallet({
      shouldSkipLogin = false,
    } = {}) {
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
          shouldShowLegacyAuthcoreOptions: !!this.$route.query
            .authcore_legacy,
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
            `connect_wallet_done${shouldSkipLogin ? '' : '_with_login'}`,
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

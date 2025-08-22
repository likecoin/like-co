// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue';
import Intercom, {
  show,
  boot,
  hide,
  showMessages,
  update,
  shutdown,
} from '@intercom/messenger-js-sdk';

if (process.env.INTERCOM_APPID) {
  Intercom({
    app_id: process.env.INTERCOM_APPID,
  });

  const intercom = {
    boot: (userData) => {
      boot(userData);
    },
    show: () => {
      show();
    },
    hide: () => {
      hide();
    },
    showMessages: () => {
      showMessages();
    },
    update: (userData) => {
      update(userData);
    },
    shutdown: () => {
      shutdown();
    },
  };

  Vue.prototype.$intercom = intercom;
}

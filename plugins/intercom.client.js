import Intercom, {
  show,
  boot,
  hide,
  showMessages,
  showNewMessage,
  trackEvent,
  update,
  shutdown,
} from '@intercom/messenger-js-sdk';

export default (_, inject) => {
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
      showNewMessage: (newMessage) => {
        showNewMessage(newMessage);
      },
      trackEvent: (eventName, eventData) => {
        trackEvent(eventName, eventData);
      },
      update: (userData) => {
        update(userData);
      },
      shutdown: () => {
        shutdown();
      },
    };

    inject('intercom', intercom);
  }
};

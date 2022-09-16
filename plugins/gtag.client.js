import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies
import VueGtag from 'vue-gtag';

export default (ctx, inject) => {
  const {
    app: { router },
  } = ctx;
  if (process.env.GA_TRACKING_ID) {
    const includes = [];
    if (process.env.ADWORDS_TRACKING_ID) {
      includes.push({ id: process.env.ADWORDS_TRACKING_ID });
    }
    Vue.use(
      VueGtag,
      {
        config: { id: process.env.GA_TRACKING_ID },
        bootstrap: !(window.doNotTrack || navigator.doNotTrack),
        includes,
      },
      router,
    );
    ctx.$gtag = Vue.$gtag;
    inject('gtag', Vue.$gtag);
  }
};

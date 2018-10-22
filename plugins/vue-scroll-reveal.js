import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies
import VueScrollReveal from 'vue-scroll-reveal';

Vue.use(VueScrollReveal, {
  class: 'v-scroll-reveal', // A CSS class applied to elements with the v-scroll-reveal directive; useful for animation overrides.
  duration: 500,
  distance: '8px',
  mobile: true,
  reset: false,
  scale: 1,
});

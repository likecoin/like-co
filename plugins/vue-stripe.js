import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies
import VueStripeCheckout from 'vue-stripe-checkout';

const options = {
  key: 'pk_IRFuJf9AGGEonse5TVHvgFguW3tK3',
  image: 'https://like.co/logo.png',
  locale: 'auto',
  currency: 'USD',
};

Vue.use(VueStripeCheckout, options);

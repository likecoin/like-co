import stripePackage from 'stripe';
import {
  IS_TESTNET,
} from '../../constant';

const config = require('@ServerConfig/config.js'); // eslint-disable-line import/no-extraneous-dependencies

const API_KEY = IS_TESTNET ? config.STRIPE_TEST_KEY : config.STRIPE_PROD_KEY;
const stripe = stripePackage(API_KEY);

export default stripe;

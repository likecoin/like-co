import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies
import { getSingleTestAttribute } from '../util/test';

Vue.prototype.$testID = getSingleTestAttribute;

import Vue from 'vue';
import { getSingleTestAttribute } from '../util/test';

Vue.prototype.$testID = getSingleTestAttribute;

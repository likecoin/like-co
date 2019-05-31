import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies

import { TweenLite } from 'gsap/all';
import CSSPlugin from 'gsap/CSSPlugin';

Vue.prototype.$gsap = {
  TweenLite,
  CSSPlugin, // Make tree-shake happy
};

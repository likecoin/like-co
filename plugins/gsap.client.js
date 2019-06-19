import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies

import { TweenLite, TimelineMax } from 'gsap/all';
import CSSPlugin from 'gsap/CSSPlugin';

Vue.prototype.$gsap = {
  TweenLite,
  TimelineMax,
  CSSPlugin, // Make tree-shake happy
};

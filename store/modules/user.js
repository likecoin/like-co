/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import {
  USER_SET_USER_INFO,
  USER_SET_REGISTERED,
} from '../mutation-types';
import * as actions from './actions/user';
import * as getters from './getters/user';

const state = {
  user: {},
  isUser: false,
};

const mutations = {
  [USER_SET_USER_INFO](state, user) {
    state.user = user;
  },
  [USER_SET_REGISTERED](state, isUser) {
    state.isUser = isUser;
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};

/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import {
  MISSION_SET_MISSION_LIST,
} from '../mutation-types';
import * as actions from './actions/mission';
import * as getters from './getters/mission';

const state = {
  missions: [],
};

const mutations = {
  [MISSION_SET_MISSION_LIST](state, missions) {
    state.missions = missions;
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};

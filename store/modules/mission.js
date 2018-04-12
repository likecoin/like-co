/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies
import {
  MISSION_SET_MISSION_LIST,
  MISSION_SET_MISSION_SEEN,
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
  [MISSION_SET_MISSION_SEEN](state, missionId) {
    const mission = state.missions.find(m => m.id === missionId);
    if (mission) Vue.set(mission, 'seen', true);
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};

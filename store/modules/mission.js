/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies
import {
  MISSION_SET_MISSION_LIST,
  MISSION_SET_MISSION_SEEN,
  MISSION_SET_MISSION_CLAIMED,
  MISSION_SET_REFERRAL_LIST,
  MISSION_SET_REFERRAL_BONUS_LIST,
} from '../mutation-types';
import * as actions from './actions/mission';
import * as getters from './getters/mission';

const state = {
  missions: [],
  referrals: [],
};

const mutations = {
  [MISSION_SET_MISSION_LIST](state, missions) {
    state.missions = missions;
  },
  [MISSION_SET_MISSION_SEEN](state, missionId) {
    const mission = state.missions.find(m => m.id === missionId);
    if (mission) Vue.set(mission, 'seen', true);
  },
  [MISSION_SET_MISSION_CLAIMED](state, missionId) {
    state.missions = state.missions.filter(m => m.id !== missionId);
  },
  [MISSION_SET_REFERRAL_LIST](state, referrals) {
    state.referrals = referrals;
  },
  [MISSION_SET_REFERRAL_BONUS_LIST](state, bonus) {
    bonus.forEach(() => {
    //   state.referrals
    });
    // = bonus;
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};

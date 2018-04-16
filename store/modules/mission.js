/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies
import BigNumber from 'bignumber.js';

import {
  MISSION_SET_MISSION_LIST,
  MISSION_SET_MISSION_SEEN,
  MISSION_SET_MISSION_CLAIMED,
  MISSION_SET_REFERRAL_LIST,
  MISSION_SET_REFERRAL_BONUS_LIST,
  MISSION_SET_REFERRAL_MISSION_CLAIMED,
} from '../mutation-types';
import * as actions from './actions/mission';
import * as getters from './getters/mission';

const state = {
  missions: [],
  referrals: [],
  proxyReward: {},
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
    state.proxyReward = {};
    bonus.forEach((t) => {
      const referree = state.referrals.find(r => r.id === t.referee);
      const mission = referree.missions.find(m => m.referralPayoutType === t.type);
      if (!mission.refereeReward) mission.refereeReward = new BigNumber(0);
      Vue.set(mission, 'refereeReward', mission.refereeReward.plus(new BigNumber(t.value)));
      let proxyReward = state.proxyReward[mission.referralClaimProxy];
      if (!proxyReward) proxyReward = new BigNumber(0);
      Vue.set(
        state.proxyReward,
        mission.referralClaimProxy,
        proxyReward.plus(new BigNumber(t.value)),
      );
    });
  },
  [MISSION_SET_REFERRAL_MISSION_CLAIMED](state, mission) {
    Vue.set(state.proxyReward, mission.id, undefined);
    state.referrals.forEach((r, rIndex) => {
      r.missions.forEach((m, mIndex) => {
        if (m.referralClaimProxy === mission.id) {
          // to trigger array reactivity
          Vue.set(state.referrals[rIndex].missions, mIndex, { ...m, refereeReward: undefined });
        }
      });
    });
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};

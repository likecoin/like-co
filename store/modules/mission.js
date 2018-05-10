/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies
import BigNumber from 'bignumber.js';

import {
  MISSION_SET_MISSION_LIST,
  MISSION_SET_MISSION_SEEN,
  MISSION_SET_MISSION_CLAIMED,
  MISSION_STEP_MISSION,
  MISSION_SET_MISSION_DONE,
  MISSION_SET_REFERRAL_LIST,
  MISSION_SET_REFERRAL_BONUS_LIST,
  MISSION_SET_REFERRAL_TYPE_CLAIMED,
  MISSION_SET_REFERRAL_AVATAR,
  MISSION_SET_REFERRAL_SEEN,
  MISSION_SET_MISSION_HISTORY_LIST,
  MISSION_SET_MISSION_BONUS_HISTORY,
  MISSION_CLEAR_ALL,
  MISSION_START_FETCHING_MISSION_LIST,
  MISSION_END_FETCHING_MISSION_LIST,
  MISSION_START_FETCHING_MISSION_HISTORY_LIST,
  MISSION_END_FETCHING_MISSION_HISTORY_LIST,
} from '../mutation-types';
import * as actions from './actions/mission';
import * as getters from './getters/mission';

const state = {
  missions: [],
  referrals: [],
  proxyBonus: {},
  historyMissions: [],
  historyBonus: {},

  isFetched: false,
  isFetching: false,
  isFetchedMissionHistory: false,
  isFetchingMissionHistory: false,
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
  [MISSION_STEP_MISSION](state, { missionId, taskId }) {
    const mission = state.missions.find(m => m.id === missionId);
    Vue.set(mission, taskId, true);
  },
  [MISSION_SET_MISSION_DONE](state, { missionId }) {
    const mission = state.missions.find(m => m.id === missionId);
    Vue.set(mission, 'done', true);
  },
  [MISSION_SET_REFERRAL_LIST](state, referrals) {
    state.referrals = referrals;
  },
  [MISSION_SET_REFERRAL_AVATAR](state, { userId, avatar }) {
    const referral = state.referrals.find(r => r.id === userId);
    if (referral) Vue.set(referral, 'avatar', avatar);
  },
  [MISSION_SET_REFERRAL_BONUS_LIST](state, bonus) {
    state.proxyBonus = {};
    bonus.forEach((t) => {
      const referee = state.referrals.find(r => r.id === t.referee);
      if (referee) {
        const mission = referee.missions.find(m => m.referralPayoutType === t.type);
        if (mission) {
          if (!mission.pendingReferralBonus) mission.pendingReferralBonus = new BigNumber(0);
          Vue.set(mission, 'pendingReferralBonus', mission.pendingReferralBonus.plus(new BigNumber(t.value)));
        }
      }
      const mission = state.missions.find(m => m.targetPayoutType === t.type);
      if (!mission) return; // error case
      let proxyBonus = state.proxyBonus[mission.id];
      if (!proxyBonus) proxyBonus = new BigNumber(0);
      Vue.set(
        state.proxyBonus,
        mission.id,
        proxyBonus.plus(new BigNumber(t.value)),
      );
    });
  },
  [MISSION_SET_REFERRAL_TYPE_CLAIMED](state, type) {
    const mission = state.missions.find(m => m.targetPayoutType === type);
    Vue.set(state.proxyBonus, mission.id, undefined);
    state.referrals.forEach((r, rIndex) => {
      r.missions.forEach((m, mIndex) => {
        if (m.referralPayoutType === type) {
          // to trigger array reactivity
          Vue.set(
            state.referrals[rIndex].missions,
            mIndex,
            { ...m, pendingReferralBonus: undefined },
          );
        }
      });
    });
  },
  [MISSION_SET_REFERRAL_SEEN](state, referralId) {
    const referral = state.referrals.find(r => r.id === referralId);
    if (referral) Vue.set(referral, 'seen', true);
  },
  [MISSION_SET_MISSION_HISTORY_LIST](state, missions) {
    state.historyMissions = missions.map(m => ({ ...m, isHistory: true }));
    state.isFetchedMissionHistory = true;
  },
  [MISSION_SET_MISSION_BONUS_HISTORY](state, bonus) {
    state.historyBonus = {};
    Object.keys(bonus).forEach((type) => {
      const value = bonus[type];
      const mission = state.missions.find(m => m.targetPayoutType === type);
      if (!mission) return; // error case
      let historyBonus = state.historyBonus[mission.id];
      if (!historyBonus) historyBonus = new BigNumber(0);
      Vue.set(
        state.historyBonus,
        mission.id,
        historyBonus.plus(new BigNumber(value)),
      );
    });
  },
  [MISSION_CLEAR_ALL](state) {
    state.missions = [];
    state.referrals = [];
    state.proxyBonus = {};
    state.historyMissions = [];
    state.historyBonus = {};
    state.isFetching = false;
    state.isFetched = false;
    state.isFetchingMissionHistory = false;
    state.isFetchedMissionHistory = false;
  },
  [MISSION_START_FETCHING_MISSION_LIST](state) {
    state.isFetching = true;
  },
  [MISSION_END_FETCHING_MISSION_LIST](state) {
    state.isFetching = false;
    state.isFetched = true;
  },
  [MISSION_START_FETCHING_MISSION_HISTORY_LIST](state) {
    state.isFetchingMissionHistory = true;
  },
  [MISSION_END_FETCHING_MISSION_HISTORY_LIST](state) {
    state.isFetchingMissionHistory = false;
    state.isFetchedMissionHistory = true;
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};

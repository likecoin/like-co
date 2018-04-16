/* eslint import/prefer-default-export: "off" */
import * as api from '@/util/api/api';
import * as types from '@/store/mutation-types';

import apiWrapper from './api-wrapper';

export async function fetchMissionList({ commit }, id) {
  return apiWrapper(commit, api.apiFetchMissionList(id));
}

export async function refreshMissionList({ commit }, id) {
  const missions = await apiWrapper(commit, api.apiFetchMissionList(id));
  commit(types.MISSION_SET_MISSION_LIST, missions);
}

export async function setMissionSeen({ commit }, { user, missionId }) {
  await apiWrapper(commit, api.apiPostSeenMission(missionId, { user }), { slient: true });
  commit(types.MISSION_SET_MISSION_SEEN, missionId);
}

export async function postStepMission({ commit }, { user, missionId, taskId }) {
  return apiWrapper(
    commit,
    api.apiPostStepMission(missionId, { user, taskId }),
    { blocking: true },
  );
}

export async function claimMission({ commit }, { user, missionId }) {
  await apiWrapper(commit, api.apiClaimMission(user, missionId));
  commit(types.MISSION_SET_MISSION_CLAIMED, missionId);
}

export async function refreshReferralMissionList({ commit }, id) {
  const [missions, bonus] = await Promise.all([
    apiWrapper(commit, api.apiFetchReferralMissionList(id)),
    apiWrapper(commit, api.apiFetchReferralBonusList(id)),
  ]);
  commit(types.MISSION_SET_REFERRAL_LIST, missions);
  commit(types.MISSION_SET_REFERRAL_BONUS_LIST, bonus);
}

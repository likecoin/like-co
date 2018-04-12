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

export async function postSeenMission({ commit }, { user, missionId }) {
  return apiWrapper(commit, api.apiPostSeenMission(missionId, { user }), { blocking: true });
}

export async function postStepMission({ commit }, { user, missionId, taskId }) {
  return apiWrapper(
    commit,
    api.apiPostStepMission(missionId, { user, taskId }),
    { blocking: true },
  );
}

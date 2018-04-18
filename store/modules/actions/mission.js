/* eslint import/prefer-default-export: "off" */
import * as api from '@/util/api/api';
import * as types from '@/store/mutation-types';

import apiWrapper from './api-wrapper';

export async function fetchMissionList({ commit }, id) {
  return apiWrapper(commit, api.apiFetchMissionList(id));
}

export async function fetchMissionHistoryList({ commit }, id) {
  return apiWrapper(commit, api.apiFetchMissionHistoryList(id));
}

export async function refreshMissionList({ commit }, id) {
  const [missions, referralMissions, bonus] = await Promise.all([
    apiWrapper(commit, api.apiFetchMissionList(id)),
    apiWrapper(commit, api.apiFetchReferralMissionList(id)),
    apiWrapper(commit, api.apiFetchReferralBonusList(id)),
  ]);
  commit(types.MISSION_SET_MISSION_LIST, missions);
  commit(types.MISSION_SET_REFERRAL_LIST, referralMissions);
  commit(types.MISSION_SET_REFERRAL_BONUS_LIST, bonus);
}

export async function setMissionSeen({ commit }, { user, missionId }) {
  await apiWrapper(commit, api.apiPostSeenMission(missionId, { user }), { slient: true });
  commit(types.MISSION_SET_MISSION_SEEN, missionId);
}

export async function postStepMission({ commit }, { user, missionId, taskId }) {
  const { done } = await apiWrapper(
    commit,
    api.apiPostStepMission(missionId, { user, taskId }),
    { blocking: true },
  );
  commit(types.MISSION_STEP_MISSION, { missionId, taskId });
  if (done) commit(types.MISSION_SET_MISSION_DONE, { missionId });
  return done;
}

export async function claimMission({ commit }, { user, missionId }) {
  await apiWrapper(commit, api.apiClaimMission(user, missionId), { blocking: true });
  commit(types.MISSION_SET_MISSION_CLAIMED, missionId);
}

export async function claimReferralBonus({ commit }, { user, type }) {
  await apiWrapper(commit, api.apiClaimReferralBonus(user, type), { blocking: true });
  commit(types.MISSION_SET_REFERRAL_TYPE_CLAIMED, type);
}

export async function onMissionClick({ commit, state, rootState }, m) {
  const { user } = rootState.user.user; // module.object.username...
  if (m.isReferral) {
    if (m.pendingReferralBonus) { // referral && has pending bonus
      return claimReferralBonus({ commit }, {
        type: m.referralPayoutType,
        user,
      });
    }
  } else {
    if (!m.seen) setMissionSeen({ commit }, { missionId: m.id, user });
    if (m.isProxy && state.proxyBonus[m.id]) { // is proxy and can claim
      return claimReferralBonus({ commit }, { type: m.targetPayoutType, user });
    } else if (m.done) {
      const promises = [claimMission({ commit }, { missionId: m.id, user })];
      /* short cut hacks for different missions */
      if (m.id === 'joinTokenSale') promises.push(claimReferralBonus({ commit }, { type: 'ico-referee', user }));
      return Promise.all(promises);
    }
  }

  commit(types.UI_SET_MISSION_DIALOG, m);

  return false;
}

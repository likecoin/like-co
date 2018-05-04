/* eslint import/prefer-default-export: "off" */
import * as api from '@/util/api/api';
import * as types from '@/store/mutation-types';

import apiWrapper from './api-wrapper';

export async function fetchMissionList({ commit }, id) {
  return apiWrapper(commit, api.apiFetchMissionList(id));
}

export async function refreshMissionHistoryList({ commit }, id) {
  commit(types.MISSION_START_FETCHING_MISSION_HISTORY_LIST);
  const [missions, bonus] = await Promise.all([
    apiWrapper(commit, api.apiFetchMissionHistoryList(id)),
    apiWrapper(commit, api.apiFetchMissionHistoryBonus(id)),
  ]);
  commit(types.MISSION_SET_MISSION_HISTORY_LIST, missions);
  commit(types.MISSION_SET_MISSION_BONUS_HISTORY, bonus);
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
  referralMissions.forEach(async (r) => {
    const { avatar } = await apiWrapper(commit, api.apiGetUserMinById(r.id), { slient: true });
    commit(types.MISSION_SET_REFERRAL_AVATAR, { userId: r.id, avatar });
  });
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
    if (m.isProxy) {
      if (state.proxyBonus[m.id]) { // is proxy and can claim
        await claimReferralBonus({ commit }, { type: m.targetPayoutType, user });
        commit(types.UI_SET_MISSION_DIALOG, { ...m, isCompleted: true });
        return true;
      }
    } else if (m.done) {
      const promises = [claimMission({ commit }, { missionId: m.id, user })];
      /* short cut hacks for different missions */
      if (m.id === 'joinTokenSale') promises.push(claimReferralBonus({ commit }, { type: 'ico-referee', user }));
      return Promise.all(promises).then(() => {
        commit(types.UI_SET_MISSION_DIALOG, { ...m, isCompleted: true });
      });
    }
  }

  commit(types.UI_SET_MISSION_DIALOG, m);

  return false;
}

export async function onReferralSeen(ctx, { referralId }) {
  const { state, rootState, commit } = ctx;
  const { user } = rootState.user.user; // module.object.username...
  const referral = state.referrals.find(r => r.id === referralId);
  if (referral && !referral.seen) {
    await apiWrapper(commit, api.apiPostSeenReferral(user, { referralId }), { slient: true });
    commit(types.MISSION_SET_REFERRAL_SEEN, referralId);
  }
}

export async function onReferralMissionClick(ctx, { mission, referralId }) {
  onReferralSeen(ctx, { referralId });
  return onMissionClick(ctx, mission);
}

/* eslint import/prefer-default-export: "off" */
import * as api from '@/util/api/api';
import * as types from '@/store/mutation-types';

import apiWrapper from './api-wrapper';

export async function fetchMissionList({ commit, dispatch }, id) {
  const missions = await apiWrapper({ commit, dispatch }, api.apiFetchMissionList(id));
  return missions.filter(m => !m.hide);
}

export async function fetchMissionHiddenList({ commit, dispatch }, id) {
  const missions = await apiWrapper({ commit, dispatch }, api.apiFetchMissionList(id));
  return missions.filter(m => m.hide);
}

export async function refreshMissionHistoryList({ commit, dispatch }, id) {
  commit(types.MISSION_START_FETCHING_MISSION_HISTORY_LIST);
  const [missions, bonus] = await Promise.all([
    apiWrapper({ commit, dispatch }, api.apiFetchMissionHistoryList(id)),
    apiWrapper({ commit, dispatch }, api.apiFetchMissionHistoryBonus(id)),
  ]);
  commit(types.MISSION_SET_MISSION_HISTORY_LIST, missions);
  commit(types.MISSION_SET_MISSION_BONUS_HISTORY, bonus);
  commit(types.MISSION_END_FETCHING_MISSION_HISTORY_LIST);
}

export async function refreshMissionList(ctx, id) {
  const { commit } = ctx;
  commit(types.MISSION_START_FETCHING_MISSION_LIST);
  const [missions, referralMissions, bonus] = await Promise.all([
    apiWrapper(ctx, api.apiFetchMissionList(id)),
    apiWrapper(ctx, api.apiFetchReferralMissionList(id)),
    apiWrapper(ctx, api.apiFetchReferralBonusList(id)),
  ]);
  commit(types.MISSION_SET_MISSION_LIST, missions.filter(m => !m.hide));
  commit(types.MISSION_SET_MISSION_HIDDEN_LIST, missions.filter(m => m.hide));
  commit(types.MISSION_SET_REFERRAL_LIST, referralMissions);
  commit(types.MISSION_SET_REFERRAL_BONUS_LIST, bonus);
  referralMissions.forEach(async (r) => {
    const { avatar } = await apiWrapper(ctx, api.apiGetUserMinById(r.id), { slient: true });
    commit(types.MISSION_SET_REFERRAL_AVATAR, { userId: r.id, avatar });
  });
  commit(types.MISSION_END_FETCHING_MISSION_LIST);
}

export async function setMissionSeen({ commit, dispatch }, { user, missionId }) {
  await apiWrapper(
    { commit, dispatch },
    api.apiPostSeenMission(missionId, { user }),
    { slient: true },
  );
  commit(types.MISSION_SET_MISSION_SEEN, missionId);
}

export async function postStepMission({ commit, dispatch }, { user, missionId, taskId }) {
  const { done } = await apiWrapper(
    { commit, dispatch },
    api.apiPostStepMission(missionId, { user, taskId }),
    { blocking: true },
  );
  commit(types.MISSION_STEP_MISSION, { missionId, taskId });
  if (done) commit(types.MISSION_SET_MISSION_DONE, { missionId });
  return done;
}

export async function claimMission({ commit, dispatch }, { user, missionId }) {
  await apiWrapper({ commit, dispatch }, api.apiClaimMission(user, missionId), { blocking: true });
  commit(types.MISSION_SET_MISSION_CLAIMED, missionId);
}

export async function claimReferralBonus({ commit, dispatch }, { user, type }) {
  await apiWrapper({ commit, dispatch }, api.apiClaimReferralBonus(user, type), { blocking: true });
  commit(types.MISSION_SET_REFERRAL_TYPE_CLAIMED, type);
}

export async function onMissionClick(ctx, m) {
  const { commit, state, rootState } = ctx;
  const { user } = rootState.user.user; // module.object.username...
  if (m.isReferral) {
    if (m.pendingReferralBonus) { // referral && has pending bonus
      return claimReferralBonus(ctx, {
        type: m.referralPayoutType,
        user,
      });
    }
  } else {
    if (!m.seen) setMissionSeen(ctx, { missionId: m.id, user });
    if (m.isProxy) {
      if (state.proxyBonus[m.id]) { // is proxy and can claim
        await claimReferralBonus(ctx, { type: m.targetPayoutType, user });
        commit(types.UI_SET_MISSION_DIALOG, { ...m, isCompleted: true });
        return true;
      }
    } else if (m.done) {
      const promises = [claimMission(ctx, { missionId: m.id, user })];
      /* short cut hacks for different missions */
      if (m.id === 'joinTokenSale') promises.push(claimReferralBonus(ctx, { type: 'ico-referee', user }));
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
    await apiWrapper(
      ctx,
      api.apiPostSeenReferral(user, { referralId }),
      { slient: true },
    );
    commit(types.MISSION_SET_REFERRAL_SEEN, referralId);
  }
}

export async function onReferralMissionClick(ctx, { mission, referralId }) {
  onReferralSeen(ctx, { referralId });
  return onMissionClick(ctx, mission);
}

import { MERGED_MISSIONS, ONE_LIKE } from '@/constant';

export const getProxyMissionReward = state => (id) => {
  const reward = state.proxyBonus[id];
  if (reward) return reward.div(ONE_LIKE).toFixed();
  return null;
};

const canClaim = (state, m) => (
  (m.isProxy && !!getProxyMissionReward(state)(m.id))
  || (!m.isProxy && m.done)
);

const filterMissions = (state, missions) => {
  const filteredMissions = [];
  missions.forEach((m) => {
    if (MERGED_MISSIONS[m.id]) {
      const target = MERGED_MISSIONS[m.id];
      /* dont push into return array if is merged mission */
      if (missions.find(t => t.id === target)) return;
    }
    if (m.endTs && m.endTs < Date.now() && !canClaim(state, m)) return;
    filteredMissions.push(m);
  });
  return filteredMissions.sort((a, b) => {
    if (a.upcoming !== b.upcoming) {
      return a.upcoming ? 1 : -1;
    }
    if (canClaim(state, a) !== canClaim(state, b)) {
      return canClaim(state, a) ? -1 : 1;
    }
    if (a.seen !== b.seen) {
      return a.seen ? 1 : -1;
    }
    if (a.isProxy !== b.isProxy) {
      return a.isProxy ? 1 : -1;
    }
    return 0;
  });
};

export const getMissionList = state => filterMissions(state, state.missions);

export const getMissionHiddenList = state => filterMissions(state, state.hiddenMissions);

export const getNewMissionlist = state => state.missions.filter(m => !m.seen);

export const getShortMissionList =
  state => getMissionList(state)
    .filter(m => (!m.upcoming || Date.now() >= m.upcoming))
    .slice(0, 4);

export const getReferralMissionList = state => state.referrals;

export const getMissionHistorylist = state => state.historyMissions;

export const getMissionHistoryReward = state => id => state.historyBonus[id];

export const getMissionById = state => id => getMissionList(state).find(m => m.id === id);

export const getIsFetchingMissions = state => state.isFetching;
export const getIsFetchedMissions = state => state.isFetched;

export const getIsFetchingMissionHistory = state => state.isFetchingMissionHistory;
export const getIsFetchedMissionHistory = state => state.isFetchedMissionHistory;

export const getSelectedMission = state => state.selectedMission;

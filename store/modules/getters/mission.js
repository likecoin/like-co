export const getMissionList = state => state.missions;

export const getNewMissionlist = state => state.missions.filter(m => !m.seen);

export const getReferralMissionList = state => state.referrals;

export const getProxyMissionReward = state => id => state.proxyBonus[id];

export const getMissionById = state => id => state.missions.find(m => m.id === id);

import { MERGED_MISSIONS } from '@/constant';

export const getMissionList = (state) => {
  const missions = [];
  state.missions.forEach((m) => {
    if (MERGED_MISSIONS[m.id]) {
      console.log(m.id);
      const target = MERGED_MISSIONS[m.id];
      console.log(target);
      /* dont push into return array if is merged mission */
      if (state.missions.find(t => t.id === target)) return;
    }
    missions.push(m);
  });
  return missions;
};

export const getNewMissionlist = state => state.missions.filter(m => !m.seen);

export const getReferralMissionList = state => state.referrals;

export const getProxyMissionReward = state => id => state.proxyBonus[id];

export const getMissionById = state => id => state.missions.find(m => m.id === id);

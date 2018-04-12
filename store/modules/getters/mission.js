export const getMissionList = state => state.missions;

export const getNewMissionlist = state => state.missions.filter(m => !m.seen);


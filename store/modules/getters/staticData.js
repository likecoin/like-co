/* eslint import/prefer-default-export: "off" */

export const getLikeCoinUsdNumericPrice = state => state.likeCoinUsdNumericPrice;

export const getTotalLikerStatistic = state => state.LIKEStat.totalLiker;

export const getTotalLikeeStatistic = state => state.LIKEStat.totalLikee;

export const getTotalLIKERewardedStatistic = state => state.LIKEStat.LIKEs;

export const getTotalLIKEArticleStatistic = state => state.LIKEStat.totalArticle;

export const getSuggestedArticleList = state => state.suggestedArticleList;

export const getSuggestedArticleInfo = state => state.suggestedArticleInfo;

export const getUserMinInfoById = state => id => state.userInfos[id];

export const getLikerListDetails = state => id => (state.likerListDetails[id] || {});

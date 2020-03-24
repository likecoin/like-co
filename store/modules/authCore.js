/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import {
  AUTHCORE_SET_ACCESS_TOKEN,
  AUTHCORE_SET_AUTH_CLIENT,
  AUTHCORE_SET_KV_CLIENT,
  AUTHCORE_SET_COSMOS_PROVIDER,
  AUTHCORE_SET_OAUTH_FACTORS,
  AUTHCORE_SET_CURRENT_USER,
} from '../mutation-types';
import * as actions from './actions/authCore';
import * as getters from './getters/authCore';

const state = () => ({
  accessToken: '',
  authClient: null,
  kvClient: null,
  cosmosProvider: null,
  oAuthFactors: [],
  currentUser: {},
});

const mutations = {
  [AUTHCORE_SET_ACCESS_TOKEN](state, accessToken) {
    state.accessToken = accessToken;
  },
  [AUTHCORE_SET_AUTH_CLIENT](state, authClient) {
    state.authClient = authClient;
  },
  [AUTHCORE_SET_KV_CLIENT](state, kvClient) {
    state.kvClient = kvClient;
  },
  [AUTHCORE_SET_COSMOS_PROVIDER](state, cosmosProvider) {
    state.cosmosProvider = cosmosProvider;
  },
  [AUTHCORE_SET_OAUTH_FACTORS](state, oAuthFactors) {
    state.oAuthFactors = oAuthFactors;
  },
  [AUTHCORE_SET_CURRENT_USER](state, currentUser) {
    state.currentUser = currentUser;
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};

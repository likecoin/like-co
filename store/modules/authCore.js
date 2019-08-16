/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import {
  AUTHCORE_SET_ACCESS_TOKEN,
  AUTHCORE_SET_KV_CLIENT,
  AUTHCORE_SET_COSMOS_PROVIDER,
} from '../mutation-types';
import * as actions from './actions/authCore';
import * as getters from './getters/authCore';

const state = () => ({
  accessToken: '',
  kvClient: null,
  cosmosProvider: null,
});

const mutations = {
  [AUTHCORE_SET_ACCESS_TOKEN](state, accessToken) {
    state.accessToken = accessToken;
  },
  [AUTHCORE_SET_KV_CLIENT](state, kvClient) {
    state.kvClient = kvClient;
  },
  [AUTHCORE_SET_COSMOS_PROVIDER](state, cosmosProvider) {
    state.cosmosProvider = cosmosProvider;
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};

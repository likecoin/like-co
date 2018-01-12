import * as types from '@/store/mutation-types';

// Use this wrapper for non-batch actions
async function apiWrapper(commit, promise) {
  commit(types.UI_START_LOADING);
  try {
    const res = await promise;
    commit(types.UI_STOP_LOADING);
    return res.data;
  } catch (error) {
    commit(types.UI_ERROR_MSG, (error.response) ? error.response.data : error);
    console.error(error);
    return error;
  }
}

export default apiWrapper;

import * as types from '@/store/mutation-types';

// Use this wrapper for non-batch actions
async function apiWrapper(commit, promise) {
  commit(types.UI_START_LOADING);
  try {
    const res = await promise;
    commit(types.UI_STOP_LOADING);
    return res.data;
  } catch (error) {
    commit(types.UI_STOP_LOADING);
    const { response } = error;
    /* hacky way to bypass own 404 page messing up layout */
    const isHtml = !!(response
      && response.headers
      && response.headers['content-type']
      && response.headers['content-type'].includes('html'));
    const errorMsg = (isHtml ? response.statusText : (response && response.data))
      || error.message
      || error;
    commit(types.UI_ERROR_MSG, errorMsg);
    console.error(error);
    throw new Error(errorMsg);
  }
}

export default apiWrapper;

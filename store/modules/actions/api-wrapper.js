import * as types from '@/store/mutation-types';

// Use this wrapper for non-batch actions
async function apiWrapper(commit, promise, opt = {}) {
  const { blocking, slient } = opt;
  if (!slient) commit(blocking ? types.UI_START_BLOCKING_LOADING : types.UI_START_LOADING);
  try {
    const res = await promise;
    commit(blocking ? types.UI_STOP_BLOCKING_LOADING : types.UI_STOP_LOADING);
    return res.data;
  } catch (error) {
    commit(blocking ? types.UI_STOP_BLOCKING_LOADING : types.UI_STOP_LOADING);
    const { response } = error;
    /* hacky way to bypass own 404 page messing up layout */
    const isHtml = !!(response
      && response.data
      && (response.data.includes('<!DOCTYPE html>')
        || response.data.includes('<html>')));
    const errorMsg = (isHtml ? response.statusText : (response && response.data))
      || error.message
      || error;
    commit(types.UI_ERROR_MSG, errorMsg);
    console.error(error);
    throw new Error(errorMsg);
  }
}

export default apiWrapper;

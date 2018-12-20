import * as types from '@/store/mutation-types';

// Use this wrapper for non-batch actions
async function apiWrapper({ commit, dispatch }, promise, opt = {}) {
  const { blocking, slient, error: errorMode = '' } = opt;
  if (!slient) commit(blocking ? types.UI_START_BLOCKING_LOADING : types.UI_START_LOADING);
  try {
    const res = await promise;
    if (!slient) commit(blocking ? types.UI_STOP_BLOCKING_LOADING : types.UI_STOP_LOADING);
    return res.data;
  } catch (error) {
    if (!slient) commit(blocking ? types.UI_STOP_BLOCKING_LOADING : types.UI_STOP_LOADING);
    const { response } = error;
    if (response && response.statusCode === 401) {
      await dispatch('doUserAuth');
      const res = await promise;
      if (!slient) commit(blocking ? types.UI_STOP_BLOCKING_LOADING : types.UI_STOP_LOADING);
      return res.data;
    }
    /* hacky way to bypass own 404 page messing up layout */
    const isHtml = !!(response
      && response.data
      && typeof response.data === 'string'
      && (response.data.includes('<!DOCTYPE html>')
        || response.data.includes('<html>')));
    const isTooLarge = (response && response.status === 413);
    const errorMsg = ((isHtml || isTooLarge) ? response.statusText : (response && response.data))
      || error.message
      || error;
    if (!slient) commit(types.UI_ERROR_MSG, errorMsg);
    console.error(error);
    throw errorMode && errorMode === 'raw' ? error : new Error(errorMsg);
  }
}

export default apiWrapper;

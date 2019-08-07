import {
  apiFetchAuthPlatformURL,
  apiPostAuthPlatformToken,
} from '@/util/api/api';

export async function getAuthPlatformSignInURL(platform, type = 'login') {
  const { data } = await apiFetchAuthPlatformURL(platform, type);
  return data;
}

export async function getAuthPlatformSignInPayload(platform, { code, state }) {
  const { data } = await apiPostAuthPlatformToken(platform, { code, state });
  return data;
}

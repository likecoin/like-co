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
  switch (platform) {
    case 'matters': {
      if (data.userId) {
        data.suggestedName = data.userId;
      }
      break;
    }
    default: break;
  }
  if (data.avatar) data.avatarURL = data.avatar;
  return data;
}

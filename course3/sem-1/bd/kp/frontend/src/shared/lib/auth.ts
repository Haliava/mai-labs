import { jwtDecode } from 'jwt-decode';
import axios, { AxiosError } from 'axios';

import { BASE_API_URL } from '../const/envVars';
import { flattenObject } from './utils';

const WEEK_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;

const singleUpdate = <T extends (...args: any) => any>(clb: T) => {
  let isProcessing = false;
  return async (...args: Parameters<T>) => {
    if (isProcessing) return undefined;
    try {
      isProcessing = true;
      return await clb(...args);
    } finally {
      isProcessing = false;
    }
  };
};

const updateToken = singleUpdate((oldToken: string) => {
  return axios.post<OAuthTokenResp>('/v1.0/oauth/update-token', undefined, {
    baseURL: BASE_API_URL,
    responseType: 'json',
    headers: { Authorization: `Bearer ${oldToken}` },
  });
});

export const validateTokenBody = (token: string) => {
  try {
    jwtDecode<TokenPayload>(token);
    return true;
  } catch (e) {
    return false;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const payload = jwtDecode<TokenPayload>(token);
  const expirationTime = Math.trunc(payload.exp * 1000) - WEEK_MILLISECONDS;
  return Date.now() > expirationTime;
};

export const refreshAccessToken = async (oldToken: string, onLogout: VoidFunction): Promise<string | null> => {
  try {
    const newTokenResp = await updateToken(oldToken);
    if (!newTokenResp) {
      return null;
    }

    return newTokenResp.data?.access_token;
  } catch (err) {
    const error = err as AxiosError;
    if (error?.response?.status === 401) onLogout();
    return null;
  }
};

export const getAuthUrl = (
  baseDomain: string,
  { clientId, redirectUri, state, scope }: { clientId: number; redirectUri: string; state: string; scope: string[] },
) => {
  const params = new URLSearchParams(
    flattenObject({
      state,
      scope,
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
    }),
  );

  return `https://${baseDomain}/oauth/authorize?${params.toString()}`;
};
export const makeBrowserConfigString = <T extends Record<string, string>>(config: T) =>
  Object.keys(config).reduce((acc, key) => `${acc}${key}=${config[key]},`, '');

import { AxiosInstance } from 'axios';

export default function useDirectusToken(directusApi: AxiosInstance) {
  return {
    addQueryToPath,
    getToken,
    addTokenToURL,
  };

  function addQueryToPath(path: string, query: Record<string, any>) {
    const queryParams = [];

    for (const [key, value] of Object.entries(query)) {
      queryParams.push(`${key}=${value}`);
    }

    return path.includes('?') ? `${path}&${queryParams.join('&')}` : `${path}?${queryParams.join('&')}`;
  }

  function getToken() {
    if (!directusApi.defaults) return null;

    const authorization =
      directusApi.defaults.headers?.['Authorization'] || directusApi.defaults?.headers?.common?.['Authorization'];

    if (typeof authorization === 'string') {
      return authorization.split(' ')[1];
    }

    return null;
  }

  function addTokenToURL(url: string, token?: string) {
    const accessToken = token || getToken();

    console.log('accessToken', accessToken);

    if (!accessToken) return url;

    return addQueryToPath(url, { access_token: accessToken });
  }
}

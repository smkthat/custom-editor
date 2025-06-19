// Based on https://github.com/directus/directus/blob/main/app/src/utils/fetch-all.ts

import { useApi, useStores } from '@directus/extensions-sdk';
import { cloneDeep, set } from 'lodash';

export const fetchAll = async <T = unknown>(
  url: Parameters<any['get']>[0],
  config: Parameters<any['get']>[1] = {},
  limit = Infinity,
  api: any = null,
  stores: any = null
): Promise<T[]> => {
  if (!api) api = useApi();
  if (!stores) stores = useStores();

  const { useServerStore } = stores;

  let page = 1;
  let hasMore = true;

  const { info } = useServerStore();

  if (!info.queryLimit || info.queryLimit?.max === -1) {
    // do a single request if possible
    set(config as object, 'params.limit', -1);
    const { data } = await api.get(url, config);
    return data.data as T[];
  }

  const pageSize = info.queryLimit!.max;
  const result = [] as T[];

  while (result.length < limit && hasMore) {
    const configWithPagination = cloneDeep(config);
    set(configWithPagination as object, 'params.page', page);
    set(configWithPagination as object, 'params.limit', pageSize);

    const { data } = await api.get(url, configWithPagination);

    if (data.data.length === 0) {
      hasMore = false;
    } else {
      result.push(...data.data);
    }

    page++;
  }

  if (Number.isFinite(limit)) {
    return result.slice(0, limit);
  }

  return result;
};

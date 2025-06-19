// Based on https://github.com/directus/directus/blob/main/app/src/utils/unexpected-error.ts

import { useStores } from '@directus/extensions-sdk';
import { useI18n } from 'vue-i18n';
import type { APIError } from '../types/error';

import { RequestError } from '../types/api';

let store: any;

export function unexpectedError(error: Error | RequestError | APIError): void {
  const i18n = { global: useI18n() };
  const { useNotificationsStore } = useStores();

  if (!store) store = useNotificationsStore();

  const code =
    (error as RequestError).response?.data?.errors?.[0]?.extensions?.code ||
    (error as APIError)?.extensions?.code ||
    'UNKNOWN';

  // eslint-disable-next-line no-console
  console.warn(error);

  store.add({
    title: i18n.global.t(`errors.${code}`),
    type: 'error',
    code,
    dialog: true,
    error,
  });
}

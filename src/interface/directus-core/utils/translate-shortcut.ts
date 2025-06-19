// Based on https://github.com/directus/directus/blob/main/app/src/utils/translate-shortcut.ts

import { capitalize } from 'lodash';

interface NavigatorUAData {
  platform: string;
  // Add other properties if needed
}

declare global {
  interface Navigator {
    // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgentData
    userAgentData?: NavigatorUAData;
  }
}

export function translateShortcut(keys: string[]): string {
  const isMac = navigator.userAgentData?.platform
    ? navigator.userAgentData.platform.toLowerCase().includes('mac')
    : /mac/i.test(navigator.userAgent);

  if (isMac) {
    return keys
      .map((key) => {
        if (key === 'meta') return '⌘';
        if (key === 'option') return '⌥';
        if (key === 'shift') return '⇧';
        if (key === 'alt') return '⌥';
        return capitalize(key);
      })
      .join('');
  } else {
    return keys
      .map((key) => {
        if (key === 'meta') return 'Ctrl';
        return capitalize(key);
      })
      .join('+');
  }
}

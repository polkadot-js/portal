// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useRef, useState } from 'react';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { typesBundle, typesChain } from '@polkadot/apps-config';
import { isString } from '@polkadot/util';

import { useIsMountedRef } from './useIsMountedRef';

function disconnect (apiRef: React.MutableRefObject<ApiPromise | null>): void {
  if (apiRef.current) {
    apiRef.current.disconnect().catch(console.error);
    apiRef.current = null;
  }
}

export function useApiUrl (url?: string | string[]): ApiPromise | null {
  const apiRef = useRef<ApiPromise | null>(null);
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<ApiPromise | null>(null);

  useEffect((): () => void => {
    return (): void => {
      disconnect(apiRef);
    };
  }, []);

  const _setApi = useCallback(
    (api: ApiPromise | null): void => {
      disconnect(apiRef);

      if (mountedRef.current) {
        apiRef.current = api;
        setState(api);
      }
    },
    [mountedRef]
  );

  useEffect((): void => {
    _setApi(null);

    url && (isString(url) || url.length) &&
      ApiPromise
        .create({
          provider: new WsProvider(url),
          typesBundle,
          typesChain
        })
        .then(_setApi)
        .catch(console.error);
  }, [_setApi, url]);

  return state;
}

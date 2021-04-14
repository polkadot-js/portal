// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';

import { useIsMountedRef } from '@polkadot/react-hooks';

import { EthereumProvider } from './types';

interface UseEthProvider {
  provider?: EthereumProvider;
}

export function useEthProvider (): UseEthProvider {
  const mountedRef = useIsMountedRef();
  const [ethProvider, setEthProvider] = useState<EthereumProvider>();

  useEffect(() => {
    if (mountedRef.current && window.ethereum) {
      setEthProvider(window.ethereum);
    }
  }, [mountedRef]);

  return { provider: ethProvider };
}

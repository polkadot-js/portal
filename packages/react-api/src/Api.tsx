// Copyright 2017-2021 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { InjectedExtension } from '@polkadot/extension-inject/types';
import type { ChainProperties, ChainType } from '@polkadot/types/interfaces';
import type { KeyringStore } from '@polkadot/ui-keyring/types';
import type { KeypairType } from '@polkadot/util-crypto/types';
import type { ApiProps, ApiState } from './types';

import React, { useContext, useEffect, useMemo, useState } from 'react';
import store from 'store';

import { ApiPromise } from '@polkadot/api/promise';
import { deriveMapCache, setDeriveCache } from '@polkadot/api-derive/util';
import { ethereumChains, typesBundle, typesChain } from '@polkadot/apps-config';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { TokenUnit } from '@polkadot/react-components/InputNumber';
import { StatusContext } from '@polkadot/react-components/Status';
import ApiSigner from '@polkadot/react-signer/signers/ApiSigner';
import { WsProvider } from '@polkadot/rpc-provider';
import { keyring } from '@polkadot/ui-keyring';
import { settings } from '@polkadot/ui-settings';
import { formatBalance, isTestChain } from '@polkadot/util';
import { defaults as addressDefaults } from '@polkadot/util-crypto/address/defaults';

import ApiContext from './ApiContext';
import registry from './typeRegistry';
import { decodeUrlTypes } from './urlTypes';

interface Props {
  children: React.ReactNode;
  url?: string;
  store?: KeyringStore;
}

interface InjectedAccountExt {
  address: string;
  meta: {
    name: string;
    source: string;
    whenCreated: number;
  };
  type: KeypairType
}

interface ChainData {
  injectedAccounts: InjectedAccountExt[];
  properties: ChainProperties;
  systemChain: string;
  systemChainType: ChainType;
  systemName: string;
  systemVersion: string;
}

export const DEFAULT_DECIMALS = registry.createType('u32', 12);
export const DEFAULT_SS58 = registry.createType('u32', addressDefaults.prefix);
export const DEFAULT_AUX = ['Aux1', 'Aux2', 'Aux3', 'Aux4', 'Aux5', 'Aux6', 'Aux7', 'Aux8', 'Aux9'];

let api: ApiPromise;

export { api };

function isKeyringLoaded () {
  try {
    return !!keyring.keyring;
  } catch {
    return false;
  }
}

function getDevTypes (): Record<string, Record<string, string>> {
  const types = decodeUrlTypes() || store.get('types', {}) as Record<string, Record<string, string>>;
  const names = Object.keys(types);

  names.length && console.log('Injected types:', names.join(', '));

  return types;
}

async function getInjectedAccounts (injectedPromise: Promise<InjectedExtension[]>): Promise<InjectedAccountExt[]> {
  try {
    await injectedPromise;

    const accounts = await web3Accounts();

    return accounts.map(({ address, meta, type }, whenCreated): InjectedAccountExt => ({
      address,
      meta: {
        ...meta,
        name: `${meta.name || 'unknown'} (${meta.source === 'polkadot-js' ? 'extension' : meta.source})`,
        whenCreated
      },
      type
    }));
  } catch (error) {
    console.error('web3Accounts', error);

    return [];
  }
}

async function retrieve (api: ApiPromise, injectedPromise: Promise<InjectedExtension[]>): Promise<ChainData> {
  const [chainProperties, systemChain, systemChainType, systemName, systemVersion, injectedAccounts] = await Promise.all([
    api.rpc.system.properties(),
    api.rpc.system.chain(),
    api.rpc.system.chainType
      ? api.rpc.system.chainType()
      : Promise.resolve(registry.createType('ChainType', 'Live')),
    api.rpc.system.name(),
    api.rpc.system.version(),
    getInjectedAccounts(injectedPromise)
  ]);

  return {
    injectedAccounts,
    properties: registry.createType('ChainProperties', {
      ss58Format: api.consts.system?.ss58Prefix || chainProperties.ss58Format,
      tokenDecimals: chainProperties.tokenDecimals,
      tokenSymbol: chainProperties.tokenSymbol
    }),
    systemChain: (systemChain || '<unknown>').toString(),
    systemChainType,
    systemName: systemName.toString(),
    systemVersion: systemVersion.toString()
  };
}

async function loadOnReady (api: ApiPromise, injectedPromise: Promise<InjectedExtension[]>, store: KeyringStore | undefined, types: Record<string, Record<string, string>>): Promise<ApiState> {
  registry.register(types);
  const { injectedAccounts, properties, systemChain, systemChainType, systemName, systemVersion } = await retrieve(api, injectedPromise);
  const ss58Format = settings.prefix === -1
    ? properties.ss58Format.unwrapOr(DEFAULT_SS58).toNumber()
    : settings.prefix;
  const tokenSymbol = properties.tokenSymbol.unwrapOr([formatBalance.getDefaults().unit, ...DEFAULT_AUX]);
  const tokenDecimals = properties.tokenDecimals.unwrapOr([DEFAULT_DECIMALS]);
  const isEthereum = ethereumChains.includes(api.runtimeVersion.specName.toString());
  const isDevelopment = (systemChainType.isDevelopment || systemChainType.isLocal || isTestChain(systemChain));

  console.log(`chain: ${systemChain} (${systemChainType.toString()}), ${JSON.stringify(properties)}`);

  // explicitly override the ss58Format as specified
  registry.setChainProperties(registry.createType('ChainProperties', { ss58Format, tokenDecimals, tokenSymbol }));

  // first setup the UI helpers
  formatBalance.setDefaults({
    decimals: (tokenDecimals as BN[]).map((b) => b.toNumber()),
    unit: tokenSymbol[0].toString()
  });
  TokenUnit.setAbbr(tokenSymbol[0].toString());

  // finally load the keyring
  isKeyringLoaded() || keyring.loadAll({
    genesisHash: api.genesisHash,
    isDevelopment,
    ss58Format,
    store,
    type: isEthereum ? 'ethereum' : 'ed25519'
  }, injectedAccounts);

  const defaultSection = Object.keys(api.tx)[0];
  const defaultMethod = Object.keys(api.tx[defaultSection])[0];
  const apiDefaultTx = api.tx[defaultSection][defaultMethod];
  const apiDefaultTxSudo = (api.tx.system && api.tx.system.setCode) || apiDefaultTx;

  setDeriveCache(api.genesisHash.toHex(), deriveMapCache);

  return {
    apiDefaultTx,
    apiDefaultTxSudo,
    hasInjectedAccounts: injectedAccounts.length !== 0,
    isApiReady: true,
    isDevelopment: isEthereum ? false : isDevelopment,
    isEthereum,
    specName: api.runtimeVersion.specName.toString(),
    specVersion: api.runtimeVersion.specVersion.toString(),
    systemChain,
    systemName,
    systemVersion
  };
}

function Api ({ children, store, url }: Props): React.ReactElement<Props> | null {
  const { queuePayload, queueSetTxStatus } = useContext(StatusContext);
  const [state, setState] = useState<ApiState>({ hasInjectedAccounts: false, isApiReady: false } as unknown as ApiState);
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [isApiInitialized, setIsApiInitialized] = useState(false);
  const [apiError, setApiError] = useState<null | string>(null);
  const [extensions, setExtensions] = useState<InjectedExtension[] | undefined>();

  const value = useMemo<ApiProps>(
    () => ({ ...state, api, apiError, apiUrl: url, extensions, isApiConnected, isApiInitialized, isWaitingInjected: !extensions }),
    [apiError, extensions, isApiConnected, isApiInitialized, state, url]
  );

  // initial initialization
  useEffect((): void => {
    const provider = new WsProvider(url);
    const signer = new ApiSigner(registry, queuePayload, queueSetTxStatus);
    const types = getDevTypes();

    api = new ApiPromise({ provider, registry, signer, types, typesBundle, typesChain });

    api.on('connected', () => setIsApiConnected(true));
    api.on('disconnected', () => setIsApiConnected(false));
    api.on('error', (error: Error) => setApiError(error.message));
    api.on('ready', (): void => {
      const injectedPromise = web3Enable('polkadot-js/apps');

      injectedPromise
        .then(setExtensions)
        .catch(console.error);

      loadOnReady(api, injectedPromise, store, types)
        .then(setState)
        .catch((error): void => {
          console.error(error);

          setApiError((error as Error).message);
        });
    });

    setIsApiInitialized(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!value.isApiInitialized) {
    return null;
  }

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
}

export default React.memo(Api);

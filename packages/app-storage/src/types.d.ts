// Copyright 2017-2018 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { StorageFunction } from '@polkadot/types/StorageKey';
import { RawParams } from '@polkadot/ui-app/Params/types';

type IdQuery = {
  id: number
}

export type PartialModuleQuery = {
  key: StorageFunction,
  params: RawParams
}

export type StorageModuleQuery = PartialModuleQuery & IdQuery;

export type PartialRawQuery = {
  key: Uint8Array
}

export type StorageRawQuery = PartialRawQuery & IdQuery;

export type QueryTypes = StorageModuleQuery | StorageRawQuery;

export type ParitalQueryTypes = PartialModuleQuery | PartialRawQuery;

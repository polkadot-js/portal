// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, BlockNumber } from '@polkadot/types';
import BN from 'bn.js';
import { DerivedFees, DerivedBalances, DerivedBalancesMap } from '@polkadot/api-derive/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

export type Nominators = {
  // stash account and who is being nominated
  [index: string]: string[]
};

export type ComponentProps = {
  allAccounts?: SubjectInfo,
  balances?: DerivedBalancesMap,
  controllers: string[],
  recentlyOffline: RecentlyOfflineMap,
  stashes: string[],
  validators: string[]
};

export type CalculateBalanceProps = {
  balances_fees?: DerivedFees,
  balances_all?: DerivedBalances,
  system_accountNonce?: BN
};

export type RecentlyOffline = Array<[AccountId, BlockNumber, BN]>;

export type RecentlyOfflineMap = {
  [s: string]: Array<OfflineStatus>
};

export interface OfflineStatus {
  blockNumber: BlockNumber;
  count: BN;
}

export type AccountFilter = 'all' | 'controller' | 'session' | 'stash' | 'unbonded';

export type ValidatorFilter = 'all' | 'hasNominators' | 'noNominators' | 'hasWarnings' | 'noWarnings' | 'iNominated';

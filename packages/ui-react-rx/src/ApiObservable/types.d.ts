// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import BN from 'bn.js';
import { Observable } from 'rxjs';
import { Interfaces } from '@polkadot/jsonrpc/types';
import { ExtrinsicDecoded, SectionItem } from '@polkadot/params/types';
import { Header } from '@polkadot/primitives/header';
import { Storages } from '@polkadot/storage/types';

export type RxBalance = {
  address: string,
  freeBalance: BN,
  nominatedBalance: BN,
  reservedBalance: BN,
  votingBalance: BN,
  stakingBalance: BN,
  nominators?: Array<RxBalance>
}

export type RxProposal = {
  id: BN,
  proposal: ExtrinsicDecoded
};

export type RxReferendum = {
  blockNumber: BN,
  id: BN,
  proposal: ExtrinsicDecoded,
  voteThreshold: number
}

export type RxBalanceMap = {
  [index: string]: RxBalance
}

export type KeyWithParams = [SectionItem<Storages>, any];

export interface ObservableApiInterface {
  rawCall: <T> ({ name, section }: SectionItem<Interfaces>, ...params: Array<any>) => Observable<T>,
  rawStorage: <T> (key: SectionItem<Storages>, ...params: Array<any>) => Observable<T>,
  rawStorageMulti: <T> (...keys: Array<[SectionItem<Storages>, any]>) => Observable<T>,
  bestNumber: () => Observable<BN | undefined>,
  chainNewHead: () => Observable<Header | undefined>,
  democracyLaunchPeriod: () => Observable<BN | undefined>,
  democracyNextTally: () => Observable<BN | undefined>,
  democracyProposalCount: () => Observable<number>,
  democracyProposals: () => Observable<Array<RxProposal>>,
  democracyReferendumCount: () => Observable<BN | undefined>,
  democracyReferendums: () => Observable<Array<RxReferendum>>,
  democracyVotingPeriod: () => Observable<BN | undefined>,
  eraBlockLength: () => Observable<BN | undefined>,
  eraBlockProgress: () => Observable<BN | undefined>,
  eraBlockRemaining: () => Observable<BN | undefined>,
  sessionBlockProgress: () => Observable<BN | undefined>,
  sessionBlockRemaining: () => Observable<BN | undefined>,
  sessionBrokenPercentLate: () => Observable<BN | undefined>,
  sessionBrokenValue: () => Observable<BN | undefined>,
  sessionLength: () => Observable<BN | undefined>,
  sessionTimeExpected: () => Observable<BN | undefined>,
  sessionTimeRemaining: () => Observable<BN | undefined>,
  sessionValidators: () => Observable<Array<string>>,
  stakingFreeBalanceOf: (address: string) => Observable<BN | undefined>,
  stakingIntentions: () => Observable<Array<string>>,
  stakingNominatorsFor: (address: string) => Observable<Array<string>>,
  stakingNominating: (address: string) => Observable<string | undefined>,
  stakingReservedBalanceOf: (address: string) => Observable<BN | undefined>,
  systemAccountIndexOf: (address: string) => Observable<BN | undefined>,
  timestampBlockPeriod: () => Observable<BN | undefined>,
  timestampNow: () => Observable<Date | undefined>,
  validatingBalance: (address: string) => Observable<RxBalance>,
  validatingBalances: (...addresses: Array<string>) => Observable<RxBalanceMap>,
  votingBalance: (address: string) => Observable<RxBalance>,
  votingBalances: (...addresses: Array<string>) => Observable<RxBalance[]>
}

export type ObservableApiNames = keyof ObservableApiInterface;

export type ReferendumVotes = {
  [index: string]: {
    address: string,
    balance: BN,
    vote: boolean
  }
};

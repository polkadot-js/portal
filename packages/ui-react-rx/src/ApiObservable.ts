// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Header } from '@polkadot/primitives/header';
import { RxApiInterface, RxApiInterface$Method } from '@polkadot/api-rx/types';
import { Interfaces } from '@polkadot/jsonrpc/types';
import { SectionItem } from '@polkadot/params/types';
import { Storages } from '@polkadot/storage/types';
import { ExtendedBalance, ExtendedBalanceMap, ObservableApiInterface, KeyWithParams } from './types';

import BN from 'bn.js';
import { Observable, combineLatest } from 'rxjs';
import { concatMap, defaultIfEmpty, map } from 'rxjs/operators';
import storage from '@polkadot/storage';
import assert from '@polkadot/util/assert';
import encodeAddress from '@polkadot/util-keyring/address/encode';

type OptBN = BN | undefined;
type OptDate = Date | undefined;
type MapFn<R, T> = (combined: R) => T;

const defaultMapFn = (result: any): any =>
  result;

export default class ObservableApi implements ObservableApiInterface {
  private api: RxApiInterface;

  constructor (api: RxApiInterface) {
    this.api = api;
  }

  private combine = <T, R> (observables: Array<Observable<any>>, mapfn: MapFn<R, T> = defaultMapFn): Observable<T> => {
    return combineLatest(...observables).pipe(
      defaultIfEmpty([]),
      map(mapfn)
    );
  }

  rawCall = <T> ({ name, section }: SectionItem<Interfaces>, ...params: Array<any>): Observable<T> => {
    assert(section && this.api[section], `Unable to find 'api.${section}'`);

    const fn: RxApiInterface$Method = section
      ? this.api[section][name]
      // @ts-ignore This one is done for 'isConnected'
      : this.api[name];

    assert(fn, `Unable to find 'api${section ? '.' : ''}${section || ''}.${name}'`);

    return fn.apply(null, params);
  }

  rawStorage = <T> (key: SectionItem<Storages>, ...params: Array<any>): Observable<T> => {
    return this
      .rawStorageMulti([key, ...params] as KeyWithParams)
      .pipe(
        map(([result]: Array<T>): T =>
          result
        )
      );
  }

  rawStorageMulti = <T> (...keys: Array<KeyWithParams>): Observable<T> => {
    return this.api.state
      .subscribeStorage(keys)
      .pipe(
        map((result?: any) =>
          result || []
        )
      );
  }

  bestNumber = (): Observable<OptBN> => {
    return this.chainNewHead().pipe(
      map((header?: Header): OptBN =>
        header && header.number
          ? header.number
          : undefined
      )
    );
  }

  chainNewHead = (): Observable<Header | undefined> => {
    return this.api.chain.subscribeNewHead();
  }

  eraBlockLength = (): Observable<OptBN> => {
    return this.combine(
      [
        this.sessionLength(),
        this.sessionsPerEra()
      ],
      ([sessionLength, sessionsPerEra]: [OptBN, OptBN]): OptBN =>
        sessionLength && sessionsPerEra
          ? sessionLength.mul(sessionsPerEra)
          : undefined
    );
  }

  eraBlockProgress = (): Observable<OptBN> => {
    return this.combine(
      [
        this.sessionBlockProgress(),
        this.sessionLength(),
        this.sessionCurrentIndex(),
        this.sessionsPerEra(),
        this.eraLastLengthChange()
      ],
      ([sessionBlockProgress, sessionLength, sessionCurrentIndex, sessionsPerEra, eraLastLengthChange = new BN(0)]: [OptBN, OptBN, OptBN, OptBN, OptBN]): OptBN =>
        sessionsPerEra && sessionCurrentIndex && sessionLength && sessionBlockProgress && eraLastLengthChange
          ? sessionCurrentIndex
              .sub(eraLastLengthChange)
              .mod(sessionsPerEra)
              .mul(sessionLength)
              .add(sessionBlockProgress)
          : undefined
    );
  }

  eraBlockRemaining = (): Observable<OptBN> => {
    return this.combine(
      [
        this.eraBlockLength(),
        this.eraBlockProgress()
      ],
      ([eraBlockLength, eraBlockProgress]: [OptBN, OptBN]): OptBN =>
        eraBlockLength && eraBlockProgress
          ? eraBlockLength.sub(eraBlockProgress)
          : undefined
    );
  }

  eraLastLengthChange = (): Observable<OptBN> => {
    return this.rawStorage(storage.staking.public.lastEraLengthChange);
  }

  sessionBlockProgress = (): Observable<OptBN> => {
    return this.combine(
      [
        this.bestNumber(),
        this.sessionLength(),
        this.sessionLastLengthChange()
      ],
      ([bestNumber, sessionLength, lastSessionLengthChange]: [OptBN, OptBN, OptBN]): OptBN =>
        bestNumber && sessionLength && lastSessionLengthChange
          ? bestNumber
              .sub(lastSessionLengthChange)
              .add(sessionLength)
              .mod(sessionLength)
          : undefined
    );
  }

  sessionBlockRemaining = (): Observable<OptBN> => {
    return this.combine(
      [
        this.sessionBlockProgress(),
        this.sessionLength()
      ],
      ([sessionBlockProgress, sessionLength]: [OptBN, OptBN]): OptBN =>
        sessionBlockProgress && sessionLength
          ? sessionLength.sub(sessionBlockProgress)
          : undefined
    );
  }

  sessionBrokenPercentLate = (): Observable<OptBN> => {
    return this.rawStorage(storage.session.public.brokenPercentLate);
  }

  sessionBrokenValue = (): Observable<OptBN> => {
    return this.combine(
      [
        this.timestampNow(),
        this.sessionTimeExpected(),
        this.sessionTimeRemaining(),
        this.sessionCurrentStart()
      ],
      ([now, sessionTimeExpected, sessionTimeRemaining, sessionCurrentStart]: [OptDate, OptBN, OptBN, OptDate]): OptBN =>
        sessionTimeExpected && sessionTimeRemaining && sessionCurrentStart && now
          ? new BN(
            Math.round(
              100 * (now.getTime() + sessionTimeRemaining.toNumber() - sessionCurrentStart.getTime()) / sessionTimeExpected.toNumber() - 100
            )
          )
          : undefined
    );
  }

  sessionCurrentIndex = (): Observable<OptBN> => {
    return this.rawStorage(storage.session.public.currentIndex);
  }

  sessionCurrentStart = (): Observable<OptBN> => {
    return this.rawStorage(storage.session.public.currentStart);
  }

  sessionLastLengthChange = (): Observable<OptBN> => {
    return this.rawStorage(storage.session.public.lastLengthChange);
  }

  sessionLength = (): Observable<OptBN> => {
    return this.rawStorage(storage.session.public.length);
  }

  sessionsPerEra = (): Observable<OptBN> => {
    return this.rawStorage(storage.staking.public.sessionsPerEra);
  }

  sessionTimeExpected = (): Observable<OptBN> => {
    return this.combine(
      [
        this.sessionLength(),
        this.timestampBlockPeriod()
      ],
      ([sessionLength, blockPeriod]: [OptBN, OptBN]): OptBN =>
        sessionLength && blockPeriod
          ? blockPeriod.mul(sessionLength).muln(1000)
          : undefined
    );
  }

  sessionTimeRemaining = (): Observable<OptBN> => {
    return this.combine(
      [
        this.sessionBlockRemaining(),
        this.timestampBlockPeriod()
      ],
      ([sessionBlockRemaining, blockPeriod]: [OptBN, OptBN]): OptBN =>
        blockPeriod && sessionBlockRemaining
          ? blockPeriod.mul(sessionBlockRemaining).muln(1000)
          : undefined
    );
  }

  sessionValidators = (): Observable<Array<string>> => {
    return this
      .rawStorage(storage.session.public.validators)
      .pipe(
        map((validators: Array<Uint8Array> = []) =>
          // FIXME: Remove as soon as storage returns encoded
          validators.map(encodeAddress)
        )
      );
  }

  stakingIntentions = (): Observable<Array<string>> => {
    return this
      .rawStorage(storage.staking.public.intentions)
      .pipe(
        map((intentions: Array<Uint8Array> = []) =>
          // FIXME: Remove as soon as storage returns encoded
          intentions.map(encodeAddress)
        )
      );
  }

  stakingFreeBalanceOf = (address: string): Observable<OptBN> => {
    return this.rawStorage(storage.staking.public.freeBalanceOf, address);
  }

  stakingNominatorsFor = (address: string): Observable<Array<string>> => {
    return this
      .rawStorage(storage.staking.public.nominatorsFor, address)
      .pipe(
        map((nominators: Array<Uint8Array> = []) =>
          // FIXME: Remove as soon as storage returns encoded
          nominators.map(encodeAddress)
        )
      );
  }

  stakingNominating = (address: string): Observable<string | undefined> => {
    return this
      .rawStorage(storage.staking.public.nominating, address)
      .pipe(
        // FIXME: Remove as soon as storage returns encoded
        map((address?: Uint8Array) =>
          address
            ? encodeAddress(address)
            : undefined
        )
      );
  }

  stakingReservedBalanceOf = (address: string): Observable<OptBN> => {
    return this.rawStorage(storage.staking.public.reservedBalanceOf, address);
  }

  timestampBlockPeriod = (): Observable<OptBN> => {
    return this.rawStorage(storage.timestamp.public.blockPeriod);
  }

  timestampNow = (): Observable<OptDate> => {
    return this.rawStorage(storage.timestamp.public.now);
  }

  systemAccountIndexOf = (address: string): Observable<OptBN> => {
    return this.rawStorage(storage.system.public.accountIndexOf, address);
  }

  validatingBalance = (address: string): Observable<ExtendedBalance> => {
    return this.combine(
      [
        this.votingBalance(address),
        this.votingBalancesNominatorsFor(address)
      ],
      ([balance, nominators = []]: [ExtendedBalance, Array<ExtendedBalance>]): ExtendedBalance => {
        const nominatedBalance = nominators.reduce((total, nominator: ExtendedBalance) => {
          return total.add(nominator.votingBalance);
        }, new BN(0));

        const result = {
          ...balance,
          nominators,
          nominatedBalance,
          stakingBalance: nominatedBalance.add(balance.votingBalance)
        };

        return result;
      }
    );
  }

  validatingBalances = (...addresses: Array<string>): Observable<ExtendedBalanceMap> => {
    return this.combine(
      addresses.map((address) =>
        this.validatingBalance(address)
      ),
      (result: Array<ExtendedBalance>): ExtendedBalanceMap =>
        result.reduce((balances, balance) => {
          balances[balance.address] = balance;

          return balances;
        }, {} as ExtendedBalanceMap)
    );
  }

  votingBalance = (address: string): Observable<ExtendedBalance> => {
    return this.combine(
      [
        this.stakingFreeBalanceOf(address),
        this.stakingReservedBalanceOf(address)
      ],
      ([freeBalance = new BN(0), reservedBalance = new BN(0)]: [OptBN, OptBN]): ExtendedBalance => ({
        address,
        freeBalance,
        nominatedBalance: new BN(0),
        reservedBalance,
        stakingBalance: new BN(0),
        votingBalance: freeBalance.add(reservedBalance)
      })
    );
  }

  votingBalancesNominatorsFor = (address: string) => {
    return this.stakingNominatorsFor(address).pipe(
      concatMap((nominators: Array<string>) =>
        this.votingBalances(...nominators)
      ),
      defaultIfEmpty([])
    );
  }

  votingBalances = (...addresses: Array<string>): Observable<ExtendedBalance[]> => {
    return this.combine(
      addresses.map((address) =>
        this.votingBalance(address)
      )
    );
  }
}

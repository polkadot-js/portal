// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, StorageKey } from '@polkadot/types';
import type { BlockNumber, WinningData } from '@polkadot/types/interfaces';
import type { AuctionInfo, WinnerData, Winning } from './types';

import BN from 'bn.js';
import { useEffect, useRef, useState } from 'react';

import { useApi, useBestNumber, useCall, useEventTrigger, useIsMountedRef } from '@polkadot/react-hooks';
import { BN_ONE, BN_ZERO, u8aEq } from '@polkadot/util';

import { CROWD_PREFIX } from './constants';
import { useLeaseRanges } from './useLeaseRanges';

const FIRST_PARAM = [0];

function isNewWinners (a: WinnerData[], b: WinnerData[]): boolean {
  return JSON.stringify({ w: a }) !== JSON.stringify({ w: b });
}

function isNewOrdering (a: WinnerData[], b: WinnerData[]): boolean {
  return a.length !== b.length ||
    a.some(({ firstPeriod, lastPeriod, paraId }, index) =>
      !paraId.eq(b[index].paraId) ||
      !firstPeriod.eq(b[index].firstPeriod) ||
      !lastPeriod.eq(b[index].lastPeriod)
    );
}

function extractWinners (ranges: [number, number][], auctionInfo: AuctionInfo, optData: Option<WinningData>): WinnerData[] {
  return optData.isNone
    ? []
    : optData.unwrap().reduce<WinnerData[]>((winners, optEntry, index): WinnerData[] => {
      if (optEntry.isSome) {
        const [accountId, paraId, value] = optEntry.unwrap();
        const period = auctionInfo.leasePeriod || BN_ZERO;
        const [first, last] = ranges[index];

        winners.push({
          accountId: accountId.toString(),
          firstPeriod: period.addn(first),
          isCrowdloan: u8aEq(CROWD_PREFIX, accountId.subarray(0, CROWD_PREFIX.length)),
          key: paraId.toString(),
          lastPeriod: period.addn(last),
          paraId,
          value
        });
      }

      return winners;
    }, []);
}

function createWinning ({ endBlock }: AuctionInfo, blockOffset: BN | null | undefined, winners: WinnerData[]): Winning {
  return {
    blockNumber: endBlock && blockOffset
      ? blockOffset.add(endBlock)
      : blockOffset || BN_ZERO,
    blockOffset: blockOffset || BN_ZERO,
    total: winners.reduce((total, { value }) => total.iadd(value), new BN(0)),
    winners
  };
}

function extractData (ranges: [number, number][], auctionInfo: AuctionInfo, values: [StorageKey<[BlockNumber]>, Option<WinningData>][]): Winning[] {
  return values
    .sort(([{ args: [a] }], [{ args: [b] }]) => a.cmp(b))
    .reduce((all: Winning[], [{ args: [blockOffset] }, optData]): Winning[] => {
      const winners = extractWinners(ranges, auctionInfo, optData);

      winners.length && (
        all.length === 0 ||
        isNewWinners(winners, all[all.length - 1].winners)
      ) && all.push(createWinning(auctionInfo, blockOffset, winners));

      return all;
    }, [])
    .reverse();
}

function mergeCurrent (ranges: [number, number][], auctionInfo: AuctionInfo, prev: Winning[] | undefined, optCurrent: Option<WinningData>, blockOffset: BN): Winning[] | undefined {
  const current = createWinning(auctionInfo, blockOffset, extractWinners(ranges, auctionInfo, optCurrent));

  if (current.winners.length) {
    if (!prev || !prev.length) {
      return [current];
    }

    if (isNewWinners(current.winners, prev[0].winners)) {
      if (isNewOrdering(current.winners, prev[0].winners)) {
        return [current, ...prev];
      }

      prev[0] = current;

      return [...prev];
    }
  }

  return prev;
}

function mergeFirst (ranges: [number, number][], auctionInfo: AuctionInfo, prev: Winning[] | undefined, optFirstData: Option<WinningData>): Winning[] | undefined {
  if (prev && prev.length <= 1) {
    const updated: Winning[] = prev || [];
    const firstEntry = createWinning(auctionInfo, null, extractWinners(ranges, auctionInfo, optFirstData));

    if (!firstEntry.winners.length) {
      return updated;
    } else if (!updated.length) {
      return [firstEntry];
    }

    updated[updated.length - 1] = firstEntry;

    return updated.slice();
  }

  return prev;
}

export default function useWinningData (auctionInfo?: AuctionInfo): Winning[] | undefined {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const ranges = useLeaseRanges();
  const [result, setResult] = useState<Winning[] | undefined>();
  const bestNumber = useBestNumber();
  const trigger = useEventTrigger([api.events.auctions?.BidAccepted]);
  const triggerRef = useRef(trigger);
  const initialEntries = useCall<[StorageKey<[BlockNumber]>, Option<WinningData>][]>(api.query.auctions?.winning.entries);
  const optFirstData = useCall<Option<WinningData>>(api.query.auctions?.winning, FIRST_PARAM);

  // should be fired once, all entries as an initial round
  useEffect((): void => {
    mountedRef.current && auctionInfo && initialEntries && setResult(
      extractData(ranges, auctionInfo, initialEntries)
    );
  }, [auctionInfo, initialEntries, mountedRef, ranges]);

  // when block 0 changes, update (typically in non-ending-period, static otherwise)
  useEffect((): void => {
    mountedRef.current && auctionInfo && optFirstData && setResult((prev) =>
      mergeFirst(ranges, auctionInfo, prev, optFirstData)
    );
  }, [auctionInfo, optFirstData, mountedRef, ranges]);

  // on a bid event, get the new entry (assuming the event really triggered, i.e. not just a block)
  // and add it to the list when not duplicated. Additionally we cleanup after ourselves when endBlock
  // gets cleared
  useEffect((): void => {
    if (auctionInfo?.endBlock && bestNumber && bestNumber.gt(auctionInfo.endBlock) && triggerRef.current !== trigger) {
      const blockOffset = bestNumber.sub(auctionInfo.endBlock).iadd(BN_ONE);

      triggerRef.current = trigger;

      api.query.auctions
        ?.winning<Option<WinningData>>(blockOffset)
        .then((optCurrent) =>
          mountedRef.current && setResult((prev) =>
            mergeCurrent(ranges, auctionInfo, prev, optCurrent, blockOffset)
          )
        )
        .catch(console.error);
    }
  }, [api, bestNumber, auctionInfo, mountedRef, ranges, trigger, triggerRef]);

  return result;
}

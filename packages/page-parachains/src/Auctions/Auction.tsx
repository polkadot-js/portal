// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParaId } from '@polkadot/types/interfaces';
import type { AuctionInfo, Campaigns, WinnerData, Winning } from '../types';

import React, { useCallback, useRef } from 'react';

import { Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import { useLeaseRangeMax } from '../useLeaseRanges';
import WinRange from './WinRange';

interface Props {
  auctionInfo?: AuctionInfo;
  campaigns: Campaigns;
  className?: string;
  winningData?: Winning[];
}

function Auction ({ auctionInfo, campaigns, className, winningData }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const rangeMax = useLeaseRangeMax();
  const newRaise = useCall<ParaId[]>(api.query.crowdloan.newRaise);

  const headerRef = useRef([
    [t('bids'), 'start', 3],
    [t('bidder'), 'address'],
    [t('crowdloan')],
    [t('leases')],
    [t('value')]
  ]);

  const interleave = useCallback(
    (winners: WinnerData[], asIs: boolean): WinnerData[] => {
      if (asIs || !newRaise || !auctionInfo?.leasePeriod) {
        return winners;
      }

      const leasePeriod = auctionInfo.leasePeriod;
      const leasePeriodEnd = leasePeriod.add(rangeMax);
      const sorted = (campaigns.funds || [])
        .filter(({ firstPeriod, lastPeriod, paraId }) =>
          newRaise.some((n) => n.eq(paraId)) &&
          firstPeriod.gte(leasePeriod) &&
          lastPeriod.lte(leasePeriodEnd)
        )
        .sort((a, b) => b.value.cmp(a.value));

      return winners
        .concat(...sorted.filter(({ firstPeriod, lastPeriod, paraId, value }) =>
          !winners.some((w) =>
            w.firstPeriod.eq(firstPeriod) &&
            w.lastPeriod.eq(lastPeriod)
          ) &&
          !sorted.some((e) =>
            !paraId.eq(e.paraId) &&
            firstPeriod.eq(e.firstPeriod) &&
            lastPeriod.eq(e.lastPeriod) &&
            value.lt(e.value)
          )
        ))
        .map((w): WinnerData =>
          sorted.find(({ firstPeriod, lastPeriod, value }) =>
            w.firstPeriod.eq(firstPeriod) &&
            w.lastPeriod.eq(lastPeriod) &&
            w.value.lt(value)
          ) || w
        )
        .sort((a, b) =>
          a.firstPeriod.eq(b.firstPeriod)
            ? a.lastPeriod.cmp(b.lastPeriod)
            : a.firstPeriod.cmp(b.firstPeriod)
        );
    },
    [auctionInfo, campaigns, newRaise, rangeMax]
  );

  return (
    <Table
      className={className}
      empty={
        newRaise && auctionInfo && auctionInfo.numAuctions && winningData && (
          auctionInfo.endBlock && !winningData.length
            ? t<string>('No winners in this auction')
            : t<string>('No ongoing auction')
        )
      }
      header={headerRef.current}
      noBodyTag
    >
      {auctionInfo && newRaise && winningData && (
        winningData.length
          ? winningData.map(({ blockNumber, winners }, round) => (
            <tbody key={round}>
              {interleave(winners, round !== 0 || winningData.length !== 1).map((value, index) => (
                <WinRange
                  auctionInfo={auctionInfo}
                  blockNumber={blockNumber}
                  isFirst={index === 0}
                  isLatest={round === 0}
                  key={`${blockNumber.toString()}:${value.key}`}
                  value={value}
                />
              ))}
            </tbody>
          ))
          : newRaise && (newRaise.length !== 0) && (
            <tbody key='latest-crowd'>
              {interleave([], false).map((value, index) => (
                <WinRange
                  auctionInfo={auctionInfo}
                  isFirst={index === 0}
                  isLatest
                  key={`latest-crowd:${value.key}`}
                  value={value}
                />
              ))}
            </tbody>
          )
      )}
    </Table>
  );
}

export default React.memo(Auction);

// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { ParaId } from '@polkadot/types/interfaces';
import type { Campaign, LeasePeriod } from '../types';

import React, { useMemo, useRef } from 'react';

import { Table } from '@polkadot/react-components';
import { useBestHash, useIsParasLinked } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import Fund from './Fund';

interface Props {
  bestNumber?: BN;
  className?: string;
  leasePeriod?: LeasePeriod;
  value: Campaign[] | null;
}

function extractLists (value: Campaign[] | null, leasePeriod?: LeasePeriod): [Campaign[] | null, Campaign[] | null, ParaId[] | null] {
  const currentPeriod = leasePeriod?.currentPeriod;
  let active: Campaign[] | null = null;
  let ended: Campaign[] | null = null;
  let allIds: ParaId[] | null = null;

  if (value && currentPeriod) {
    active = value.filter(({ firstPeriod, isCapped, isEnded, isWinner }) => !(isCapped || isEnded || isWinner) && currentPeriod.lte(firstPeriod));
    ended = value.filter(({ firstPeriod, isCapped, isEnded, isWinner }) => (isCapped || isEnded || isWinner) || currentPeriod.gt(firstPeriod));
    allIds = value.map(({ paraId }) => paraId);
  }

  return [active, ended, allIds];
}

function sortList (hasLinksMap: Record<string, boolean>, list?: Campaign[] | null): Campaign[] | null | undefined {
  return list?.sort(({ key: a }, { key: b }): number => {
    const aKnown = hasLinksMap[a] || false;
    const bKnown = hasLinksMap[b] || false;

    return aKnown === bKnown
      ? 0
      : aKnown
        ? -1
        : 1;
  });
}

function Funds ({ bestNumber, className, leasePeriod, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const bestHash = useBestHash();
  const [active, ended, allIds] = useMemo(
    () => extractLists(value, leasePeriod),
    [leasePeriod, value]
  );
  const hasLinksMap = useIsParasLinked(allIds);
  const [activeSorted, endedSorted] = useMemo(
    () => [sortList(hasLinksMap, active), sortList(hasLinksMap, ended)],
    [active, ended, hasLinksMap]
  );

  const headerActiveRef = useRef([
    [t('ongoing'), 'start', 2],
    [undefined, 'media--800'],
    [undefined, 'media--1400'],
    [t('ending'), 'media--1200'],
    [t('leases')],
    [t('raised')],
    [t('count'), 'media--1100'],
    [undefined, 'media--1000']
  ]);

  const headedEndedRef = useRef([
    [t('completed'), 'start', 2],
    [undefined, 'media--800'],
    [undefined, 'media--1400'],
    [t('ending'), 'media--1200'],
    [t('leases')],
    [t('raised')],
    [t('count'), 'media--1100'],
    [undefined, 'media--1000']
  ]);

  return (
    <>
      <Table
        className={className}
        empty={value && activeSorted && t<string>('No active campaigns found')}
        header={headerActiveRef.current}
      >
        {activeSorted?.map((fund, index) => (
          <Fund
            bestHash={bestHash}
            bestNumber={bestNumber}
            isOdd={!(index % 2)}
            isOngoing
            key={fund.accountId}
            value={fund}
          />
        ))}
      </Table>
      <Table
        className={className}
        empty={value && endedSorted && t<string>('No completed campaigns found')}
        header={headedEndedRef.current}
      >
        {endedSorted?.map((fund, index) => (
          <Fund
            bestNumber={bestNumber}
            isOdd={!(index % 2)}
            key={fund.accountId}
            leasePeriod={leasePeriod}
            value={fund}
          />
        ))}
      </Table>
    </>
  );
}

export default React.memo(Funds);

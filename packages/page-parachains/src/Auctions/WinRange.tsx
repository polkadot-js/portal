// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { AuctionInfo, WinnerData } from '../types';

import React from 'react';

import { AddressMini, ParaLink } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  auctionInfo: AuctionInfo;
  blockNumber?: BN;
  className?: string;
  isFirst: boolean;
  isLatest: boolean;
  value: WinnerData;
}

function WinRanges ({ auctionInfo, blockNumber, className = '', isFirst, isLatest, value: { accountId, firstPeriod, isCrowdloan, lastPeriod, paraId, value } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <tr className={className}>
      <td>
        {isFirst && (
          <h1>{isLatest
            ? t<string>('latest')
            : <>#{formatNumber((!blockNumber || blockNumber.isZero()) ? auctionInfo.endBlock : blockNumber)}</>
          }</h1>
        )}
      </td>
      <td className='number'><h1>{formatNumber(paraId)}</h1></td>
      <td className='badge'><ParaLink id={paraId} /></td>
      <td className='address'><AddressMini value={accountId} /></td>
      <td className='all number'>{isCrowdloan ? t<string>('Yes') : t<string>('No')}</td>
      <td className='all number together'>
        {firstPeriod.eq(lastPeriod)
          ? formatNumber(firstPeriod)
          : `${formatNumber(firstPeriod)} - ${formatNumber(lastPeriod)}`
        }
      </td>
      <td className='number'><FormatBalance value={value} /></td>
    </tr>
  );
}

export default React.memo(WinRanges);

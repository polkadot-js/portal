// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { BlockNumber } from '@polkadot/types/interfaces';
import type { WinnerData } from './types';

import React from 'react';

import { AddressMini, ParaLink } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  blockNumber: BN;
  className?: string;
  isFirst: boolean;
  isLatest: boolean;
  startBlock: BlockNumber;
  value: WinnerData;
}

function WinRanges ({ blockNumber, className = '', isFirst, isLatest, startBlock, value: { accountId, paraId, range, value } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <tr className={className}>
      <td>
        {isFirst && (
          <h1>{isLatest
            ? t<string>('latest')
            : <>#{formatNumber(blockNumber.isZero() ? startBlock : blockNumber)}</>
          }</h1>
        )}
      </td>
      <td className='number'><h1>{formatNumber(paraId)}</h1></td>
      <td><ParaLink id={paraId} /></td>
      <td className='address'><AddressMini value={accountId} /></td>
      <td>{range}</td>
      <td className='number'><FormatBalance value={value} /></td>
    </tr>
  );
}

export default React.memo(WinRanges);

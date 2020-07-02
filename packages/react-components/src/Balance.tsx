// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React from 'react';
import { Balance, FormatBalance } from '@polkadot/react-query';
import { BN_ZERO } from '@polkadot/util';

import { classes } from './util';

export interface RenderProps {
  className?: string;
  label?: React.ReactNode;
  value?: BN | BN[];
}

export interface Props {
  balance?: BN | BN[];
  className?: string;
  label?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
  withLabel?: boolean;
}

export function renderProvided ({ className = '', label, value }: RenderProps): React.ReactNode {
  let others: undefined | React.ReactNode;

  if (Array.isArray(value)) {
    const totals = value.filter((_, index): boolean => index !== 0);
    const total = totals.reduce((total, value): BN => total.add(value), BN_ZERO).gtn(0);

    if (total) {
      others = totals.map((balance, index): React.ReactNode =>
        <FormatBalance
          key={index}
          value={balance}
        />
      );
    }
  }

  return (
    <FormatBalance
      className={classes('ui--Balance', className)}
      label={label}
      value={Array.isArray(value) ? value[0] : value}
    >
      {others && (
        <span>&nbsp;(+{others})</span>
      )}
    </FormatBalance>
  );
}

function BalanceDisplay (props: Props): React.ReactElement<Props> | null {
  // horribly broken
  // eslint-disable-next-line react/prop-types
  const { balance, className = '', label, params } = props;

  if (!params) {
    return null;
  }

  return balance
    ? <>{renderProvided({ className, label, value: balance })}</>
    : (
      <Balance
        className={classes('ui--Balance', className)}
        label={label}
        params={params}
      />
    );
}

export default React.memo(BalanceDisplay);

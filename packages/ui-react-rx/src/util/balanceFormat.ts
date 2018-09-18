// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import BN from 'bn.js';
import bnToBn from '@polkadot/util/bn/toBn';

import decimalFormat from './decimalFormat';

function toDecimal (value: string, split: number, indicator: string): string {
  let postfix = split === 0
    ? ''
    : value.slice(-1 * split).slice(0, 2);
  let prefix = value.slice(0, value.length - split);

  return `${decimalFormat(prefix)}${postfix ? '.' : ''}${postfix}${indicator}`;
}

export default function numberFormat (_value?: BN | number | null): string {
  if (_value === undefined || _value === null) {
    return '0';
  }

  const value = bnToBn(_value).toString();

  if (value.length <= 6) {
    return toDecimal(value, 0, 'μ');
  } else if (value.length <= 9) {
    return toDecimal(value, 6, '');
  } else if (value.length <= 12) {
    return toDecimal(value, 9, 'k');
  }

  return toDecimal(value, 12, 'm');
}

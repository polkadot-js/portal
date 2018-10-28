// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { RxBalance } from '@polkadot/api-observable/types';

import balanceFormat from './util/balanceFormat';
import { withObservableDiv } from './with/index';

const Component: React.ComponentType<any> = withObservableDiv('votingBalance')(
  (balance?: RxBalance): string => {
    if (!balance) {
      return '0';
    }

    return balanceFormat(balance.freeBalance);
  },
  { className: 'rx--Balance' }
);

export default Component;

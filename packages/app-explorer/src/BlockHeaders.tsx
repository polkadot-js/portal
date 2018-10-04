// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Header } from '@polkadot/types';

import React from 'react';

import withObservableDiv from '@polkadot/ui-react-rx/with/observableDiv';

import BlockHeader from './BlockHeader';

let blockHeaders: Array<Header> = [];

const apiOptions = {
  transform: (header: Header): Array<Header> => {
    if (!header) {
      return blockHeaders;
    }

    blockHeaders = blockHeaders
      .filter((old, index) =>
        index < 9 && old.blockNumber.lt(header.blockNumber)
      )
      .reduce((next, header) => {
        next.push(header);

        return next;
      }, [header])
      .sort((a, b) =>
        b.blockNumber.cmp(a.blockNumber)
      );

    return blockHeaders;
  }
};

export default withObservableDiv('newHead', apiOptions)(
  (value: Array<Header> = []) =>
    value.map((value) => (
      <BlockHeader
        key={value.blockNumber.toString()}
        value={value}
        withLink
      />
    )),
  { className: 'explorer--BlockHeaders' }
);

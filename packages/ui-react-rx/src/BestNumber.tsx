// Copyright 2017-2019 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import { BlockNumber } from '@polkadot/types';

import { numberFormat } from './util/index';
import { withApiCall } from './with/index';

type Props = BareProps & {
  children?: React.ReactNode,
  label?: string,
  derive_chain_bestNumber?: BlockNumber
};

class BestNumber extends React.PureComponent<Props> {
  render () {
    const { children, className, label = '', style, derive_chain_bestNumber } = this.props;

    return (
      <div
        className={className}
        style={style}
      >
        {label}{
          derive_chain_bestNumber
            ? numberFormat(derive_chain_bestNumber)
            : '-'
          }{children}
      </div>
    );
  }
}

export default withApiCall('derive.chain.bestNumber')(BestNumber);

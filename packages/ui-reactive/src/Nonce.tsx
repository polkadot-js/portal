// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-api/types';

import React from 'react';
import { Index } from '@polkadot/types';
import { withCall } from '@polkadot/ui-api/index';

import { numberFormat } from './util/index';

type Props = BareProps & {
  children?: React.ReactNode,
  label?: string,
  query_system_accountNonce: Index
};

class Nonce extends React.PureComponent<Props> {
  render () {
    const { children, className, label = '', style, query_system_accountNonce } = this.props;

    return (
      <div
        className={className}
        style={style}
      >
        {label}{
          query_system_accountNonce
            ? numberFormat(query_system_accountNonce)
            : '0'
          }{children}
      </div>
    );
  }
}

export default withCall('query.system.accountNonce')(Nonce);

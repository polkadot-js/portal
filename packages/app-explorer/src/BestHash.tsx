/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Header } from '@polkadot/types/interfaces';
import { BareProps, CallProps } from 'packages/react-api-promise/types';

import React from 'react';
import { withCalls } from 'packages/react-api-promise';

type Props = BareProps & CallProps & {
  label?: string;
  chain_subscribeNewHead?: Header;
};

class BestHash extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { className, label = '', style, chain_subscribeNewHead } = this.props;

    return (
      <div
        className={className}
        style={style}
      >
        {label}{
          chain_subscribeNewHead
            ? chain_subscribeNewHead.hash.toHex()
            : undefined
        }
      </div>
    );
  }
}

export default withCalls<Props>('rpc.chain.subscribeNewHead')(BestHash);

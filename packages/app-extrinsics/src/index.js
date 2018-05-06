// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from '@polkadot/ui-react-app/types';
import type { QueueTx } from './types';

import './index.css';

import React from 'react';

import Signer from './Signer';
import Submission from './Submission';
import Status from './Status';

type Props = BareProps & {};

export default class App extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    this.state = {
      queue: []
    };
  }

  setStatus = (id: number, status: string): void => {
    const { queue } = this.state;

    this.setState({
      queue: queue
        .map((item) =>
          item.id === id
            ? { ...item, status }
            : item
        )
        .filter(({ status }) => status !== 'completed')
    });

    if (!['cancelled', 'error', 'sent'].includes(status)) {
      return;
    }

    setTimeout(() => this.setStatus(id, 'completed'), 5000);
  }

  onQueue = (value: QueueTx): void => {
    const { queue } = this.state;

    this.setState({
      queue: queue.concat([{
        ...value,
        status: 'queued'
      }])
    });
  };

  render (): React$Node {
    const { className, style } = this.props;
    const { queue } = this.state;

    return (
      <div
        className={['extrinsics--App', className].join(' ')}
        style={style}
      >
        <Submission onQueue={this.onQueue} />
        <Signer
          onSetStatus={this.setStatus}
          value={queue}
        />
        <Status value={queue} />
      </div>
    );
  }
}

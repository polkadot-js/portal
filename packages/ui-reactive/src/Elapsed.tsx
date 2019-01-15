// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-api/types';

import React from 'react';
import { Moment } from '@polkadot/types';

type Props <T = Moment | Date> = BareProps & {
  value?: T
};

type State = {
  now?: Date
};

const TICK_TIMEOUT = 100;
const tickers = new Map<Elapsed, (now: Date) => void>();

function tick () {
  const now = new Date();

  for (const ticker of tickers.values()) {
    ticker(now);
  }

  setTimeout(tick, TICK_TIMEOUT);
}

tick();

export default class Elapsed extends React.PureComponent<Props, State> {
  public state: State = {};

  public componentWillMount () {
    tickers.set(this, (now: Date): void => {
      this.setState({
        now
      });
    });
  }

  public componentWillUnmount () {
    tickers.delete(this);
  }

  public render () {
    const { className, style, value } = this.props;
    const { now } = this.state;

    return (
      <div
        className={['ui--Elapsed', className].join(' ')}
        style={style}
      >
        {this.getDisplayValue(now, value)}
      </div>
    );
  }

  private getDisplayValue (now?: Date, value?: Moment | Date): string {
    const tsNow = (now && now.getTime()) || 0;
    const tsValue = (value && value.getTime()) || 0;
    let display = '-';

    if (tsNow && tsValue) {
      const elapsed = Math.max(tsNow - tsValue, 0) / 1000;

      if (elapsed < 15) {
        display = `${elapsed.toFixed(1)}s`;
      } else if (elapsed < 60) {
        display = `${elapsed | 0}s`;
      } else if (elapsed < 3600) {
        display = `${elapsed / 60 | 0}m`;
      } else {
        display = `${elapsed / 3600 | 0}h`;
      }
    }

    return display;
  }
}

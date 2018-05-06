// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-react-app/types';
import type { StorageQuery } from './types';

import './index.css';

import React from 'react';

import Queries from './Queries';
import Selection from './Selection';
import translate from './translate';

type Props = I18nProps & {};

type State = {
  queue: Array<StorageQuery>
}

class App extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    this.state = {
      queue: []
    };
  }

  onAdd = (query: StorageQuery): void => {
    const { queue } = this.state;

    this.setState({
      queue: queue.reduce((next, item) => {
        next.push(item);

        return next;
      }, [query])
    });
  }

  onRemove = (id: number): void => {
    const { queue } = this.state;

    this.setState({
      queue: queue.filter((item) => item.id !== id)
    });
  }

  render (): React$Node {
    const { className, style } = this.props;
    const { queue } = this.state;

    return (
      <div
        className={['storage--App', className].join(' ')}
        style={style}
      >
        <Selection onAdd={this.onAdd} />
        <Queries
          onRemove={this.onRemove}
          value={queue}
        />
      </div>
    );
  }
}

export default translate(App);

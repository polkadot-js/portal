// Copyright 2017-2019 @polkadot/ui-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DefaultProps, Options, Subtract } from './types';
import { ApiProps, BareProps, CallProps } from '../types';

import React from 'react';

import withCall from './call';

type Props<T> = ApiProps & BareProps & CallProps & {
  children?: React.ReactNode,
  label?: string
};

export default function withCallDiv<T> (endpoint: string, options: Options = {}) {
  return (render: (value?: T) => React.ReactNode, defaultProps: DefaultProps = {}): React.ComponentClass<Subtract<Props<T>, ApiProps>> => {
    class Inner extends React.PureComponent<Props<T>> {
      render () {
        const { children, className = defaultProps.className, label = '', callUpdated, style, value } = this.props;

        return (
          <div
            {...defaultProps}
            className={[className, callUpdated ? 'rx--updated' : undefined].join(' ')}
            style={style}
          >
            {label}{render(value)}{children}
          </div>
        );
      }
    }

    return withCall(endpoint, { ...options, propName: 'value' })(Inner);
  };
}

// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from '../../types';
import type { Size } from '../types';

const React = require('react');
const Label = require('semantic-ui-react/dist/es/elements/Label').default;

type Props = BareProps & {
  children: React$Node,
  label?: string,
  size?: Size
};

module.exports = function Base ({ children, className, label, size = 'medium', style }: Props): React$Node {
  return (
    <div
      className={['ui--form', className].join(' ')}
      style={style}
    >
      <div className={size}>
        <Label>{label}</Label>
        {children}
      </div>
    </div>
  );
};

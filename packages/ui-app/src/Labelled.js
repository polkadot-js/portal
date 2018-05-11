// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from './types';

import React from 'react';
import Label from 'semantic-ui-react/dist/es/elements/Label';

type Props = BareProps & {
  label?: string,
  children: React$Node
};

export default function Labelled ({ className, children, label = ' ', style }: Props): React$Node {
  return (
    <div
      className={className}
      style={style}
    >
      <Label>{label}</Label>
      {children}
    </div>
  );
}

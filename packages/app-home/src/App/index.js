// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from '@polkadot/portal/types';

import './App.css';

import React from 'react';

type Props = BaseProps & {};

export default function App ({ className, style }: Props) {
  return (
    <div
      className={['home--App', className].join(' ')}
      style={style}
    >
      This is just a basic, bare-bones interface to a Polkadot node. It allows you to submit extrinsics, adjust some settings (well, maybe not yet) and get an overview of the network and blocks on the network.
    </div>
  );
}

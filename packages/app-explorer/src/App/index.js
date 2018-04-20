// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from '@polkadot/portal/types';

import './App.css';

import React from 'react';
import BestNumber from '@polkadot/rx-react/BestNumber';

import BestHash from '../BestHash';
import BlockHeaders from '../BlockHeaders';

type Props = BaseProps & {};

export default function App ({ className, style }: Props) {
  return (
    <div
      className={['home--App', className].join(' ')}
      style={style}
    >
      <BestNumber
        className='home--App-BestNumber'
        label='best #'
      />
      <BestHash className='home--App-BestHash' />
      <BlockHeaders />
    </div>
  );
}

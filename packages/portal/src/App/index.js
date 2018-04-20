// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from '../types';

import './App.css';

import React from 'react';
import { translate } from 'react-i18next';
import { Redirect, Route } from 'react-router-dom';

import Content from '../Content';
import SideBar from '../SideBar';

type Props = BaseProps & {};

export default translate(['portal'])(
  function App ({ className, style }: Props) {
    return (
      <div
        className={['portal--App', className].join(' ')}
        style={style}
      >
        <Route exact path='/'>
          <Redirect to='/home' />
        </Route>
        <SideBar className='portal--App-column' />
        <Content className='portal--App-column' />
      </div>
    );
  }
);

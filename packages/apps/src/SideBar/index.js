// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-react-app/types';

import './SideBar.css';

import React from 'react';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';

import routing from '../routing';
import translate from '../translate';
import Item from './Item';

type Props = I18nProps & {};

function SideBar ({ className, style, t }: Props): React$Node {
  return (
    <div
      className={['apps--SideBar', className].join(' ')}
      style={style}
    >
      <Menu
        secondary
        vertical
      >
        {
          routing.routes.map((route) => (
            <Item
              key={route.name}
              t={t}
              // flowlint-next-line inexact-spread:off
              {...route}
            />
          ))
        }
      </Menu>
    </div>
  );
}

export default translate(SideBar);

// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from '@polkadot/ui-react-app/types';

import React from 'react';
import Label from 'semantic-ui-react/dist/es/elements/Label';
import Balance from '@polkadot/rx-react/Balance';
import withObservableParams from '@polkadot/rx-react/with/observableParams';
import InputAddress from '@polkadot/ui-react-app/src/InputAddress';

import translate from './translate';

type Props = BaseProps & {
  isError?: boolean,
  label: string,
  subject: rxjs$BehaviorSubject<Uint8Array>
};

function Account ({ className, isError, label, subject, style, t }: Props): React$Node {
  const AccountBalance = withObservableParams(subject)(Balance);

  return (
    <div
      className={['extrinsics--Account', 'ui--form', className].join(' ')}
      style={style}
    >
      <div className='large'>
        <Label>{label}</Label>
        <InputAddress
          placeholder='0x...'
          subject={subject}
        />
      </div>
      <div className='small'>
        <Label>
          {t('account.balance', {
            defaultValue: 'with an available balance of'
          })}
        </Label>
        <AccountBalance
          className='ui disabled dropdown selection'
          classNameUpdated='hasUpdated'
        />
      </div>
    </div>
  );
}

export default translate(Account);

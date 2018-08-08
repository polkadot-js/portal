// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { QueueProps } from '@polkadot/ui-signer/types';

import React from 'react';
import classes from '@polkadot/ui-app/util/classes';
import keyring from '@polkadot/ui-keyring/index';
import { QueueConsumer } from '@polkadot/ui-signer/Context';

import translate from '../translate';
import AddressValidator from '@polkadot/ui-app/Address/AddressValidator'

type Props = I18nProps & {
  validators: Array<string>
  intentions: Array<string>,
};

class ValidatorsList extends React.PureComponent<Props> {
  render () {
    const { className, style, validators } = this.props;

    return (
      <QueueConsumer>
        {({ queueExtrinsic }: QueueProps) => (
          <div
            className={classes('validator--ValidatorsList', className)}
            style={style}
          >
            {validators.map((account) => {
              // TODO: filter out
              // - validators
              // - 0 balance accounts
              return (
                <div key={account}>
                    <AddressValidator
                      className={classes('row', className)}
                      name={name || 'validator'} // TODO: check in our list of address is we named it
                      value={account}
                      withBalance={true}
                      withNonce={false}
                      identIconSize={48}
                      isShort={false}
                    />
                </div>
              );
            })}
          </div>
        )}
      </QueueConsumer>
    );
  }
}

export default translate(ValidatorsList);

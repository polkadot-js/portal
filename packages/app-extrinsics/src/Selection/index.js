// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type BN from 'bn.js';
import type { I18nProps } from '@polkadot/ui-react-app/types';
import type { EncodedMessage, QueueTx } from '../types';

import './Selection.css';

import React from 'react';
import Button from 'semantic-ui-react/dist/es/elements/Button';
import map from '@polkadot/extrinsics-substrate';

import Account from '../Account';
import Extrinsic from '../Extrinsic';
import translate from '../translate';
import Nonce from './Nonce';

type Props = I18nProps & {
  onQueue?: (value: QueueTx) => void
};

type State = {
  isValid: boolean,
  message: EncodedMessage,
  nonce: BN,
  publicKey: Uint8Array
};

const defaultExtrinsic = map.staking.methods.public.transfer;

let id = 0;

class Selection extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      extrinsic: defaultExtrinsic,
      isValid: false
    };
  }

  onChange = ({ message, nonce, publicKey }: State): void => {
    const isValid = !!(publicKey && publicKey.length && message && message.isValid);

    this.setState({
      message,
      nonce,
      publicKey,
      isValid
    });
  };

  onQueue = (): void => {
    const { onQueue } = this.props;
    const { message, nonce, publicKey } = this.state;

    onQueue && onQueue({
      data: message.data,
      extrinsic: message.extrinsic,
      nonce,
      publicKey,
      id: ++id
    });
  }

  onChangeMessage = (message: EncodedParams): void => {
    this.onChange({
      ...this.state,
      message
    });
  }

  onChangeNonce = (nonce: BN): void => {
    this.onChange({
      ...this.state,
      nonce
    });
  }

  onChangeSender = (publicKey: Uint8Array): void => {
    this.onChange({
      ...this.state,
      publicKey
    });
  }

  render (): React$Node {
    const { className, style, t } = this.props;
    const { publicKey, isValid } = this.state;

    return (
      <div
        className={['extrinsics--Selection', className].join(' ')}
        style={style}
      >
        <Account
          defaultValue={publicKey}
          label={t('display.sender', {
            defaultValue: 'using the selected account'
          })}
          onChange={this.onChangeSender}
          value={publicKey}
        />
        <Extrinsic
          defaultValue={defaultExtrinsic}
          labelMethod={t('display.method', {
            defaultValue: 'submit the following extrinsic'
          })}
          onChange={this.onChangeMessage}
        />
        <Nonce
          label={t('display.nonce', {
            defaultValue: 'with an index'
          })}
          onChange={this.onChangeNonce}
          value={publicKey}
        />
        <div className='extrinsics--Selection-ButtonRow'>
          <Button
            disabled={!isValid}
            onClick={this.onQueue}
            primary
          >
            {t('submit.label', {
              defaultValue: 'Submit Extrinsic'
            })}
          </Button>
        </div>
      </div>
    );
  }
}

export default translate(Selection);

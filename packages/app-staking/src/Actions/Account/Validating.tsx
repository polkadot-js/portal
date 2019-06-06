// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { ValidatorPrefs } from '@polkadot/types';
import { Button, InputAddress, InputBalance, InputNumber, Modal, TxButton, TxComponent } from '@polkadot/ui-app';

import ValidateUnstakeThreshold from './ValidateUnstakeThreshold';
import translate from '../../translate';

type Props = I18nProps & {
  accountId: string,
  onClose: () => void,
  stashId: string,
  validatorPrefs: ValidatorPrefs
};

type State = {
  unstakeThreshold?: BN,
  unstakeThresholdError: string | null,
  validatorPayment?: BN
};

class Validating extends TxComponent<Props, State> {
  state: State = {
    unstakeThreshold: new BN(3),
    unstakeThresholdError: null,
    validatorPayment: new BN(0)
  };

  // inject the preferences returned via RPC once into the state (from this
  // point forward it will be entirely managed by the actual inputs)
  static getDerivedStateFromProps (props: Props, state: State): State | null {
    if (state.unstakeThreshold) {
      return null;
    }

    const { unstakeThreshold, validatorPayment } = props.validatorPrefs;

    return {
      unstakeThreshold: unstakeThreshold.toBn(),
      unstakeThresholdError: null,
      validatorPayment: validatorPayment.toBn()
    };
  }

  render () {
    return (
      <Modal
        className='staking--Staking'
        dimmer='inverted'
        open
        size='small'
      >
        {this.renderContent()}
        {this.renderButtons()}
      </Modal>
    );
  }

  private renderButtons () {
    const { accountId, onClose, t } = this.props;
    const { unstakeThreshold, unstakeThresholdError, validatorPayment } = this.state;

    return (
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            label={t('Cancel')}
            onClick={onClose}
          />
          <Button.Or />
          <TxButton
            accountId={accountId}
            isDisabled={!!unstakeThresholdError}
            isPrimary
            label={t('Validate')}
            onClick={onClose}
            params={[{
              unstakeThreshold,
              validatorPayment
            }]}
            tx='staking.validate'
            ref={this.button}
          />
        </Button.Group>
      </Modal.Actions>
    );
  }

  private renderContent () {
    const { accountId, stashId, t, validatorPrefs } = this.props;
    const { unstakeThreshold, unstakeThresholdError, validatorPayment } = this.state;

    return (
      <>
        <Modal.Header>
          {t('Validating')}
        </Modal.Header>
        <Modal.Content className='ui--signer-Signer-Content'>
          <InputAddress
            className='medium'
            defaultValue={stashId.toString()}
            isDisabled
            label={t('stash account')}
          />
          <InputAddress
            className='medium'
            defaultValue={accountId}
            isDisabled
            label={t('controller account')}
          />
          <InputNumber
            autoFocus
            bitLength={32}
            className='medium'
            defaultValue={validatorPrefs && validatorPrefs.unstakeThreshold && validatorPrefs.unstakeThreshold.toBn()}
            help={t('The number of time this validator can get slashed before being automatically unstaked (maximum of 10 allowed)')}
            isError={!!unstakeThresholdError}
            label={t('automatic unstake threshold')}
            onChange={this.onChangeThreshold}
            onEnter={this.sendTx}
            value={
              unstakeThreshold
                ? unstakeThreshold.toString()
                : '3'
            }
          />
          <ValidateUnstakeThreshold
            onError={this.onUnstakeThresholdError}
            unstakeThreshold={unstakeThreshold}
          />
          <InputBalance
            className='medium'
            defaultValue={validatorPrefs && validatorPrefs.validatorPayment && validatorPrefs.validatorPayment.toBn()}
            help={t('Amount taken up-front from the reward by the validator before spliting the remainder between themselves and the nominators')}
            label={t('reward commission')}
            onChange={this.onChangePayment}
            onEnter={this.sendTx}
            value={
              validatorPayment
                ? validatorPayment.toString()
                : '0'
            }
          />
        </Modal.Content>
      </>
    );
  }

  private onChangePayment = (validatorPayment?: BN) => {
    if (validatorPayment) {
      this.setState({ validatorPayment });
    }
  }

  private onChangeThreshold = (unstakeThreshold?: BN) => {
    if (unstakeThreshold) {
      this.setState({ unstakeThreshold });
    }
  }

  private onUnstakeThresholdError = (unstakeThresholdError: string | null) => {
    this.setState({ unstakeThresholdError });
  }
}

export default translate(Validating);

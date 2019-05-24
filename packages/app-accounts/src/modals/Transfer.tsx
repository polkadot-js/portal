// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-api/types';
import { DerivedFees, DerivedBalances } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { Index } from '@polkadot/types';
import { Button, InputAddress, InputBalance, Modal, TxButton, media } from '@polkadot/ui-app';
import { Available } from '@polkadot/ui-reactive';
import Checks, { calcSignatureLength } from '@polkadot/ui-signer/Checks';
import { withApi, withCalls, withMulti } from '@polkadot/ui-api';
import { ZERO_FEES } from '@polkadot/ui-signer/Checks/constants';

import translate from '../translate';

type Props = ApiProps & I18nProps & {
  address: string,
  balances_fees?: DerivedFees,
  balances_votingBalance?: DerivedBalances,
  onClose: () => void,
  system_accountNonce?: BN
};

type State = {
  amount: BN,
  extrinsic: SubmittableExtrinsic | null,
  hasAvailable: boolean,
  maxBalance?: BN,
  recipientId: string | null,
  senderId: string
};

const ZERO = new BN(0);

const Wrapper = styled.div`
  article.padded {
    box-shadow: none;
  }

  .balance {
    margin-bottom: 0.5rem;
    text-align: right;
    padding-right: 1rem;

    .label-available {
      opacity: 0.7;
      margin-right: 0.75rem;
    }
  }

  ${media.DESKTOP`
    article.padded {
      margin: .75rem 0 0.75rem 15rem;
      padding: 0.25rem 1rem;
    }
  `}

  label.with-help {
    flex-basis: 10rem;
  }
`;

class Transfer extends React.PureComponent<Props> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      amount: ZERO,
      extrinsic: null,
      hasAvailable: true,
      maxBalance: ZERO,
      recipientId: null,
      senderId: props.address
    };
  }

  componentDidUpdate (prevProps: Props, prevState: State) {
    const { balances_fees } = this.props;
    const { extrinsic, recipientId, senderId } = this.state;

    const hasLengthChanged = ((extrinsic && extrinsic.encodedLength) || 0) !== ((prevState.extrinsic && prevState.extrinsic.encodedLength) || 0);

    if ((recipientId && prevState.recipientId !== recipientId) ||
      (balances_fees !== prevProps.balances_fees) || (prevState.senderId !== senderId) ||
      hasLengthChanged
    ) {
      this.setMaxBalance().catch(console.error);
    }
  }

  render () {
    const { t } = this.props;

    return (
      <Modal
        className='app--accounts-Modal'
        dimmer='inverted'
        open
      >
        <Modal.Header>{t('Send funds')}</Modal.Header>
        {this.renderContent()}
        {this.renderButtons()}
      </Modal>
    );
  }

  private nextState (newState: Partial<State>): void {
    this.setState((prevState: State): State => {
      const { api } = this.props;
      const { amount = prevState.amount, recipientId = prevState.recipientId, hasAvailable = prevState.hasAvailable, maxBalance = prevState.maxBalance, senderId = prevState.senderId } = newState;
      const extrinsic = recipientId
        ? api.tx.balances.transfer(recipientId, amount)
        : null;

      return {
        amount,
        extrinsic,
        hasAvailable,
        maxBalance,
        recipientId,
        senderId
      };
    });
  }

  private renderButtons () {
    const { address, onClose, t } = this.props;
    const { extrinsic, hasAvailable } = this.state;

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
            accountId={address}
            extrinsic={extrinsic}
            isDisabled={!hasAvailable}
            isPrimary
            label={t('Make Transfer')}
            onStart={onClose}
            withSpinner={false}
          />
        </Button.Group>
      </Modal.Actions>
    );
  }

  private renderContent () {
    const { address, t } = this.props;
    const { extrinsic, hasAvailable, maxBalance, recipientId, senderId } = this.state;
    const available = t('available balance');

    return (
      <Modal.Content className='app--account-Backup-content'>
        <Wrapper>
          <InputAddress
            defaultValue={address}
            help={t('The account you will send funds from.')}
            isDisabled
            label={t('send from account')}
            type='account'
          />
          <div className='balance'><Available label={available} params={senderId} /></div>
          <InputAddress
            help={t('Select a contact or paste the address you want to send funds to.')}
            label={t('send to address')}
            onChange={this.onChangeTo}
            type='all'
          />
          <div className='balance'><Available label={available} params={recipientId} /></div>
          <InputBalance
            help={t('Type the amount you want to transfer. Note that you can select the unit on the right e.g sending 1 mili is equivalent to sending 0.001.')}
            isError={!hasAvailable}
            label={t('amount')}
            maxValue={maxBalance}
            onChange={this.onChangeAmount}
            withMax
          />
          <Checks
            accountId={address}
            extrinsic={extrinsic}
            isSendable
            onChange={this.onChangeFees}
          />
        </Wrapper>
      </Modal.Content>
    );
  }

  private onChangeAmount = (amount: BN = new BN(0)) => {
    this.nextState({ amount });
  }

  private onChangeTo = (recipientId: string) => {
    this.nextState({ recipientId });
  }

  private onChangeFees = (hasAvailable: boolean) => {
    this.setState({ hasAvailable });
  }

  private setMaxBalance = async () => {
    const { address, api, balances_fees = ZERO_FEES } = this.props;
    const { recipientId } = this.state;

    if (!address || !recipientId) {
      return;
    }

    const { transferFee, transactionBaseFee, transactionByteFee, creationFee } = balances_fees;

    // FIXME The any casts here are irritating, but they are basically caused by the derive
    // not really returning an actual `class implements Codec`
    // (if casting to DerivedBalance it would be `as any as DerivedBalance`)
    const accountNonce = await api.query.system.accountNonce(address) as Index;
    const senderBalance = (await api.derive.balances.all(address) as any).availableBalance;
    const recipientBalance = (await api.derive.balances.all(recipientId) as any).availableBalance;

    let prevMax = new BN(0);
    let maxBalance = new BN(1);
    let extrinsic;

    while (!prevMax.eq(maxBalance)) {
      prevMax = maxBalance;

      extrinsic = address && recipientId
        ? api.tx.balances.transfer(recipientId, prevMax)
        : null;

      const txLength = calcSignatureLength(extrinsic, accountNonce);
      const fees = transactionBaseFee
        .add(transactionByteFee.muln(txLength))
        .add(transferFee)
        .add(recipientBalance.isZero() ? creationFee : ZERO);

      maxBalance = senderBalance.sub(fees);
    }

    this.nextState({
      extrinsic,
      maxBalance
    });
  }
}

export default withMulti(
  Transfer,
  translate,
  withApi,
  withCalls<Props>(
    'derive.balances.fees'
  )
);

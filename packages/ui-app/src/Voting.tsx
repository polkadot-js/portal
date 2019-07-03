// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

import BN from 'bn.js';
import React from 'react';
import { Button, Dropdown } from '@polkadot/ui-app';
import keyring from '@polkadot/ui-keyring';
import { withMulti, withObservable } from '@polkadot/ui-api';

import translate from './translate';
import TxModal, { TxModalProps, TxModalState } from './TxModal';

type Props = I18nProps & TxModalProps & {
  allAccounts?: SubjectInfo,
  hash?: string,
  idNumber: BN | number,
  isCouncil: boolean
};

type State = TxModalState & {
  voteOptions: Array<{ text: React.ReactNode, value: boolean }>,
  voteValue: boolean
};

class Voting extends TxModal<Props, State> {
  state: State;

  headerText = () => {
    const { isCouncil, t } = this.props;

    return t(isCouncil ? 'Vote on council motion' : 'Vote on proposal');
  }

  accountLabel = () => this.props.t('Vote with account');
  accountHelp = () => this.props.t('Select the account you wish to vote with. You can approve "yay" or deny "nay" the proposal.');

  txMethod = () => {
    const { isCouncil } = this.props;

    return isCouncil ? 'councilMotions.vote' : 'democracy.vote';
  }

  txParams = () => {
    const { hash, idNumber, isCouncil } = this.props;
    const { voteValue } = this.state;

    return isCouncil
      ? [hash!, idNumber, voteValue]
      : [idNumber, voteValue];
  }

  constructor (props: Props) {
    super(props);

    const { t } = props;

    this.state = {
      ...this.defaultState,
      voteOptions: [
        { text: t('Yay, I approve'), value: true },
        { text: t('Nay, I do not approve'), value: false }
      ],
      voteValue: true
    };
  }

  renderContent = () => {
    const { t } = this.props;
    const { voteOptions, voteValue } = this.state;

    return (
      <Dropdown
        help={t('Select your vote preferences for this proposal, either to approve or disapprove')}
        label={t('record my vote as')}
        options={voteOptions}
        onChange={this.onChangeVote}
        value={voteValue}
      />
    );
  }

  renderTrigger = () => {
    const { t } = this.props;

    return (
      <div className='ui--Row-buttons'>
        <Button
          isPrimary
          label={t('Vote')}
          onClick={this.showModal}
        />
      </div>
    );
  }

  private onChangeVote = (voteValue: boolean) => {
    this.setState({ voteValue });
  }
}

export default withMulti(
  Voting,
  translate,
  withObservable(keyring.accounts.subject, { propName: 'allAccounts' })
);

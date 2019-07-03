// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

import React from 'react';
import { Option, TreasuryProposal } from '@polkadot/types';
import { ActionItem, Icon, InputAddress, Labelled, Static } from '@polkadot/ui-app';
import { withCalls, withMulti, withObservable } from '@polkadot/ui-api';
import keyring from '@polkadot/ui-keyring';
import { formatBalance } from '@polkadot/util';

import translate from '../translate';
import Approve from './Approve';

type Props = I18nProps & {
  allAccounts?: SubjectInfo,
  isApproved: boolean,
  proposal?: TreasuryProposal | null,
  proposalId: string,
  onPopulate: () => void,
  onRespond: () => void
};

type State = {
  isApproveOpen: boolean
};

class ProposalDisplay extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    const { proposal, onPopulate } = props;
    if (proposal) {
      onPopulate();
    }
  }

  componentWillReceiveProps ({ proposal }: Props) {
    const { onPopulate } = this.props;

    if (proposal && !this.props.proposal) {
      onPopulate();
    }
  }

  state: State = {
    isApproveOpen: false
  };

  render () {
    const { proposal, proposalId } = this.props;

    if (!proposal) {
      return null;
    }

    return (
      <ActionItem
        accessory={this.renderAccessory()}
        idNumber={proposalId}
      >
        {this.renderInfo()}
      </ActionItem>
    );
  }

  private renderAccessory () {
    const { allAccounts, isApproved, onRespond, proposalId, t } = this.props;

    if (isApproved) {
      return (
        <h3 className='treasury--Approve-approved'>
          <Icon name='check' />
          {'  '}
          {t('Approved')}
        </h3>
      );
    }

    const hasAccounts = allAccounts && Object.keys(allAccounts).length !== 0;
    if (!hasAccounts) {
      return null;
    }

    return (
      <Approve
        proposalInfo={this.renderInfo()}
        proposalId={proposalId}
        onSuccess={onRespond}
      />
    );
  }

  private renderInfo () {
    const { isApproved, proposal, t } = this.props;

    if (!proposal) {
      return null;
    }

    const { bond, beneficiary, proposer, value } = proposal;

    return (
      <div className={['treasury--Proposal-info', !isApproved && 'with-children'].join(' ')}>
        <Labelled label={t('proposed by')}>
          <InputAddress
            isDisabled
            value={proposer}
            withLabel={false}
          />
        </Labelled>
        <Labelled label={t('beneficiary')}>
          <InputAddress
            isDisabled
            value={beneficiary}
            withLabel={false}
          />
        </Labelled>
        <Static label={t('value')}>
          {formatBalance(value)}
        </Static>
        <Static label={t('bond')}>
          {formatBalance(bond)}
        </Static>
      </div>
    );
  }
}

export default withMulti(
  ProposalDisplay,
  translate,
  withCalls<Props>(
    ['query.treasury.proposals', {
      paramName: 'proposalId',
      propName: 'proposal',
      transform: (value: Option<TreasuryProposal>) =>
        value.unwrapOr(null)
    }]
  ),
  withObservable(keyring.accounts.subject, { propName: 'allAccounts' })
);

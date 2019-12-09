// Copyright 2017-2019 @polkadot/app-treasury authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedCouncilProposal } from '@polkadot/api-derive/types';
import { ProposalIndex, Hash } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';

import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Input, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';
import { isBoolean } from '@polkadot/util';

import translate from '../translate';

interface Props extends I18nProps {
  proposals: DerivedCouncilProposal[];
}

interface Option {
  text: React.ReactNode;
  value: number;
}

function Voting ({ proposals, t }: Props): React.ReactElement<Props> | null {
  const { hasAccounts } = useAccounts();
  const [councilOpts, setCouncilOpts] = useState<Option[]>([]);
  const [councilOptId, setCouncilOptId] = useState<number>(0);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [{ councilId, councilHash }, setCouncilInfo] = useState<{ councilId: ProposalIndex | null; councilHash: Hash | null }>({ councilId: null, councilHash: null });
  const [isVotingOpen, setIsVotingOpen] = useState(false);
  const [voteValue, setVoteValue] = useState(true);

  useEffect((): void => {
    const available = proposals
      .map(({ proposal: { methodName, sectionName }, votes }): Option => ({
        text: `Council #${votes?.index.toNumber()}: ${sectionName}.${methodName} `,
        value: votes ? votes?.index.toNumber() : -1
      }))
      .filter(({ value }): boolean => value !== -1);

    setCouncilOptId(available ? available[0].value : 0);
    setCouncilOpts(available);
  }, [proposals]);

  if (!hasAccounts || !councilOpts.length) {
    return null;
  }

  const _toggleVoting = (): void => setIsVotingOpen(!isVotingOpen);
  const _onChangeVote = (vote?: boolean): void => setVoteValue(isBoolean(vote) ? vote : true);
  const _onChangeProposal = (optionId: number): void => {
    const councilProp = proposals.find(({ votes }): boolean => !!(votes?.index.eq(optionId)));

    if (councilProp && councilProp.votes) {
      setCouncilInfo({ councilId: councilProp.votes.index, councilHash: councilProp.hash });
      setCouncilOptId(councilOptId);
    } else {
      setCouncilInfo({ councilId: null, councilHash: null });
    }
  };

  return (
    <>
      {isVotingOpen && (
        <Modal
          dimmer='inverted'
          open
          size='small'
        >
          <Modal.Header>{t('Vote on proposal')}</Modal.Header>
          <Modal.Content>
            <InputAddress
              help={t('Select the account you wish to vote with. You can approve "aye" or deny "nay" the proposal.')}
              label={t('vote with account')}
              onChange={setAccountId}
              type='account'
              withLabel
            />
            <Dropdown
              help={t('The council proposal to make the vote on')}
              label={t('council proposal')}
              onChange={_onChangeProposal}
              options={councilOpts}
              value={councilOptId}
            />
            <Input
              help={t('The hash for the proposal this vote applies to')}
              isDisabled
              label={t('proposal hash')}
              value={councilHash}
            />
            <Dropdown
              help={t('Select your vote preferences for this proposal, either to approve or disapprove')}
              label={t('record my vote as')}
              options={[
                { text: t('Aye, I approve'), value: true },
                { text: t('Nay, I do not approve'), value: false }
              ]}
              onChange={_onChangeVote}
              value={voteValue}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button.Group>
              <Button
                icon='cancel'
                isNegative
                label={t('Cancel')}
                onClick={_toggleVoting}
              />
              <Button.Or />
              <TxButton
                accountId={accountId}
                icon='check'
                isDisabled={!accountId || !councilHash}
                isPrimary
                label={t('Vote')}
                onClick={_toggleVoting}
                params={[councilHash, councilId, voteValue]}
                tx='council.vote'
              />
            </Button.Group>
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='check'
        isPrimary
        label={t('Vote')}
        onClick={_toggleVoting}
      />
    </>
  );
}

export default translate(Voting);

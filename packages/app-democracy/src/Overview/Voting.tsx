// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { PropIndex, Proposal } from '@polkadot/types/interfaces';

import React, { useState } from 'react';
import { Button, Modal, ProposedAction, VoteAccount, VoteActions, VoteToggle } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';
import { isBoolean } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  proposal?: Proposal;
  referendumId: PropIndex;
}

export default function Voting ({ proposal, referendumId }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isVotingOpen, setIsVotingOpen] = useState(false);
  const [voteValue, setVoteValue] = useState(true);

  if (!hasAccounts) {
    return null;
  }

  const _toggleVoting = (): void => setIsVotingOpen(!isVotingOpen);
  const _onChangeVote = (vote?: boolean): void => setVoteValue(isBoolean(vote) ? vote : true);

  return (
    <>
      {isVotingOpen && (
        <Modal
          header={t('Vote on proposal')}
          open
          size='small'
        >
          <Modal.Content>
            <ProposedAction
              idNumber={referendumId}
              isCollapsible
              proposal={proposal}
            />
            <VoteAccount onChange={setAccountId} />
            <VoteToggle
              onChange={_onChangeVote}
              value={voteValue}
            />
          </Modal.Content>
          <VoteActions
            accountId={accountId}
            onClick={_toggleVoting}
            params={[referendumId, voteValue]}
            tx='democracy.vote'
          />
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

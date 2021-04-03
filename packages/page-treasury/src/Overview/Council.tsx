// Copyright 2017-2021 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { ProposalIndex } from '@polkadot/types/interfaces';

import React, { useEffect, useRef, useState } from 'react';

import { Button, Dropdown, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useThresholds, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  id: ProposalIndex;
  isDisabled: boolean;
  members: string[];
}

interface ProposalState {
  proposal?: SubmittableExtrinsic<'promise'> | null;
  proposalLength: number;
}

function Council ({ id, isDisabled, members }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { treasuryProposalThreshold, treasuryRejectionThreshold } = useThresholds();

  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [councilType, setCouncilType] = useState('accept');
  const [{ proposal, proposalLength }, setProposal] = useState<ProposalState>({ proposalLength: 0 });
  const [threshold, setThreshold] = useState<number>(0);

  const councilTypeOptRef = useRef([
    { text: t<string>('Acceptance proposal to council'), value: 'accept' },
    { text: t<string>('Rejection proposal to council'), value: 'reject' }
  ]);

  useEffect((): void => {
    const proposal = councilType === 'reject'
      ? api.tx.treasury.rejectProposal(id)
      : api.tx.treasury.approveProposal(id);

    const threshold = councilType === 'reject'
      ? treasuryRejectionThreshold
      : treasuryProposalThreshold;

    setProposal({ proposal, proposalLength: proposal.length });
    setThreshold(threshold);
  }, [api, councilType, id, treasuryProposalThreshold, treasuryRejectionThreshold]);

  return (
    <>
      {isOpen && (
        <Modal
          header={t<string>('Send to council')}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t<string>('The council member that is proposing this, submission equates to an "aye" vote.')}>
              <InputAddress
                filter={members}
                help={t<string>('Select the council account you wish to use to make the proposal.')}
                label={t<string>('submit with council account')}
                onChange={setAccountId}
                type='account'
                withLabel
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('Proposal can either be to approve or reject this spend. Once approved, the change is applied by either removing the proposal or scheduling payout.')}>
              <Dropdown
                help={t<string>('The type of council proposal to submit.')}
                label={t<string>('council proposal type')}
                onChange={setCouncilType}
                options={councilTypeOptRef.current}
                value={councilType}
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleOpen}>
            <TxButton
              accountId={accountId}
              icon='check'
              isDisabled={!accountId || !threshold}
              label={t<string>('Send to council')}
              onStart={toggleOpen}
              params={
                api.tx.council.propose.meta.args.length === 3
                  ? [threshold, proposal, proposalLength]
                  : [threshold, proposal]
              }
              tx={api.tx.council.propose}
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='step-forward'
        isDisabled={isDisabled}
        label={t<string>('To council')}
        onClick={toggleOpen}
      />
    </>
  );
}

export default React.memo(Council);

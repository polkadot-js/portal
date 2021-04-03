// Copyright 2017-2021 @polkadot/app-council authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';

import React, { useCallback, useEffect, useState } from 'react';

import { Button, Input, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useThresholds, useToggle } from '@polkadot/react-hooks';
import { isHex } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  isMember: boolean;
  members: string[];
}

interface HashState {
  hash?: string;
  isHashValid: boolean;
}

interface ProposalState {
  proposal?: SubmittableExtrinsic<'promise'> | null;
  proposalLength: number;
}

function ProposeExternal ({ className = '', isMember, members }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { proposalThreshold } = useThresholds();

  const [isVisible, toggleVisible] = useToggle();
  const [accountId, setAcountId] = useState<string | null>(null);
  const [{ proposal, proposalLength }, setProposal] = useState<ProposalState>({ proposalLength: 0 });
  const [{ hash, isHashValid }, setHash] = useState<HashState>({ hash: '', isHashValid: false });

  const _onChangeHash = useCallback(
    (hash?: string): void => setHash({ hash, isHashValid: isHex(hash, 256) }),
    []
  );

  useEffect((): void => {
    if (isHashValid && hash) {
      const proposal = api.tx.democracy.externalProposeMajority(hash);

      setProposal({
        proposal,
        proposalLength: proposal.encodedLength || 0
      });
    } else {
      setProposal({
        proposal: null,
        proposalLength: 0
      });
    }
  }, [api, hash, isHashValid]);

  return (
    <>
      <Button
        icon='plus'
        isDisabled={!isMember}
        label={t<string>('Propose external')}
        onClick={toggleVisible}
      />
      {isVisible && (
        <Modal
          className={className}
          header={t<string>('Propose external (majority)')}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t<string>('The council account for the proposal. The selection is filtered by the current members.')}>
              <InputAddress
                filter={members}
                help={t<string>('Select the account you wish to make the proposal with.')}
                label={t<string>('propose from account')}
                onChange={setAcountId}
                type='account'
                withLabel
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The hash of the proposal image, either already submitted or valid for the specific call.')}>
              <Input
                autoFocus
                help={t<string>('The preimage hash of the proposal')}
                label={t<string>('preimage hash')}
                onChange={_onChangeHash}
                value={hash}
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleVisible}>
            <TxButton
              accountId={accountId}
              icon='plus'
              isDisabled={!proposalThreshold || !members.includes(accountId || '') || !proposal}
              label={t<string>('Propose')}
              onStart={toggleVisible}
              params={
                api.tx.council.propose.meta.args.length === 3
                  ? [proposalThreshold, proposal, proposalLength]
                  : [proposalThreshold, proposal]
              }
              tx={api.tx.council.propose}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(ProposeExternal);

// Copyright 2017-2021 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { Hash, VoteThreshold } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useCallback, useEffect, useState } from 'react';

import { Button, Input, InputAddress, InputNumber, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useMembers, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  imageHash: Hash;
  threshold: VoteThreshold;
}

interface ProposalState {
  proposal?: SubmittableExtrinsic<'promise'> | null;
  proposalLength: number;
}

interface ThresholdState {
  defaultThreshold: BN;
  isThresholdValid: boolean;
  memberThreshold: BN;
}

const ONE_MIN = (1 * 60) / 6;
const DEF_DELAY = new BN(ONE_MIN);
const DEF_VOTING = new BN(ONE_MIN * 60 * 3);

function Fasttrack ({ imageHash, threshold }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { isMember, members } = useMembers('technicalCommittee');
  const [isFasttrackOpen, toggleFasttrack] = useToggle();
  const [allowFast, setAllowFast] = useState(false);
  const [accountId, setAcountId] = useState<string | null>(null);
  const [delayBlocks, setDelayBlocks] = useState<BN | undefined>(DEF_DELAY);
  const [{ defaultThreshold, isThresholdValid, memberThreshold }, setMemberThreshold] = useState<ThresholdState>(
    () => ({ defaultThreshold: new BN(Math.ceil(members.length * 0.66)), isThresholdValid: !!members.length, memberThreshold: new BN(Math.ceil(members.length * 0.66)) })
  );
  const [votingBlocks, setVotingBlocks] = useState<BN | undefined>(DEF_VOTING);
  const [{ proposal, proposalLength }, setProposal] = useState<ProposalState>({ proposalLength: 0 });

  useEffect((): void => {
    setAllowFast(isMember && threshold.isSimplemajority);
  }, [isMember, threshold]);

  useEffect((): void => {
    const proposal = delayBlocks && !delayBlocks.isZero() && votingBlocks && !votingBlocks.isZero()
      ? api.tx.democracy.fastTrack(imageHash, votingBlocks, delayBlocks)
      : null;

    setProposal({ proposal, proposalLength: proposal?.length || 0 });
  }, [api, delayBlocks, imageHash, votingBlocks]);

  const _setMemberThreshold = useCallback(
    (memberThreshold?: BN) =>
      setMemberThreshold(({ defaultThreshold }) =>
        memberThreshold && !memberThreshold.isZero() && memberThreshold.lten(members.length)
          ? { defaultThreshold, isThresholdValid: false, memberThreshold }
          : { defaultThreshold, isThresholdValid: false, memberThreshold: defaultThreshold }
      ),
    [members]
  );

  return (
    <>
      {isFasttrackOpen && (
        <Modal
          header={t<string>('Fast track proposal')}
          size='small'
        >
          <Modal.Content>
            <InputAddress
              filter={members}
              help={t<string>('Select the account you wish to make the proposal with.')}
              label={t<string>('propose from account')}
              onChange={setAcountId}
              type='account'
              withLabel
            />
            <Input
              help={t<string>('The external proposal to send to the technical committee')}
              isDisabled
              label={t<string>('preimage hash')}
              value={imageHash.toHex()}
            />
            <InputNumber
              autoFocus
              help={t<string>('The voting period to apply in blocks')}
              isZeroable={false}
              label={t<string>('voting period')}
              onChange={setVotingBlocks}
              value={votingBlocks}
            />
            <InputNumber
              help={t<string>('The delay period to apply in blocks')}
              isZeroable={false}
              label={t<string>('delay')}
              onChange={setDelayBlocks}
              value={delayBlocks}
            />
            <InputNumber
              defaultValue={defaultThreshold}
              help={t<string>('The threshold to apply (default: 66%)')}
              isZeroable={false}
              label={t<string>('required threshold')}
              onChange={_setMemberThreshold}
            />
          </Modal.Content>
          <Modal.Actions onCancel={toggleFasttrack}>
            <TxButton
              accountId={accountId}
              icon='fast-forward'
              isDisabled={!accountId || !proposal || !memberThreshold || !isThresholdValid}
              label={t<string>('Fast track')}
              onStart={toggleFasttrack}
              params={
                api.tx.technicalCommittee.propose.meta.args.length === 3
                  ? [memberThreshold, proposal, proposalLength]
                  : [memberThreshold, proposal]
              }
              tx={api.tx.technicalCommittee.propose}
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='fast-forward'
        isDisabled={!allowFast}
        label={t<string>('Fast track')}
        onClick={toggleFasttrack}
      />
    </>
  );
}

export default React.memo(Fasttrack);

// Copyright 2017-2021 @polkadot/app-council authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';

import BN from 'bn.js';
import React, { useCallback, useEffect, useState } from 'react';

import { Button, Extrinsic, InputAddress, InputNumber, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useThresholds, useToggle } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  isMember: boolean;
  members: string[];
}

interface Threshold {
  isThresholdValid: boolean;
  threshold?: BN;
}

interface ProposalState {
  proposal?: SubmittableExtrinsic<'promise'> | null;
  proposalLength: number;
}

function Propose ({ isMember, members }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api, apiDefaultTxSudo } = useApi();
  const { proposalThreshold } = useThresholds();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAcountId] = useState<string | null>(null);
  const [{ proposal, proposalLength }, setProposal] = useState<ProposalState>({ proposalLength: 0 });
  const [{ isThresholdValid, threshold }, setThreshold] = useState<Threshold>({ isThresholdValid: false });

  useEffect((): void => {
    members && setThreshold({
      isThresholdValid: members.length !== 0,
      threshold: new BN(proposalThreshold)
    });
  }, [api, members, proposalThreshold]);
  const _setMethod = useCallback(
    (proposal?: SubmittableExtrinsic<'promise'> | null) => setProposal({
      proposal,
      proposalLength: proposal?.encodedLength || 0
    }),
    []
  );

  const _setThreshold = useCallback(
    (threshold?: BN) => setThreshold({
      isThresholdValid: !!threshold?.gtn(0),
      threshold
    }),
    []
  );

  return (
    <>
      <Button
        icon='plus'
        isDisabled={!isMember}
        label={t<string>('Propose motion')}
        onClick={toggleOpen}
      />
      {isOpen && (
        <Modal
          header={t<string>('Propose a council motion')}
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
            <Modal.Columns hint={t<string>('The desired threshold. Here set to a default of 50%+1, as applicable for general proposals.')}>
              <InputNumber
                className='medium'
                help={t<string>('The minimum number of council votes required to approve this motion')}
                isError={!threshold || threshold.eqn(0) || threshold.gtn(members.length)}
                label={t<string>('threshold')}
                onChange={_setThreshold}
                placeholder={t<string>('Positive number between 1 and {{memberCount}}', { replace: { memberCount: members.length } })}
                value={threshold || BN_ZERO}
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The actual proposal to make, based on the selected call and parameters thereof.')}>
              <Extrinsic
                defaultValue={apiDefaultTxSudo}
                label={t<string>('proposal')}
                onChange={_setMethod}
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleOpen}>
            <TxButton
              accountId={accountId}
              isDisabled={!proposal || !isThresholdValid}
              label={t<string>('Propose')}
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
    </>
  );
}

export default React.memo(Propose);

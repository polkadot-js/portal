// Copyright 2017-2021 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BountyIndex } from '@polkadot/types/interfaces';

import React, { useRef, useState } from 'react';

import { InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useMembers, useThresholds } from '@polkadot/react-hooks';

import { truncateTitle } from '../helpers';
import { useBounties } from '../hooks';
import { useTranslation } from '../translate';

interface Props {
  description: string;
  index: BountyIndex;
  toggleOpen: () => void;
}

function CloseBounty ({ description, index, toggleOpen }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { members } = useMembers();
  const { closeBounty } = useBounties();
  const { treasuryRejectionThreshold } = useThresholds();

  const [accountId, setAccountId] = useState<string | null>(null);

  const closeBountyProposal = useRef(closeBounty(index));

  return (
    <Modal
      header={`${t<string>('close bounty')} - "${truncateTitle(description, 30)}"`}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t<string>('The council member that will create the close bounty proposal, submission equates to an "aye" vote.')}>
          <InputAddress
            filter={members}
            help={t<string>('Select the council member account you wish to use to create a proposal for closing bounty.')}
            label={t<string>('propose with account')}
            onChange={setAccountId}
            type='account'
            withLabel
          />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={toggleOpen}>
        <TxButton
          accountId={accountId}
          icon='ban'
          isDisabled={false}
          label={t<string>('Close Bounty')}
          onStart={toggleOpen}
          params={[treasuryRejectionThreshold, closeBountyProposal.current, closeBountyProposal.current.length]}
          tx={api.tx.council.propose}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(CloseBounty);

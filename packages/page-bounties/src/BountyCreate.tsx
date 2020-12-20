// Copyright 2017-2020 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BalanceOf } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useCallback, useState } from 'react';

import { Button, Input, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import { calculateBountyBond } from './helpers/calculateBountyBond';
import { useTranslation } from './translate';

function BountyCreate () {
  const { t } = useTranslation();
  const { api } = useApi();

  const [accountId, setAccountId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [bond, setBond] = useState(((api.consts.bounties || api.consts.treasury).bountyDepositBase as BalanceOf).toBn());
  const [amount, setAmount] = useState<BN | undefined>(BN_ZERO);
  const [isValid] = useState(true);
  const [isOpen, toggleIsOpen] = useToggle();

  const onTitleChange = useCallback((value: string) => {
    const bountyBase = api.consts.bounties || api.consts.treasury;
    const bountyDepositBase = bountyBase.bountyDepositBase;
    const bountyDepositPerByte = bountyBase.dataDepositPerByte;

    setTitle(value);
    setBond(calculateBountyBond(value, bountyDepositBase as BalanceOf, bountyDepositPerByte as BalanceOf));
  }, [api]);

  return (
    <>
      <Button
        icon='plus'
        isDisabled={false}
        label={t<string>('Add Bounty')}
        onClick={toggleIsOpen}
      />
      {isOpen && (
        <Modal
          className='ui--AddBountyModal'
          header={t<string>('Add Bounty')}
        >
          <Modal.Content>
            <Input
              autoFocus
              help={t<string>('The description of this bounty')}
              label={t<string>('bounty title')}
              onChange={onTitleChange}
              value={title}
            />
            <InputBalance
              help={t<string>('The total payment amount of this bounty, curators fee included.')}
              isZeroable
              label={t<string>('bounty requested allocation')}
              onChange={setAmount}
              value={ amount }
            />
            <InputBalance
              defaultValue={bond.toString()}
              help={t<string>('This amount will be reserved from origin account and returned on approval or slashed upon rejection.')}
              isDisabled
              label={t<string>('bounty bond')}
            />
            <InputAddress
              help={t<string>('Select the account you wish to propose the bounty from.')}
              label={t<string>('submit with account')}
              onChange={setAccountId}
              type='account'
              withLabel
            />
          </Modal.Content>
          <Modal.Actions onCancel={toggleIsOpen}>
            <TxButton
              accountId={accountId}
              icon='plus'
              isDisabled={!accountId || !isValid}
              label={t<string>('Add Bounty')}
              onStart={toggleIsOpen}
              params={[amount, title]}
              tx={(api.tx.bounties || api.tx.treasury).proposeBounty}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(BountyCreate);

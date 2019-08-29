// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { CodeStored } from '@polkadot/app-contracts/types';

import React from 'react';
import { AddressRow, Button, CodeRow, Modal } from '@polkadot/react-components';

import translate from './translate';

interface Props extends I18nProps {
  address?: string;
  code?: CodeStored;
  name?: string;
  mode?: 'account' | 'address' | 'contract' | 'code';
  onClose: () => void;
  onForget: () => void;
}

const headerText = ({ mode = 'account', t }: Props): string => {
  switch (mode) {
    case 'account':
      return t('Confirm account removal');
    case 'address':
      return t('Confirm address removal');
    case 'contract':
      return t('Confirm contract removal');
    case 'code':
      return t('Confirm code removal');
  }
};

const content = ({ mode = 'account', t }: Props): React.ReactNode => {
  switch (mode) {
    case 'account':
      return (
        <>
          <p>{t('You are about to remove this account from your list of available accounts. Once completed, should you need to access it again, you will have to re-create the account either via seed or via a backup file.')}</p>
          <p>{t('This operaion does not remove the history of the account from the chain, nor any associated funds from the account. The forget operation only limits your access to the account on this browser.')}</p>
        </>
      );
    case 'address':
      return (
        <>
          <p>{t('You are about to remove this address from your address book. Once completed, should you need to access it again, you will have to re-add the address.')}</p>
          <p>{t('This operation does not remove the history of the account from the chain, nor any associated funds from the account. The forget operation only limits your access to the address on this browser.')}</p>
        </>
      );
    case 'contract':
      return (
        <>
          <p>{t('You are about to remove this contract from your list of available contracts. Once completed, should you need to access it again, you will have to manually add the contract\'s address in the Instantiate tab.')}</p>
          <p>{t('This operaion does not remove the history of the contract from the chain, nor any associated funds from its account. The forget operation only limits your access to the contract on this browser.')}</p>
        </>
      );
    case 'code':
      return (
        <>
          <p>{t('You are about to remove this code from your list of available code hashes. Once completed, should you need to access it again, you will have to manually add the code hash again.')}</p>
          <p>{t('This operaion does not remove the uploaded code WASM and ABI from the chain, nor any deployed contracts. The forget operation only limits your access to the code on this browser.')}</p>
        </>
      );
  }
};

const renderContent = (props: Props): React.ReactNode => {
  const { address, code, mode = 'account' } = props;
  switch (mode) {
    case 'account':
    case 'address':
    case 'contract':
      return (
        <AddressRow
          isInline
          value={address || ''}
        >
          {content(props)}
        </AddressRow>
      );
    case 'code':
      return (
        <CodeRow
          isInline
          code={code || ''}
        >
          {content(props)}
        </CodeRow>
      );
  }
};

const renderButtons = ({ onClose, onForget, t }: Props): React.ReactNode => ((
  <Modal.Actions>
    <Button.Group>
      <Button
        isNegative
        onClick={onClose}
        label={t('Cancel')}
      />
      <Button.Or />
      <Button
        isPrimary
        onClick={onForget}
        label={t('Forget')}
      />
    </Button.Group>
  </Modal.Actions>
));

function Forget (props: Props): React.ReactElement<Props> {
  const { onClose } = props;
  return (
    <Modal
      className='app--accounts-Modal'
      dimmer='inverted'
      onClose={onClose}
      open
    >
      <Modal.Header>
        {headerText(props)}
      </Modal.Header>
      <Modal.Content>
        {renderContent(props)}
      </Modal.Content>
      {renderButtons(props)}
    </Modal>
  );
}

export default translate(Forget);

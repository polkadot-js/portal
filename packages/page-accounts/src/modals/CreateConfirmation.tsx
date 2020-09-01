// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeypairType } from '@polkadot/util-crypto/types';

import React from 'react';
import { AddressRow, Button, Modal, Static } from '@polkadot/react-components';
import { isHex } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  address: string;
  derivePath: string;
  isBusy: boolean;
  name: string;
  onClose: () => void;
  onCommit: () => void;
  pairType: KeypairType;
  seed: string;
}

function CreateConfirmation ({ address, derivePath, isBusy, name, onClose, onCommit, pairType, seed }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  const splitSeed = seed.split(' ');
  const shortSeed = isHex(seed)
    ? `${seed.substr(10)} … ${seed.substr(-8)}`
    : splitSeed.map((value, index) => (index % 3) ? '…' : value).join(' ');

  return (
    <Modal
      header={t<string>('Confirmation notice')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <AddressRow
              defaultName={name}
              isInline
              noDefaultNameOpacity
              value={address}
            />
            <Static
              label={t<string>('partial seed')}
              value={shortSeed}
            />
            <Static
              label={t<string>('keypair type')}
              value={pairType}
            />
            <Static
              label={t<string>('derivation path')}
              value={derivePath || t<string>('<none provided>')}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('We will provide you with a generated backup file after your account is created. As long as you have access to your account you can always download this file later by clicking on "Backup" button from the Accounts section.')}</p>
            <p>{t<string>('Please make sure to save this file in a secure location as it is required, together with your password, to restore your account.')}</p>
          </Modal.Column>
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <Button
          icon='plus'
          isBusy={isBusy}
          label={t<string>('Create and backup account')}
          onClick={onCommit}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(CreateConfirmation);

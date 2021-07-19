// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Dispatch, SetStateAction } from 'react';
import type { KeyringPair, KeyringPair$Json } from '@polkadot/keyring/types';
import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { ModalProps } from '../types';

import React, { useCallback, useMemo, useState } from 'react';

import { AddressRow, Button, InputAddress, InputFile, MarkWarning, Modal, Password } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';
import { u8aToString } from '@polkadot/util';

import { useTranslation } from '../translate';
import ExternalWarning from './ExternalWarning';

interface Props extends ModalProps {
  className?: string;
  onClose: () => void;
  onStatusChange: (status: ActionStatus) => void;
}

interface PassState {
  isPassValid: boolean;
  password: string;
}

const acceptedFormats = ['application/json', 'text/plain'].join(', ');

function parseFile (file: Uint8Array, setWarning: Dispatch<SetStateAction<string | null>>, isEthereum: boolean, genesisHash?: string | null): KeyringPair | null {
  try {
    const pair = keyring.createFromJson(JSON.parse(u8aToString(file)) as KeyringPair$Json, { genesisHash });

    if (isEthereum && pair.type !== 'ethereum') { throw new Error('JSON File does not contain an ethereum type key pair'); }

    return pair;
  } catch (error) {
    console.error(error);
    setWarning((error as Error).message ? (error as Error).message : (error as Error).toString());
  }

  return null;
}

function Import ({ className = '', onClose, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api, isDevelopment, isEthereum } = useApi();
  const [isBusy, setIsBusy] = useState(false);
  const [pair, setPair] = useState<KeyringPair | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [{ isPassValid, password }, setPass] = useState<PassState>({ isPassValid: false, password: '' });
  const apiGenesisHash = useMemo(() => isDevelopment ? null : api.genesisHash.toHex(), [api, isDevelopment]);
  const differentGenesis = useMemo(() => pair?.meta.genesisHash && pair.meta.genesisHash !== apiGenesisHash, [apiGenesisHash, pair]);

  const _onChangeFile = useCallback(
    (file: Uint8Array) => setPair(parseFile(file, setWarning, isEthereum, apiGenesisHash)),
    [apiGenesisHash, isEthereum]
  );

  const _onChangePass = useCallback(
    (password: string) => setPass({ isPassValid: keyring.isPassValid(password), password }),
    []
  );

  const _onSave = useCallback(
    (): void => {
      if (!pair) {
        return;
      }

      setIsBusy(true);
      setTimeout((): void => {
        const status: Partial<ActionStatus> = { action: 'restore' };

        try {
          keyring.addPair(pair, password);

          status.status = 'success';
          status.account = pair.address;
          status.message = t<string>('account restored');

          InputAddress.setLastValue('account', pair.address);
        } catch (error) {
          setPass((state: PassState) => ({ ...state, isPassValid: false }));

          status.status = 'error';
          status.message = (error as Error).message;
          console.error(error);
        }

        setIsBusy(false);
        onStatusChange(status as ActionStatus);

        if (status.status !== 'error') {
          onClose();
        }
      }, 0);
    },
    [onClose, onStatusChange, pair, password, t]
  );

  return (
    <Modal
      className={className}
      header={t<string>('Add via backup file')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <AddressRow
            defaultName={(pair?.meta.name as string) || null}
            noDefaultNameOpacity
            value={pair?.address || null}
          />
        </Modal.Columns>
        <Modal.Columns hint={t<string>('Supply a backed-up JSON file, encrypted with your account-specific password.')}>
          <InputFile
            accept={acceptedFormats}
            className='full'
            help={t<string>('Select the JSON key file that was downloaded when you created the account. This JSON file contains your private key encrypted with your password.')}
            isError={!pair}
            label={t<string>('backup file')}
            onChange={_onChangeFile}
            withLabel
          />
          {differentGenesis && (
            <MarkWarning content={t<string>('The network from which this account was originally generated is different than the network you are currently connected to. Once imported ensure you toggle the "allow on any network" option for the account to keep it visible on the current network.')} />
          )}
        </Modal.Columns>
        <Modal.Columns hint={t<string>('The password previously used to encrypt this account.')}>
          <Password
            autoFocus
            className='full'
            help={t<string>('Type the password chosen at the account creation. It was used to encrypt your account\'s private key in the backup file.')}
            isError={!isPassValid}
            label={t<string>('password')}
            onChange={_onChangePass}
            onEnter={_onSave}
            value={password}
          />
        </Modal.Columns>
        <Modal.Columns>
          <ExternalWarning />
          {warning && <MarkWarning content={warning} />}
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <Button
          icon='sync'
          isBusy={isBusy}
          isDisabled={!pair || !isPassValid}
          label={t<string>('Restore')}
          onClick={_onSave}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Import);

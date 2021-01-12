// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useCallback, useState } from 'react';

import { Input, InputAddress, InputBalance, InputFile, InputNumber, InputWasm, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BN_TEN, compactAddLength } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  onClose: () => void;
}

interface CodeState {
  isWasmValid: boolean;
  wasm: Uint8Array | null;
}

function Propose ({ className, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [paraId, setParaId] = useState(new BN(Date.now() % 131072));
  const [balance, setBalance] = useState(new BN(1000).mul(BN_TEN.pow(new BN(api.registry.chainDecimals))));
  const [validator, setValidator] = useState<string | null>(null);
  const [{ isWasmValid, wasm }, setWasm] = useState<CodeState>({ isWasmValid: false, wasm: null });
  const [genesisState, setGenesisState] = useState<Uint8Array | null>(null);

  const _setGenesisState = useCallback(
    (data: Uint8Array) => setGenesisState(compactAddLength(data)),
    []
  );

  const _setWasm = useCallback(
    (wasm: Uint8Array, isWasmValid: boolean) => setWasm({ isWasmValid, wasm }),
    []
  );

  const isNameValid = name.length >= 3;

  return (
    <Modal
      className={className}
      header={t<string>('Propose parachain')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              label={t<string>('propose from')}
              onChange={setAccountId}
              type='account'
              value={accountId}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('This account will be associated with the parachain and pay the deposit.')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <Input
              isError={!isNameValid}
              label={t<string>('name')}
              onChange={setName}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('The name for this parachain')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <InputNumber
              defaultValue={paraId.toString()}
              label={t<string>('parachain id')}
              onChange={setParaId}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('The id of this parachain as known on the network')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <InputWasm
              help={t<string>('The compiled runtime WASM for the parachain you wish to register.')}
              isError={!isWasmValid}
              label={t<string>('code')}
              onChange={_setWasm}
              placeholder={
                wasm && !isWasmValid
                  ? t<string>('The code is not recognized as being in valid WASM format')
                  : null
              }
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('The WASM validation function for this parachain.')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <InputFile
              help={t<string>('The genesis state for the parachain.')}
              isError={!genesisState}
              label={t<string>('initial state')}
              onChange={_setGenesisState}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('The genesis state for this parachain.')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              label={t<string>('associated validator')}
              onChange={setValidator}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('A validator for this parachain')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <InputBalance
              defaultValue={balance}
              label={t<string>('initial balance')}
              onChange={setBalance}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('The proposed initial balance for this parachain')}</p>
          </Modal.Column>
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={accountId}
          icon='plus'
          isDisabled={!isWasmValid || !genesisState || !isNameValid || !validator}
          onStart={onClose}
          params={[paraId, name, wasm, genesisState, [validator], balance]}
          tx={api.tx.proposeParachain?.proposeParachain}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Propose);

// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { BalanceOf } from '@polkadot/types/interfaces';

import React, { useCallback, useMemo, useState } from 'react';

import { InputAddress, InputBalance, InputFile, InputNumber, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { compactAddLength } from '@polkadot/util';

import { useTranslation } from '../translate';
import { LOWEST_INVALID_ID } from './constants';

interface Props {
  className?: string;
  onClose: () => void;
}

function RegisterThread ({ className, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [paraId, setParaId] = useState<BN | undefined>();
  const [wasm, setWasm] = useState<Uint8Array | null>(null);
  const [genesisState, setGenesisState] = useState<Uint8Array | null>(null);

  const _setGenesisState = useCallback(
    (data: Uint8Array) => setGenesisState(compactAddLength(data)),
    []
  );

  const _setWasm = useCallback(
    (data: Uint8Array) => setWasm(compactAddLength(data)),
    []
  );

  const reservedDeposit = useMemo(
    () => (api.consts.registrar.paraDeposit as BalanceOf)
      .add((api.consts.registrar.dataDepositPerByte as BalanceOf).muln(wasm ? wasm.length : 0))
      .iadd((api.consts.registrar.dataDepositPerByte as BalanceOf).muln(genesisState ? genesisState.length : 0)),
    [api, wasm, genesisState]
  );

  const isIdError = !paraId || !paraId.gt(LOWEST_INVALID_ID);

  return (
    <Modal
      className={className}
      header={t<string>('Register parathread')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t<string>('This account will be associated with the parachain and pay the deposit.')}>
          <InputAddress
            label={t<string>('register from')}
            onChange={setAccountId}
            type='account'
            value={accountId}
          />
        </Modal.Columns>
        <Modal.Columns hint={t<string>('The id of this parachain as known on the network')}>
          <InputNumber
            autoFocus
            defaultValue={LOWEST_INVALID_ID}
            isError={isIdError}
            isZeroable={false}
            label={t<string>('parachain id')}
            onChange={setParaId}
          />
        </Modal.Columns>
        <Modal.Columns hint={t<string>('The WASM validation function for this parachain.')}>
          <InputFile
            help={t<string>('The compiled runtime WASM for the parachain you wish to register.')}
            isError={!wasm}
            label={t<string>('code')}
            onChange={_setWasm}
          />
        </Modal.Columns>
        <Modal.Columns hint={t<string>('The genesis state for this parachain.')}>
          <InputFile
            help={t<string>('The genesis state for the parachain.')}
            isError={!genesisState}
            label={t<string>('initial state')}
            onChange={_setGenesisState}
          />
        </Modal.Columns>
        <Modal.Columns hint={t<string>('The reservation fee for this parachain, including base fee and per-byte fees')}>
          <InputBalance
            defaultValue={reservedDeposit}
            isDisabled
            label={t<string>('reserved deposit')}
          />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={accountId}
          icon='plus'
          isDisabled={!wasm || !genesisState || isIdError}
          onStart={onClose}
          params={[paraId, genesisState, wasm]}
          tx={api.tx.registrar.register}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(RegisterThread);

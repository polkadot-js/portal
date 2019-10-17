// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { QueueProps, QueueTx, QueueTxRpcAdd } from '@polkadot/react-components/Status/types';
import { CallContract, StringOrNull } from '@polkadot/react-components/types';
import { CallProps as Props } from './types';
import { Codec } from '@polkadot/types/types';
import { ContractCallRequest, ContractExecResult } from '@polkadot/types/interfaces/contracts';

import BN from 'bn.js';
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import rpc from '@polkadot/jsonrpc';
import { Button, Dropdown, InputAddress, InputBalance, InputNumber, Modal, TxButton } from '@polkadot/react-components';
import { QueueConsumer } from '@polkadot/react-components/Status/Context';
// import { getContractAbi } from '@polkadot/react-components/util';
import { withApi, withMulti } from '@polkadot/react-api';
import { isNull, isUndefined, stringToHex, stringCamelCase } from '@polkadot/util';

// import { getCallProps, needsCallProps } from './util';
import Params from '../Params';

import translate from '../translate';
import { GAS_LIMIT } from '../constants';
import { findCallMethod, getContractForAddress, getCallMethodOptions, getContractMethodFn } from './util';

function Call (props: Props): React.ReactElement<Props> | null {
  const { isOpen, callContract, callMethodIndex, onChangeCallContract, onChangeCallMethodIndex, onClose, api, t } = props;

  if (isNull(callContract) || isNull(callMethodIndex)) {
    return null;
  }

  const hasRpc = api.rpc.contracts && api.rpc.contracts.call;
  const callMethod = findCallMethod(callContract, callMethodIndex);
  const useRpc = hasRpc && callMethod && !callMethod.mutates;
  // const isRpc = false;

  const [accountId, setAccountId] = useState<StringOrNull>(null);
  const [endowment, setEndowment] = useState<BN>(new BN(0));
  const [gasLimit, setGasLimit] = useState<BN>(new BN(GAS_LIMIT));
  const [isBusy, setIsBusy] = useState(false);
  const [params, setParams] = useState<any[]>([]);

  const _onChangeAccountId = (accountId: StringOrNull): void => setAccountId(accountId);
  const _onChangeCallAddress = (callAddress: StringOrNull): void => {
    const callContract = getContractForAddress(callAddress);

    onChangeCallContract && callContract.abi && onChangeCallContract(callContract);
  };
  const _onChangeCallMethodString = (callMethodString: string): void => {
    setParams([]);
    console.log(callMethodString);
    onChangeCallMethodIndex && onChangeCallMethodIndex(parseInt(callMethodString, 10) || 0);
  };
  const _onChangeEndowment = (endowment?: BN): void => endowment && setEndowment(endowment);
  const _onChangeGasLimit = (gasLimit?: BN): void => gasLimit && setGasLimit(gasLimit);

  const _onChangeParams = (params: any[]): void => setParams(params);
  const _toggleBusy = (): void => setIsBusy(!isBusy);

  const _constructTx = (): any[] => {
    const fn = getContractMethodFn(callContract, callMethod);
    if (!fn || !callContract || !callContract.address) {
      return [];
    }

    return [callContract.address, endowment, gasLimit, fn(...params)];
  };

  const _constructRpc = (): [any] | null => {
    const fn = getContractMethodFn(callContract, callMethod);
    if (!fn || !accountId || !callContract || !callContract.address || !callContract.abi || !callMethod) {
      return null;
    }
    return [
      {
        origin: accountId, // stringToHex(accountId),
        dest: callContract.address, // stringToHex(callContract.address),
        value: endowment,
        gasLimit,
        inputData: fn(...params)
      }
    ];
  };

  const isEndowmentValid = true; // !endowment.isZero();
  const isGasValid = !gasLimit.isZero();
  const isValid = !!accountId && isEndowmentValid && isGasValid && callContract && callContract.address && callContract.abi;

  return (
    <Modal
      className='app--contracts-Modal'
      dimmer='inverted'
      onClose={onClose}
      open={isOpen}
    >
      <Modal.Header>
        {t('Call a contract')}
      </Modal.Header>
      <Modal.Content>
        {callContract && (
          <div className='contracts--CallControls'>
            <InputAddress
              defaultValue={accountId}
              help={t('Specify the user account to use for this contract call. And fees will be deducted from this account.')}
              isDisabled={isBusy}
              label={t('call from account')}
              onChange={_onChangeAccountId}
              type='account'
              value={accountId}
            />
            <InputAddress
              help={t('A deployed contract that has either been deployed or attached. The address and ABI are used to construct the parameters.')}
              isDisabled={isBusy}
              label={t('contract to use')}
              onChange={_onChangeCallAddress}
              type='contract'
              value={callContract.address}
            />
            {callMethodIndex !== null && (
              <>
                <Dropdown
                  defaultValue={`${callMethodIndex}`}
                  help={t('The message to send to this contract. Parameters are adjusted based on the ABI provided.')}
                  isDisabled={isBusy}
                  isError={callMethod === null}
                  label={t('message to send')}
                  onChange={_onChangeCallMethodString}
                  options={getCallMethodOptions(callContract)}
                  value={`${callMethodIndex}`}
                />
                <Params
                  isDisabled={isBusy}
                  onChange={_onChangeParams}
                  params={
                    callMethod
                      ? callMethod.args
                      : undefined
                  }
                />
              </>
            )}
            <InputBalance
              help={t('The allotted value for this contract, i.e. the amount transferred to the contract as part of this call.')}
              isDisabled={isBusy}
              isError={!isEndowmentValid}
              label={t('value')}
              onChange={_onChangeEndowment}
              value={endowment}
            />
            <InputNumber
              defaultValue={gasLimit}
              help={t('The maximum amount of gas that can be used by this call. If the code requires more, the call will fail.')}
              isDisabled={isBusy}
              isError={!isGasValid}
              label={t('maximum gas allowed')}
              onChange={_onChangeGasLimit}
              value={gasLimit}
            />
          </div>
        )}
        <QueueConsumer>
          {
            ({ queueRpc, txqueue }: QueueProps): React.ReactNode => {
              const _onSubmitRpc = (): void => {
                const values = _constructRpc();

                if (values) {
                  queueRpc({
                    accountId,
                    rpc: rpc.contracts.methods.call,
                    values
                  });
                }
              };
              const results = txqueue
                .filter(({ error, result, rpc }): boolean =>
                  ((!isUndefined(error) || !isUndefined(result)) &&
                  rpc.section === 'contracts' && rpc.method === 'call')
                )
                .reverse();
              return (
                <>
                  <Button.Group>
                    <Button
                      icon='cancel'
                      isNegative
                      onClick={onClose}
                      label={t('Cancel')}
                    />
                    <Button.Or />
                    {useRpc
                      ? (
                        <Button
                          icon='sign-in'
                          isDisabled={!isValid}
                          isPrimary
                          label={t('Call')}
                          onClick={_onSubmitRpc}
                        />
                      )
                      : (
                        <TxButton
                          accountId={accountId}
                          icon='sign-in'
                          isDisabled={!isValid}
                          isPrimary
                          label={t('Call')}
                          onClick={_toggleBusy}
                          onFailed={_toggleBusy}
                          onSuccess={_toggleBusy}
                          params={_constructTx}
                          tx={api.tx.contracts ? 'contracts.call' : 'contract.call'}
                        />
                      )
                    }
                  </Button.Group>
                  {JSON.stringify(results)}
                </>
              );
            }
          }
        </QueueConsumer>
      </Modal.Content>
    </Modal>
  );
}

export default withMulti(
  translate(withRouter(Call)),
  withApi
);

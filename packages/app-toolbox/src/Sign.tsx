// Copyright 2017-2019 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { KeyringPair } from '@polkadot/keyring/types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { web3FromSource } from '@polkadot/extension-dapp';
import { Button, Input, InputAddress, Output, Static } from '@polkadot/react-components';
import keyring from '@polkadot/ui-keyring';
import { assert, hexToU8a, isHex, stringToU8a, u8aToHex } from '@polkadot/util';

import translate from './translate';
import Unlock from './Unlock';

interface Props extends I18nProps {
  className?: string;
}

interface StateType {
  isExternal: boolean;
  isHardware: boolean;
  isInjected: boolean;
  isLocked: boolean;
  isUsable: boolean;
}

interface State extends StateType {
  currentPair: KeyringPair | null;
  data: string;
  isHexData: boolean;
  isUnlockVisible: boolean;
  signature: string;
}

function getStateType (currentPair?: KeyringPair | null): StateType {
  const isExternal = currentPair?.meta.isExternal || false;
  const isHardware = currentPair?.meta.isHardware || false;
  const isInjected = currentPair?.meta.isInjected || false;
  const isUsable = !(isExternal || isHardware);

  return {
    isExternal,
    isHardware,
    isInjected,
    isLocked: isUsable
      ? isInjected
        ? false
        : (currentPair?.isLocked || false)
      : true,
    isUsable
  };
}

function Sign ({ className, t }: Props): React.ReactElement<Props> {
  const [state, setState] = useState<State>({
    currentPair: null,
    data: '',
    isExternal: false,
    isHardware: false,
    isHexData: false,
    isInjected: false,
    isLocked: false,
    isUnlockVisible: false,
    isUsable: true,
    signature: ''
  });

  useEffect((): void => {
    const pairs = keyring.getPairs();
    const currentPair = pairs[0] || null;

    setState({
      ...getStateType(currentPair),
      currentPair,
      data: '',
      isHexData: false,
      isUnlockVisible: false,
      signature: ''
    });
  }, []);

  const _nextState = (partial: Partial<State>): void => {
    const currentPair = partial.currentPair || state.currentPair;

    setState({
      ...state,
      ...partial,
      ...getStateType(currentPair),
      currentPair
    });
  };

  const _toggleUnlock = (): void =>
    _nextState({ isUnlockVisible: !state.isUnlockVisible });
  const _onChangeAccount = (accountId: string | null): void =>
    _nextState({ currentPair: keyring.getPair(accountId || '') });
  const _onChangeData = (data: string): void =>
    _nextState({ data, isHexData: isHex(data) });
  const _onSign = (): void => {
    const { currentPair, data, isHexData, isLocked } = state;

    if (isLocked || !currentPair) {
      return;
    }

    const { address, meta: { source } } = currentPair;

    if (source) {
      web3FromSource(source)
        .then((injected): Promise<{ signature: string }> => {
          // these needs to be raised and properly shows on the UI, not hidden as
          // console logs like they are here
          assert(injected, `Unable to find a signer for ${address}`);
          assert(injected.signer.signRaw, `Unable to find raw signer for ${address}`);

          return injected.signer.signRaw({
            address,
            data,
            type: 'bytes'
          });
        })
        .then(_nextState);
    } else {
      const signature = u8aToHex(
        currentPair.sign(
          isHexData
            ? hexToU8a(data)
            : stringToU8a(data)
        )
      );

      _nextState({ signature });
    }
  };

  const { currentPair, data, isHexData, isInjected, isLocked, isUnlockVisible, isUsable, signature } = state;

  return (
    <div className={`toolbox--Sign ${className}`}>
      <div className='ui--row'>
        <InputAddress
          className='full'
          help={t('select the account you wish to sign data with')}
          isInput={false}
          label={t('account')}
          onChange={_onChangeAccount}
          type='account'
        />
      </div>
      <div className='toolbox--Sign-input'>
        <div className='ui--row'>
          <Input
            autoFocus
            className='full'
            help={t('The input data to sign. This can be either specified as a hex value (0x-prefix) or as a string.')}
            label={t('sign the following data')}
            onChange={_onChangeData}
            value={data}
          />
        </div>
        <div className='ui--row'>
          <Static
            className='medium'
            help={t('Detection on the input string to determine if it is hex or non-hex.')}
            label={t('hex input data')}
            value={
              isHexData
                ? t('Yes')
                : t('No')
            }
          />
        </div>
        <div className='ui--row'>
          <Output
            className='full'
            help={t('The resulting signature of the input data, as done with the crypto algorithm from the account. (This could be non-deterministic for some types such as sr25519).')}
            isHidden={signature.length === 0}
            isMonospace
            label={t('signature of supplied data')}
            value={signature}
            withCopy
          />
        </div>
        <div
          className='unlock-overlay'
          hidden={!isUsable || !isLocked || isInjected}
        >
          {isLocked && (
            <div className='unlock-overlay-warning'>
              <div className='unlock-overlay-content'>
                {t('You need to unlock this account to be able to sign data.')}<br/>
                <Button.Group>
                  <Button
                    isPrimary
                    onClick={_toggleUnlock}
                    label={t('Unlock account')}
                    icon='unlock'
                  />
                </Button.Group>
              </div>
            </div>
          )}
        </div>
        <div
          className='unlock-overlay'
          hidden={isUsable}
        >
          <div className='unlock-overlay-warning'>
            <div className='unlock-overlay-content'>
              {t('This external account cannot be used to sign data. Only Limited support is currently available for signing from any non-internal accounts.')}
            </div>
          </div>
        </div>
        {isUnlockVisible && (
          <Unlock
            onClose={_toggleUnlock}
            pair={currentPair}
          />
        )}
      </div>
      <Button.Group>
        <Button
          icon='privacy'
          isDisabled={isLocked}
          isPrimary
          label={t('Sign message')}
          onClick={_onSign}
        />
      </Button.Group>
    </div>
  );
}

export default translate(
  styled(Sign)`
    .toolbox--Sign-input {
      position: relative;
      width: 100%;
      height: 100%;

      .unlock-overlay {
        position: absolute;
        width: 100%;
        height: 100%;
        top:0;
        left:0;
        background-color: #0f0e0e7a;
      }

      .unlock-overlay-warning {
        display: flex;
        align-items: center;
        justify-content: center;
        height:100%;
      }

      .unlock-overlay-content {
        color:#fff;
        text-align:center;

        .ui--Button-Group {
          text-align: center;
        }
      }
    }
  `
);

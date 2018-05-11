// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import Button from 'semantic-ui-react/dist/es/elements/Button';

import Input from '@polkadot/ui-app/src/Input';
import Password from '@polkadot/ui-app/src/Password';
import keyring from '@polkadot/ui-keyring/src';
import isHex from '@polkadot/util/is/hex';
import hexToU8a from '@polkadot/util/hex/toU8a';
import u8aFromString from '@polkadot/util/u8a/fromString';
import u8aToHex from '@polkadot/util/u8a/toHex';
import keypairFromSeed from '@polkadot/util-crypto/nacl/keypair/fromSeed';
import randomBytes from '@polkadot/util-crypto/random/asU8a';
import addressEncode from '@polkadot/util-keyring/address/encode';

import Address from './Address';
import translate from './translate';

type Props = I18nProps & {
  onBack: () => void
};

type State = {
  address: string,
  fieldName: string,
  isNameValid: boolean,
  isSeedValid: boolean,
  isPassValid: boolean,
  isValid: boolean,
  name: string,
  password: string,
  seed: string
}

function formatSeed (seed: string): Uint8Array {
  return isHex(seed)
    ? hexToU8a(seed)
    : u8aFromString(seed.padEnd(32, ' '));
}

function addressFromSeed (seed: string): string {
  return addressEncode(
    keypairFromSeed(
      formatSeed(seed)
    ).publicKey
  );
}

class Creator extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = this.emptyState();
  }

  render (): React$Node {
    const { className, style, t } = this.props;
    const { address, fieldName, isNameValid, isPassValid, isSeedValid, isValid, name, password, seed } = this.state;

    return (
      <div
        className={['accounts--Creator', className].join(' ')}
        style={style}
      >
        <div className='ui--grid'>
          <Address
            className='medium'
            value={
              isSeedValid
                ? address
                : null
            }
          />
          <div className='medium'>
            <div className='ui--row'>
              <Input
                className='full'
                isError={!isSeedValid}
                label={t('creator.seed', {
                  defaultValue: 'create from the following seed (hex or string)'
                })}
                name={`${fieldName}_seed`}
                onChange={this.onChangeSeed}
                value={seed}
              />
            </div>
            <div className='ui--row'>
              <Input
                className='full'
                isError={!isNameValid}
                label={t('creator.name', {
                  defaultValue: 'name the account'
                })}
                name={`${fieldName}_name`}
                onChange={this.onChangeName}
                value={name}
              />
            </div>
            <div className='ui--row'>
              <Password
                className='full'
                isError={!isPassValid}
                label={t('creator.password', {
                  defaultValue: 'encrypt it using the password'
                })}
                name={`${fieldName}_pass`}
                onChange={this.onChangePass}
                value={password}
              />
            </div>
          </div>
        </div>
        <div className='ui--row-buttons'>
          <Button
            onClick={this.onDiscard}
          >
            {t('creator.discard', {
              defaultValue: 'Reset'
            })}
          </Button>
          <Button
            disabled={!isValid}
            onClick={this.onCommit}
            primary
          >
            {t('creator.save', {
              defaultValue: 'Save'
            })}
          </Button>
        </div>
      </div>
    );
  }

  emptyState (): State {
    const seed = u8aToHex(randomBytes());
    const address = addressFromSeed(seed);

    return {
      address,
      fieldName: `field_${Date.now()}`,
      isNameValid: true,
      isPassValid: false,
      isSeedValid: true,
      isValid: false,
      name: 'new keypair',
      password: '',
      seed
    };
  }

  nextState (newState: $Shape<State>): void {
    this.setState(
      (prevState: State, props: Props): $Shape<State> => {
        const { name = prevState.name, password = prevState.password, seed = prevState.seed } = newState;
        let address = prevState.address;
        const isNameValid = !!name;
        const isSeedValid = isHex(seed)
          ? seed.length === 66
          : seed.length <= 32;
        const isPassValid = password.length > 0 && password.length <= 32;

        if (isSeedValid && seed !== prevState.seed) {
          address = addressFromSeed(seed);
        }

        return {
          address,
          isNameValid,
          isPassValid,
          isSeedValid,
          isValid: isNameValid && isPassValid && isSeedValid,
          name,
          password,
          seed
        };
      }
    );
  }

  onChangeSeed = (seed: string): void => {
    this.nextState({ seed });
  }

  onChangeName = (name: string): void => {
    this.nextState({ name });
  }

  onChangePass = (password: string): void => {
    this.nextState({ password });
  }

  onCommit = (): void => {
    const { onBack } = this.props;
    const { name, password, seed } = this.state;

    keyring.createAccount(
      formatSeed(seed), password, { name }
    );

    onBack();
  }

  onDiscard = (): void => {
    this.setState(this.emptyState());
  }
}

export default translate(Creator);

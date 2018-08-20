// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringOptions, KeyringOptionsSection, KeyringOption$Type } from '@polkadot/ui-keyring/options/types';
import { BareProps } from '../types';

import './InputAddress.css';

import React from 'react';
import store from 'store';
import keyring from '@polkadot/ui-keyring/index';
import createOptionHeader from '@polkadot/ui-keyring/options/header';
import addressDecode from '@polkadot/util-keyring/address/decode';
import addressEncode from '@polkadot/util-keyring/address/encode';
import { optionsSubject } from '@polkadot/ui-keyring/options';
import makeOption from '@polkadot/ui-keyring/options/item';
import withObservableBase from '@polkadot/ui-react-rx/with/observableBase';
import isHex from '@polkadot/util/is/hex';
import hexToU8a from '@polkadot/util/hex/toU8a';

import Dropdown from '../Dropdown';
import classes from '../util/classes';
import addressToAddress from '../util/toAddress';

type Props = BareProps & {
  defaultValue?: string | Uint8Array | null,
  hideAddress?: boolean;
  isDisabled?: boolean,
  isError?: boolean,
  isInput?: boolean,
  label?: string,
  onChange: (value: Uint8Array) => void,
  optionsAll?: KeyringOptions,
  placeholder?: string,
  type?: KeyringOption$Type,
  value?: string | Uint8Array,
  withLabel?: boolean
};

type State = {
  defaultValue: string | undefined,
  options: KeyringOptions,
  value?: string
};

const RECENT_KEY = 'header-recent';
const STORAGE_KEY = 'options:InputAddress';
const DEFAULT_TYPE = 'all';

const transform = (value: string): Uint8Array => {
  if (isHex(value)) {
    return hexToU8a(value);
  }

  try {
    return addressDecode(value);
  } catch (error) {
    return new Uint8Array([]);
  }
};

class InputAddress extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    const defaultValue = addressToAddress(props.defaultValue as string);
    const lastValue = this.getLastValue();

    this.state = {
      defaultValue: this.props.isDisabled
        ? defaultValue
        : (lastValue || defaultValue)
    } as State;
  }

  static getDerivedStateFromProps ({ value }: Props): State | null {
    try {
      return {
        value: addressToAddress(value) || undefined
      } as State;
    } catch (error) {
      return null;
    }
  }

  private readOptions () {
    return store.get(STORAGE_KEY) || { defaults: {} };
  }

  private getLastValue () {
    const options = this.readOptions();

    return options.defaults[this.props.type || DEFAULT_TYPE];
  }

  render () {
    const { className, hideAddress = false, isDisabled = false, isError, label, optionsAll, type = DEFAULT_TYPE, style, withLabel } = this.props;
    const { defaultValue, value } = this.state;

    if (!optionsAll) {
      return null;
    }

    const options = optionsAll[type];
    const hasValue = !!options.find(({ key }) =>
      key === defaultValue
    );

    return (
      <Dropdown
        className={classes('ui--InputAddress', hideAddress ? 'flag--hideAddress' : '', className)}
        defaultValue={
          value !== undefined
            ? undefined
            : (
              hasValue
                ? defaultValue
                : this.props.defaultValue
            )
        }
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        onChange={this.onChange}
        onSearch={this.onSearch}
        options={
          isDisabled && !hasValue && defaultValue
            ? [makeOption(defaultValue)]
            : options
        }
        style={style}
        value={value}
        withLabel={withLabel}
      />
    );
  }

  onChange = (address: string) => {
    const { onChange, type = DEFAULT_TYPE } = this.props;
    const options = this.readOptions();

    options.defaults[type] = address;
    store.set(STORAGE_KEY, options);

    onChange(transform(address));
  }

  onSearch = (filteredOptions: KeyringOptionsSection, query: string): KeyringOptionsSection => {
    const { isInput = true } = this.props;
    const queryLower = query.toLowerCase();
    const matches = filteredOptions.filter((item) =>
      item.value === null ||
      item.name.toLowerCase().indexOf(queryLower) !== -1 ||
      item.value.toLowerCase().indexOf(queryLower) !== -1
    );

    const valueMatches = matches.filter((item) =>
      item.value !== null
    );

    if (isInput && valueMatches.length === 0) {
      const publicKey = transform(query);

      if (publicKey.length === 32) {
        if (!matches.find((item) => item.key === RECENT_KEY)) {
          matches.push(
            createOptionHeader('Recent')
          );
        }

        matches.push(
          keyring.saveRecent(
            addressEncode(publicKey)
          ).option
        );
      }
    }

    return matches.filter((item, index) => {
      const isLast = index === matches.length - 1;
      const nextItem = matches[index + 1];
      const hasNext = nextItem && nextItem.value;

      return item.value !== null || (!isLast && hasNext);
    });
  }
}

// @ts-ignore There are still some issues with props and types - this is valid
export default withObservableBase(optionsSubject, { propName: 'optionsAll' })(InputAddress);

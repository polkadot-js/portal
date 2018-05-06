// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

// TODO: We have a lot shared between this and InputExtrinsic

import type { StorageDef$Key, StateDb$SectionNames } from '@polkadot/storage/types';
import type { I18nProps } from '../types';

import './InputStorage.css';

import React from 'react';
import map from '@polkadot/storage-substrate/keys';

import doChange from '../util/doChange';
import translate from '../translate';
import SelectKey from './SelectKey';
import SelectSection from './SelectSection';
import keyOptions from './options/key';

type Props = I18nProps & {
  defaultValue: StorageDef$Key,
  isError?: boolean,
  labelMethod?: string,
  labelSection?: string,
  onChange?: (value: StorageDef$Key) => void | rxjs$Subject<StorageDef$Key>,
};

type State = {
  value: StorageDef$Key
};

class InputStorage extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      value: this.props.defaultValue
    };
  }

  onKeyChange = (value: StorageDef$Key): void => {
    const { onChange } = this.props;

    doChange(value, onChange);
    this.setState({ value });
  }

  onSectionChange = (section: StateDb$SectionNames): void => {
    const { onChange } = this.props;

    if (this.state.value.section === section) {
      return;
    }

    const options = keyOptions(section);
    // $FlowFixMe we have string to be generic, but...
    const value = map[section].keys[options[0].value];

    doChange(value, onChange);
    this.setState({ value });
  }

  render (): React$Node {
    const { className, labelMethod, labelSection, style } = this.props;
    const { value } = this.state;

    return (
      <div
        className={['ui--InputStorage', 'ui--form', className].join(' ')}
        style={style}
      >
        <div className='small'>
          <SelectSection
            label={labelSection}
            onChange={this.onSectionChange}
            value={value}
          />
        </div>
        <div className='large'>
          <SelectKey
            label={labelMethod}
            onChange={this.onKeyChange}
            value={value}
          />
        </div>
      </div>
    );
  }
}

export default translate(InputStorage);

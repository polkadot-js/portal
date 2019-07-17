// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-api/types';
import { DropdownOptions } from '../util/types';
import { I18nProps } from '../types';
import { Value } from './types';

import '../InputExtrinsic/InputExtrinsic.css';

import React from 'react';
import { withApi, withMulti } from '@polkadot/ui-api';

import Labelled from '../Labelled';
import translate from '../translate';
import SelectKey from './SelectKey';
import SelectSection from './SelectSection';
import keyOptions from './options/key';
import sectionOptions from './options/section';

type Props = ApiProps & I18nProps & {
  defaultValue: Value;
  help?: React.ReactNode;
  isError?: boolean;
  label: React.ReactNode;
  onChange?: (value: Value) => void;
  withLabel?: boolean;
};

interface State {
  optionsMethod: DropdownOptions;
  optionsSection: DropdownOptions;
  value: Value;
}

class InputConsts extends React.PureComponent<Props, State> {
  public state: State;

  public constructor (props: Props) {
    super(props);

    const { api, defaultValue: { method, section } } = this.props;
    const firstSec = Object.keys(api.consts)[0];
    const firstMet = Object.keys(api.consts[firstSec])[0];

    this.state = {
      optionsMethod: keyOptions(api, section),
      optionsSection: sectionOptions(api),
      value: (api.consts[section] && api.consts[section][method])
        ? { method, section }
        : { method: firstMet, section: firstSec }
    };
  }

  public render (): React.ReactNode {
    const { className, help, label, style, withLabel } = this.props;
    const { optionsMethod, optionsSection, value } = this.state;

    return (
      <div
        className={className}
        style={style}
      >
        <Labelled
          help={help}
          label={label}
          withLabel={withLabel}
        >
          <div className=' ui--DropdownLinked ui--row'>
            <SelectSection
              className='small'
              onChange={this.onSectionChange}
              options={optionsSection}
              value={value}
            />
            <SelectKey
              className='large'
              onChange={this.onKeyChange}
              options={optionsMethod}
              value={value}
            />
          </div>
        </Labelled>
      </div>
    );
  }

  private onKeyChange = (newValue: Value): void => {
    const { onChange } = this.props;
    const { value } = this.state;

    if (value.section === newValue.section && value.method === newValue.method) {
      return;
    }

    this.setState({ value: newValue }, (): void =>
      onChange && onChange(newValue)
    );
  }

  private onSectionChange = (newSection: string): void => {
    const { api } = this.props;
    const { value } = this.state;

    if (newSection === value.section) {
      return;
    }

    const optionsMethod = keyOptions(api, newSection);
    const newValue = { method: optionsMethod[0].value, section: newSection };

    this.setState({ optionsMethod }, (): void =>
      this.onKeyChange(newValue)
    );
  }
}

export default withMulti(
  InputConsts,
  translate,
  withApi
);

// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { WithTranslation } from 'react-i18next';
import { Props as BareProps, RawParam } from '../types';

import React from 'react';
import { Static } from '@polkadot/ui-app';
import translate from '@polkadot/ui-app/translate';

import Bare from './Bare';
import BaseBytes from './BaseBytes';

type Props = BareProps & WithTranslation & {
  defaultValue: RawParam,
  withLabel?: boolean
};

class Unknown extends React.PureComponent<Props> {
  render () {
    const { className, defaultValue, isDisabled, isError, label, name, onChange, onEnter, style, t, type } = this.props;

    if (isDisabled) {
      const value = defaultValue && defaultValue.value && defaultValue.value.toString();

      return (
        <Bare
          className={className}
          style={style}
        >
          <Static
            className='full'
            label={label}
            value={value || t('empty')}
          />
        </Bare>
      );
    }

    return (
      <BaseBytes
        className={className}
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        length={-1}
        name={name}
        onChange={onChange}
        onEnter={onEnter}
        size='full'
        style={style}
        type={type}
        withLength={false}
      />
    );
  }
}

export default translate(Unknown);

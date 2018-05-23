// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { InterfaceMethodDefinition, InterfaceTypes } from '@polkadot/jsonrpc/types';
import type { I18nProps } from '../types';

import React from 'react';

import Dropdown from '../Dropdown';
import classes from '../util/classes';
import translate from '../translate';

type Props = I18nProps & {
  defaultValue?: InterfaceTypes,
  isError?: boolean,
  label: string,
  onChange: (value: InterfaceTypes) => void,
  options: Array<any>,
  value: InterfaceMethodDefinition,
  withLabel?: boolean
};

function SelectSection ({ className, defaultValue, isError, label, onChange, options, style, t, value: { section }, withLabel }: Props): React$Node {
  return (
    <Dropdown
      className={classes('ui--DropdownLinked-Sections', className)}
      defaultValue={defaultValue}
      isError={isError}
      label={label || t('input.rpc.section', {
        defaultValue: 'rpc area'
      })}
      onChange={onChange}
      options={options}
      style={style}
      value={section}
      withLabel={withLabel}
    />
  );
}

export default translate(SelectSection);

// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic$Method, Extrinsic$Sections } from '@polkadot/extrinsics/types';
import type { I18nProps } from '../types';
import type { DropdownOptions } from './types';

import React from 'react';

import Dropdown from '../Dropdown';
import classes from '../util/classes';
import translate from '../translate';

type Props = I18nProps & {
  defaultValue?: Extrinsic$Sections,
  isError?: boolean,
  label?: string,
  onChange: (value: Extrinsic$Sections) => void,
  options: DropdownOptions,
  value: Extrinsic$Method,
  withLabel?: boolean
};

function SelectSection ({ className, defaultValue, isError, label = '', onChange, options, style, t, value: { section }, withLabel }: Props): React$Node {
  return (
    <Dropdown
      className={classes('ui--DropdownLinked-Sections', className)}
      defaultValue={defaultValue}
      isError={isError}
      label={label || t('input.extrinsic.section', {
        defaultValue: 'from extrinsic section'
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

// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Param$Type, Param$Types } from '@polkadot/params/types';
import type { BareProps } from '../types';

export type RawParam = {
  isValid: boolean,
  value: mixed,
}

export type RawParams = Array<RawParam>;

export type BaseProps$Options = {
  initValue?: mixed,
  minValue?: mixed,
  maxValue?: mixed
};

export type BaseProps = BareProps & {
  onChange: (index: number, value: RawParam) => void,
  value: {
    name: string,
    options?: BaseProps$Options,
    type: Param$Types
  }
};

export type Props = BaseProps & {
  isDisabled?: boolean,
  isError?: boolean,
  index: number,
  label: string,
  withLabel?: boolean
};

export type Size = 'full' | 'large' | 'medium' | 'small';

export type ComponentTyped = {
  Component: React$ComponentType<Props>,
  type: Param$Type
};
export type ComponentTyped$Array = Array<ComponentTyped | ComponentTyped$Array>;
export type ComponentsTyped = ComponentTyped | ComponentTyped$Array;

export type ComponentMap = {
  [Param$Type]: React$ComponentType<Props>
};

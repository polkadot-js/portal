// Copyright 2017-2018 @polkadot/ui-app authors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

export type DropdownOption = {
  className?: string,
  key?: string,
  text: string | React$Node,
  value: string
};

export type DropdownOptions = Array<DropdownOption>;

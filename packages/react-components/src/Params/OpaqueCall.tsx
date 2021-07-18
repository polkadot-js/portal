// Copyright 2017-2021 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { Props, RawParam } from '@polkadot/react-params/types';

import React, { useCallback } from 'react';

import { useApi } from '@polkadot/react-hooks';

import ExtrinsicDisplay from './Extrinsic';

function OpaqueCall ({ className = '', isDisabled, isError, label, onChange, onEnter, onEscape, withLabel }: Props): React.ReactElement<Props> {
  const { apiDefaultTxSudo } = useApi();

  const _onChange = useCallback(
    ({ isValid, value }: RawParam) =>
      onChange && onChange({
        isValid,
        value: (isValid && value)
          ? (value as SubmittableExtrinsic<'promise'>).method.toHex()
          : null
      }),
    [onChange]
  );

  return (
    <ExtrinsicDisplay
      className={className}
      defaultValue={apiDefaultTxSudo}
      isDisabled={isDisabled}
      isError={isError}
      isPrivate
      label={label}
      onChange={_onChange}
      onEnter={onEnter}
      onEscape={onEscape}
      withLabel={withLabel}
    />
  );
}

export default React.memo(OpaqueCall);

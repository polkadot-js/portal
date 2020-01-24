// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringPair } from '@polkadot/keyring/types';

import React, { useState } from 'react';
import { Password } from '@polkadot/react-components';
import keyring from '@polkadot/ui-keyring';

import { useTranslation } from './translate';
import UnlockError from './UnlockError';

interface Props {
  autoFocus?: boolean;
  error?: string;
  onChange: (password: string) => void;
  onEnter?: () => void;
  password: string;
  tabIndex?: number;
  value?: string | null;
}

function getPair (address?: string | null): KeyringPair | null {
  try {
    return keyring.getPair(address as string);
  } catch (error) {
    return null;
  }
}

export default function Unlock ({ autoFocus, error, onChange, onEnter, password, tabIndex, value }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [pair] = useState<KeyringPair | null>(getPair(value));

  if (!pair || !(pair.isLocked) || pair.meta.isInjected) {
    return null;
  }

  return (
    <div className='ui--signer-Signer-Unlock'>
      <Password
        autoFocus={autoFocus}
        isError={!!error}
        isFull
        label={t('unlock account with password')}
        labelExtra={<UnlockError unlockError={error} />}
        onChange={onChange}
        onEnter={onEnter}
        tabIndex={tabIndex}
        value={password}
      />
    </div>
  );
}

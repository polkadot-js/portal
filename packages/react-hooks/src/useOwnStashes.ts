// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { AccountId, StakingLedger } from '@polkadot/types/interfaces';

import { useMemo } from 'react';

import { useAccounts } from './useAccounts';
import { useApi } from './useApi';
import { useCall } from './useCall';

type IsInKeyring = boolean;

function getStashes (allAccounts: string[], ownBonded: Option<AccountId>[], ownLedger: Option<StakingLedger>[]): [string, IsInKeyring][] {
  const result: [string, IsInKeyring][] = [];

  ownBonded.forEach((value, index): void => {
    value.isSome && result.push([allAccounts[index], true]);
  });

  ownLedger.forEach((ledger): void => {
    if (ledger.isSome) {
      const stashId = ledger.unwrap().stash.toString();

      !result.some(([accountId]) => accountId === stashId) && result.push([stashId, false]);
    }
  });

  return result;
}

export function useOwnStashes (): [string, IsInKeyring][] | undefined {
  const { allAccounts, areAccountsLoaded, hasAccounts } = useAccounts();
  const { api } = useApi();
  const ownBonded = useCall<Option<AccountId>[]>(hasAccounts && api.query.staking?.bonded.multi, [allAccounts]);
  const ownLedger = useCall<Option<StakingLedger>[]>(hasAccounts && api.query.staking?.ledger.multi, [allAccounts]);

  return useMemo(
    () => areAccountsLoaded && ownBonded && ownLedger
      ? hasAccounts
        ? getStashes(allAccounts, ownBonded, ownLedger)
        : []
      : undefined,
    [areAccountsLoaded, allAccounts, hasAccounts, ownBonded, ownLedger]
  );
}

export function useOwnStashIds (): string[] | undefined {
  const ownStashes = useOwnStashes();

  return useMemo(
    () => ownStashes
      ? ownStashes.map(([stashId]) => stashId)
      : undefined,
    [ownStashes]
  );
}

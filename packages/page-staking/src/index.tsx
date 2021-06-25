// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakingOverview } from '@polkadot/api-derive/types';
import type { AppProps as Props, ThemeProps } from '@polkadot/react-components/types';
import type { ElectionStatus, ParaValidatorIndex, ValidatorId } from '@polkadot/types/interfaces';

import React, { useCallback, useMemo, useState } from 'react';
import { Route, Switch } from 'react-router';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { HelpOverlay, Tabs } from '@polkadot/react-components';
import { useAccounts, useApi, useAvailableSlashes, useCall, useCallMulti, useFavorites, useOwnStashInfos } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

import basicMd from './md/basic.md';
import Summary from './Overview/Summary';
import Actions from './Actions';
import ActionsBanner from './ActionsBanner';
import { STORE_FAVS_BASE } from './constants';
import Overview from './Overview';
import Payouts from './Payouts';
import Query from './Query';
import Slashes from './Slashes';
import Targets from './Targets';
import { useTranslation } from './translate';
import useSortedTargets from './useSortedTargets';

const HIDDEN_ACC = ['actions', 'payout'];

const optionsParaValidators = {
  defaultValue: [false, {}] as [boolean, Record<string, boolean>],
  transform: ([eraElectionStatus, validators, activeValidatorIndices]: [ElectionStatus | null, ValidatorId[] | null, ParaValidatorIndex[] | null]): [boolean, Record<string, boolean>] => [
    !!eraElectionStatus && eraElectionStatus.isOpen,
    validators && activeValidatorIndices
      ? activeValidatorIndices.reduce((all, index) => ({ ...all, [validators[index.toNumber()].toString()]: true }), {})
      : {}
  ]
};

function StakingApp ({ basePath, className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { areAccountsLoaded, hasAccounts } = useAccounts();
  const { pathname } = useLocation();
  const [withLedger, setWithLedger] = useState(false);
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS_BASE);
  const stakingOverview = useCall<DeriveStakingOverview>(api.derive.staking.overview);
  const [isInElection, paraValidators] = useCallMulti<[boolean, Record<string, boolean>]>([
    api.query.staking.eraElectionStatus,
    api.query.session.validators,
    (api.query.parasShared || api.query.shared)?.activeValidatorIndices
  ], optionsParaValidators);
  const { isLoadingStashes, ownStashes } = useOwnStashInfos();
  const slashes = useAvailableSlashes();
  const targets = useSortedTargets(favorites, withLedger);

  const hasQueries = useMemo(
    () => hasAccounts && !!(api.query.imOnline?.authoredBlocks) && !!(api.query.staking.activeEra),
    [api, hasAccounts]
  );

  const ownValidators = useMemo(
    () => isLoadingStashes
      ? undefined
      : (ownStashes || []).filter(({ isStashValidating }) => isStashValidating),
    [isLoadingStashes, ownStashes]
  );

  const toggleLedger = useCallback(
    () => setWithLedger(true),
    []
  );

  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Overview')
    },
    {
      name: 'actions',
      text: t<string>('Account actions')
    },
    isFunction(api.query.staking.activeEra) && hasAccounts && ownStashes && (ownStashes.length !== 0) && {
      name: 'payout',
      text: t<string>('Payouts')
    },
    {
      alias: 'returns',
      name: 'targets',
      text: t<string>('Targets')
    },
    {
      name: 'waiting',
      text: t<string>('Waiting')
    },
    {
      count: slashes.reduce((count, [, unapplied]) => count + unapplied.length, 0),
      name: 'slashes',
      text: t<string>('Slashes')
    },
    {
      hasParams: true,
      name: 'query',
      text: t<string>('Validator stats')
    }
  ].filter((q): q is { name: string; text: string } => !!q), [api, hasAccounts, ownStashes, slashes, t]);

  return (
    <main className={`staking--App ${className}`}>
      <HelpOverlay md={basicMd as string} />
      <Tabs
        basePath={basePath}
        hidden={
          areAccountsLoaded && !hasAccounts
            ? HIDDEN_ACC
            : undefined
        }
        items={items}
      />
      <Summary
        isVisible={pathname === basePath}
        stakingOverview={stakingOverview}
        targets={targets}
      />
      <Switch>
        <Route path={`${basePath}/payout`}>
          <Payouts
            isInElection={isInElection}
            ownValidators={ownValidators}
          />
        </Route>
        <Route path={[`${basePath}/query/:value`, `${basePath}/query`]}>
          <Query />
        </Route>
        <Route path={`${basePath}/slashes`}>
          <Slashes
            ownStashes={ownStashes}
            slashes={slashes}
          />
        </Route>
        <Route path={`${basePath}/targets`}>
          <Targets
            isInElection={isInElection}
            ownStashes={ownStashes}
            stakingOverview={stakingOverview}
            targets={targets}
            toggleFavorite={toggleFavorite}
            toggleLedger={toggleLedger}
          />
        </Route>
        <Route path={`${basePath}/waiting`}>
          <Overview
            favorites={favorites}
            hasQueries={hasQueries}
            isIntentions
            stakingOverview={stakingOverview}
            targets={targets}
            toggleFavorite={toggleFavorite}
            toggleLedger={toggleLedger}
          />
        </Route>
      </Switch>
      <Actions
        className={pathname === `${basePath}/actions` ? '' : 'staking--hidden'}
        isInElection={isInElection}
        ownStashes={ownStashes}
        targets={targets}
      />
      {basePath === pathname && hasAccounts && (ownStashes?.length === 0) && (
        <ActionsBanner />
      )}
      <Overview
        className={basePath === pathname ? '' : 'staking--hidden'}
        favorites={favorites}
        hasQueries={hasQueries}
        paraValidators={paraValidators}
        stakingOverview={stakingOverview}
        targets={targets}
        toggleFavorite={toggleFavorite}
      />
    </main>
  );
}

export default React.memo(styled(StakingApp)(({ theme }: ThemeProps) => `
  .staking--hidden {
    display: none;
  }

  .staking--Chart {
    margin-top: 1.5rem;

    h1 {
      margin-bottom: 0.5rem;
    }

    .ui--Spinner {
      margin: 2.5rem auto;
    }
  }

  .staking--optionsBar {
    margin: 0.5rem 0 1rem;
    text-align: center;
    white-space: normal;

    .staking--buttonToggle {
      display: inline-block;
      margin-right: 1rem;
      margin-top: 0.5rem;
    }
  }

  .ui--Expander.stakeOver {
    .ui--Expander-summary {
      color: var(--color-error);

    ${theme.theme === 'dark'
    ? `font-weight: bold;
      .ui--FormatBalance-value {

        > .ui--FormatBalance-postfix {
          opacity: 1;
        }
      }`
    : ''};
    }
  }
`));

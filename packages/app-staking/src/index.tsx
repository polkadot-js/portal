// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalancesMap } from '@polkadot/api-derive/types';
import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { ComponentProps, Nominators } from './types';

import React from 'react';
import { Route, Switch } from 'react-router';
import { AccountId, Balance, Exposure } from '@polkadot/types';
import Tabs, { TabItem } from '@polkadot/ui-app/Tabs';
import { withCalls, withMulti } from '@polkadot/ui-api';

import './index.css';

import StakeList from './StakeList';
import Overview from './Overview';
import translate from './translate';

type Props = AppProps & ApiProps & I18nProps & {
  balances?: DerivedBalancesMap,
  session_validators?: Array<AccountId>,
  staking_validators?: [Array<AccountId>],
  staking_stakers?: [Array<AccountId>, Array<Exposure>]
};

type State = {
  intentions: Array<string>,
  nominators: Nominators,
  tabs: Array<TabItem>,
  validators: Array<string>
};

class App extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    const { t } = props;

    this.state = {
      intentions: [],
      nominators: {},
      tabs: [
        {
          name: 'overview',
          text: t('Staking Overview')
        },
        {
          name: 'actions',
          text: t('Account Actions')
        }
      ],
      validators: []
    };
  }

  static getDerivedStateFromProps ({ session_validators = [], staking_stakers = [[], []], staking_validators = [[]] }: Props): State {
    console.error('staking_stakers', JSON.stringify(staking_stakers));

    return {
      intentions: staking_validators[0].map((accountId) =>
        accountId.toString()
      ),
      validators: session_validators.map((authorityId) =>
        authorityId.toString()
      )
    } as State;
  }

  render () {
    const { tabs } = this.state;
    const { basePath } = this.props;

    return (
      <main className='staking--App'>
        <header>
          <Tabs
            basePath={basePath}
            items={tabs}
          />
        </header>
        <Switch>
          <Route path={`${basePath}/actions`} render={this.renderComponent(StakeList)} />
          <Route render={this.renderComponent(Overview)} />
        </Switch>
      </main>
    );
  }

  private renderComponent (Component: React.ComponentType<ComponentProps>) {
    return (): React.ReactNode => {
      const { intentions, validators } = this.state;
      const { balances = {} } = this.props;

      return (
        <Component
          balances={balances}
          balanceArray={this.balanceArray}
          intentions={intentions}
          validators={validators}
        />
      );
    };
  }

  private balanceArray = (_address: AccountId | string): Array<Balance> | undefined => {
    const { balances = {} } = this.props;

    if (!_address) {
      return undefined;
    }

    const address = _address.toString();

    return balances[address]
      ? [
        balances[address].stakingBalance,
        balances[address].nominatedBalance
      ]
      : undefined;
  }
}

export default withMulti(
  App,
  translate,
  withCalls<Props>(
    'query.session.validators',
    'query.staking.stakers',
    'query.staking.validators',
    ['derive.staking.intentionsBalances', { propName: 'balances' }]
  )
);

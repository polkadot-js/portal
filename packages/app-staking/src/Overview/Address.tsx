// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalancesMap } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { Nominators, RecentlyOfflineMap } from '../types';

import BN from 'bn.js';
import React from 'react';
import { AccountId, Balance, Option, StakingLedger } from '@polkadot/types';
import { withCalls, withMulti } from '@polkadot/ui-api/with';
import { AddressMini, AddressRow } from '@polkadot/ui-app';
import keyring from '@polkadot/ui-keyring';
import { formatBalance, formatNumber } from '@polkadot/util';

import RecentlyOffline from '../RecentlyOffline';

import translate from '../translate';

type Props = I18nProps & {
  address: string,
  balances: DerivedBalancesMap,
  balanceArray: (_address: AccountId | string) => Array<Balance> | undefined,
  defaultName: string,
  isAuthor: boolean,
  lastBlock: string,
  nominators: Nominators,
  recentlyOffline: RecentlyOfflineMap,
  session_nextKeyFor?: Option<AccountId>,
  staking_bonded?: Option<AccountId>,
  staking_ledger?: Option<StakingLedger>
};

type State = {
<<<<<<< HEAD
  bondedId: string,
  stashActive: string | null,
  stashTotal: string | null,
  stashId: string | null,
  sessionId: string | null,
  badgeExpanded: boolean;
};

class Address extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      bondedId: props.address,
      sessionId: null,
      stashActive: null,
      stashTotal: null,
      stashId: null,
      badgeExpanded: false
    };
  }
=======
  stashId: string | null
};

class Address extends React.PureComponent<Props, State> {
  state: State = {
    stashId: null
  };

  static getDerivedStateFromProps ({ staking_ledger }: Props): State | null {
    if (!staking_ledger || staking_ledger.isNone) {
      return null;
    }
>>>>>>> recently offline on own accounts

  static getDerivedStateFromProps ({ session_nextKeyFor, staking_bonded, staking_ledger }: Props, prevState: State): State | null {
    const ledger = staking_ledger
      ? staking_ledger.unwrapOr(null)
      : null;
    return {
      bondedId: !staking_bonded || staking_bonded.isNone
        ? prevState.bondedId
        : staking_bonded.unwrap().toString(),
      sessionId: !session_nextKeyFor || session_nextKeyFor.isNone
        ? prevState.sessionId
        : session_nextKeyFor.unwrap().toString(),
      stashActive: !ledger
        ? prevState.stashActive
        : formatBalance(ledger.active),
      stashTotal: !ledger
        ? prevState.stashTotal
        : formatBalance(ledger.total),
      stashId: !ledger
        ? prevState.stashId
        : ledger.stash.toString()
    } as State;
  }

  render () {
    const { isAuthor, lastBlock } = this.props;
    const { bondedId, stashActive, stashId } = this.state;

    return (
      <article key={stashId || bondedId}>
        <AddressRow
          extraInfo={stashActive ? `bonded ${stashActive}` : undefined}
          name={this.getDisplayName()}
          value={stashId}
          withCopy={false}
          withNonce={false}
        >
          {this.renderKeys()}
          {this.renderNominators()}
          {this.renderOffline()}
        </AddressRow>
        <div
          className={['blockNumber', isAuthor ? 'latest' : ''].join(' ')}
          key='lastBlock'
        >
          {isAuthor ? lastBlock : ''}
        </div>
      </article>
    );
  }

  private getDisplayName = (): string | undefined => {
    const { defaultName } = this.props;
    const { stashId } = this.state;

    if (!stashId) {
      return defaultName;
    }

    const pair = keyring.getAccount(stashId).isValid()
      ? keyring.getAccount(stashId)
      : keyring.getAddress(stashId);

    return pair.isValid()
      ? (pair.getMeta().name || defaultName)
      : defaultName;
  }

<<<<<<< HEAD
  private toggleBadge = (): void => {
    const { badgeExpanded } = this.state;

    this.setState({ badgeExpanded: !badgeExpanded });
  }

  private renderKeys () {
    const { t } = this.props;
    const { bondedId, sessionId } = this.state;
    const isSame = bondedId === sessionId;

    return (
      <div className='staking--accounts-info'>
        {bondedId
          ? (
            <div>
              <label className='staking--label'>{
                isSame
                  ? t('controller/session')
                  : t('controller')
              }</label>
              <AddressMini value={bondedId} />
            </div>
          )
          : null
        }
        {!isSame && sessionId
          ? (
            <div>
              <label className='staking--label'>{t('session')}</label>
              <AddressMini value={sessionId} />
            </div>
          )
          : null
        }
      </div>
    );
  }

=======
>>>>>>> recently offline on own accounts
  private renderNominators () {
    const { address, nominators, t } = this.props;
    const myNominators = Object.keys(nominators).filter((nominator) =>
      nominators[nominator].indexOf(address) !== -1
    );

    return (
      <details className='staking--Account-detail'>
        <summary>
          {t('Nominators ({{count}})', {
            replace: {
              count: myNominators.length
            }
          })}
        </summary>
        {myNominators.map((accountId) =>
          <AddressMini
            key={accountId.toString()}
            value={accountId}
            withBalance
          />
        )}
      </details>
    );
  }

  private renderOffline () {
    const { recentlyOffline } = this.props;
    const { stashId } = this.state;

    if (!stashId || !recentlyOffline[stashId]) {
      return null;
    }

<<<<<<< HEAD
    const offline = recentlyOffline[stashId];
    const count = offline.reduce((total, { count }) => total.add(count), new BN(0));

    const blockNumbers = offline.map(({ blockNumber }) => `#${formatNumber(blockNumber)}`);

    return (
      <div
        className={['recentlyOffline', badgeExpanded ? 'expand' : ''].join(' ')}
        onClick={this.toggleBadge}
      >
        <div className='badge'>
          {count.toString()}
        </div>
        <div className='detail'>
          {t('Reported offline {{count}} times, last at {{blockNumber}}', {
            replace: {
              count: count.toString(),
              blockNumber: blockNumbers[blockNumbers.length - 1]
            }
          })}
        </div>
      </div>
=======
    return (
      <RecentlyOffline
        offline={recentlyOffline[stashId]}
      />
>>>>>>> recently offline on own accounts
    );
  }
}

export default withMulti(
  Address,
  translate,
  withCalls<Props>(
    ['query.session.nextKeyFor', { paramName: 'address' }],
    ['query.staking.ledger', { paramName: 'address' }],
    ['query.staking.bonded', { paramName: 'address' }]
  )
);

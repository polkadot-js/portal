// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, AccountIndex, Address, Balance, BlockNumber, Option, StakingLedger, UnlockChunk } from '@polkadot/types';
import { BareProps, CallProps } from '@polkadot/ui-api/types';
import BN from 'bn.js';
import { formatBalance } from '@polkadot/util';
import { I18nProps } from '@polkadot/ui-app/types';
import React from 'react';
import translate from '@polkadot/ui-app/translate';
import { TxButton } from '@polkadot/ui-app';
import { withCalls } from '@polkadot/ui-api';

type Props = BareProps & CallProps & I18nProps & {
  balances_freeBalance?: BN,
  chain_bestNumber?: BN,
  controllerId?: AccountId,
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null,
  remainingLabel?: string,
  staking_ledger?: StakingLedger,
  session_eraLength?: BN,
  unlockings?: Array<UnlockChunk>
};

export class UnlockingDisplay extends React.PureComponent<Props> {

  render () {
    const { unlockings } = this.props;

    return unlockings ?
      <>
        {this.renderUnlockableSum()}
        {this.renderLocked()}
      </>
    : null ;
  }

  private groupByEra (list: UnlockChunk[]) {
    let eraMap: Map<string, Balance> = new Map<string, Balance>();

    list.map((el) => {
      // create a Map with unique eras as keys (Maps need a string|number as key)
      if (!eraMap.has(el.era.toString())) {
        eraMap.set(el.era.toString(),el.value);
      } else {
        // if the Map already has an entry for the era, sum the value
        const curr = eraMap.get(el.era.toString()) || new Balance(0);
        eraMap.set(el.era.toString(), curr.add(el.value));
      }
    });

    const groupedList: UnlockChunk[] = [];
    // reconstruct the UnlockChunk array
    for (let [eraString, sum] of eraMap) {
      groupedList.push(new UnlockChunk({ era: new BlockNumber(eraString), value: sum }));
    }

    return groupedList;
  }

  private remainingBlocks (era: BN) {
    const { chain_bestNumber, session_eraLength } = this.props;

    if (!chain_bestNumber || !session_eraLength || era.lten(0)) {
      return new BN(0);
    } else {
      const remaining = session_eraLength.mul(era).sub(chain_bestNumber);

      return remaining.lten(0) ? new BN(0) : remaining;
    }
  }

  private renderLocked () {
    const { className, controllerId, style, t, unlockings } = this.props;

    if (!unlockings || !controllerId) return null;
    const labels: {locked: string, remaining: string } = {
      locked: t('locked '),
      remaining: t(' blocks left')
    };
    // select the Unlockchunks that can't be unlocked yet.
    let lockedResults = unlockings.filter((chunk) => this.remainingBlocks(chunk.era).gtn(0));
    // group the Unlockchunks that have the same era and sum their values
    lockedResults = this.groupByEra(lockedResults);

    return (
      <div>
        {lockedResults.map((unlocking,index) => (
          <div
            className={className}
            style={style}
            key={index}
          >
            {labels.locked}{formatBalance(unlocking.value)} ({this.remainingBlocks(unlocking.era).toString()}{labels.remaining})
          </div>
        ))}
      </div>
    );
  }

  private renderUnlockableSum () {
    const { className, controllerId, style, t, unlockings } = this.props;

    if (!unlockings || !unlockings[0] || !controllerId) return null;

    const labelUnlockable = t('unlockable ');
    const unlockable = unlockings.filter((chunk) => this.remainingBlocks(chunk.era).eqn(0));
    const unlockableSum = unlockable.reduce(
      (curr, prev) => {
        return new UnlockChunk({ value: curr.value.add(prev.value) });
      }, new UnlockChunk({ value: new BN(0), era: new BN(0) })
    ).value;

    return (unlockableSum.gtn(0) ?
      <div
        className={className}
        style={style}
        key='unlockable'
      >
        {labelUnlockable}{formatBalance(unlockableSum)}
        <TxButton
          accountId={controllerId.toString()}
          className='withDrawUnbonded'
          icon='lock'
          size='small'
          isPrimary
          key='unlock'
          params={[]}
          tx='staking.withdrawUnbonded'
        />
      </div>
      : null
    );
  }
}

export default translate(
  withCalls<Props>(
    ['query.balances.freeBalance', { paramName: 'params' }],
    ['query.staking.bonded', {
      paramName: 'params',
      propName: 'controllerId',
      transform: (value) =>
        value.unwrapOr(null)
    }],
    ['query.staking.ledger', {
      paramName: 'controllerId',
      propName: 'unlockings',
      transform: (ledger: Option<StakingLedger>) =>
        ledger.unwrapOr({ unlocking: null }).unlocking
    }],
  'derive.session.eraLength',
  'derive.chain.bestNumber'
  )(UnlockingDisplay)
);

// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance, Points } from '@polkadot/types/interfaces';
import { DerivedStaking, DerivedStakingOnlineStatus, DerivedHeartbeats } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';
import { ValidatorFilter } from '../types';

import BN from 'bn.js';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ApiContext, withCalls, withMulti } from '@polkadot/react-api';
import { AddressCard, AddressMini, Badge, Icon, OnlineStatus } from '@polkadot/react-components';
import { classes } from '@polkadot/react-components/util';
import keyring from '@polkadot/ui-keyring';
import { formatNumber } from '@polkadot/util';
import { updateOnlineStatus } from '../util';

import translate from '../translate';

interface Props extends I18nProps {
  address: string;
  authorsMap: Record<string, string>;
  className?: string;
  currentElected: string[];
  defaultName: string;
  filter: ValidatorFilter;
  lastAuthor?: string;
  points?: Points;
  recentlyOnline?: DerivedHeartbeats;
  stakingInfo?: DerivedStaking;
  withNominations?: boolean;
}

interface StakingState {
  balanceOpts: { bonded: boolean | BN[] };
  controllerId?: string;
  hasNominators: boolean;
  isNominatorMe: boolean;
  isSelected: boolean;
  nominators: [AccountId, Balance][];
  // stashActive: string | null;
  // stashTotal: string | null;
  sessionId?: string;
  stashId?: string;
}

interface OnlineState {
  hasOfflineWarnings: boolean;
  onlineStatus: DerivedStakingOnlineStatus;
}

const WITH_VALIDATOR_PREFS = { validatorPayment: true };

function Address ({ address, authorsMap, className, currentElected, defaultName, filter, lastAuthor, points, recentlyOnline, stakingInfo, t, withNominations }: Props): React.ReactElement<Props> | null {
  const { isSubstrateV2 } = useContext(ApiContext);
  const [extraInfo, setExtraInfo] = useState<[React.ReactNode, React.ReactNode][] | undefined>();
  const [{ hasOfflineWarnings, onlineStatus }, setOnlineStatus] = useState<OnlineState>({
    hasOfflineWarnings: false,
    onlineStatus: {}
  });
  const [{ balanceOpts, controllerId, hasNominators, isNominatorMe, isSelected, nominators, sessionId, stashId }, setStakingState] = useState<StakingState>({
    balanceOpts: { bonded: true },
    hasNominators: false,
    isNominatorMe: false,
    isSelected: false,
    nominators: []
    // stashActive: null,
    // stashTotal: null
  });

  useEffect((): void => {
    if (points) {
      const formatted = formatNumber(points);

      if (!extraInfo || extraInfo[0][1] !== formatted) {
        setExtraInfo([[t('era points'), formatted]]);
      }
    }
  }, [extraInfo, points]);

  useEffect((): void => {
    if (stakingInfo) {
      const { controllerId, nextSessionId, stakers, stashId } = stakingInfo;
      const nominators = withNominations && stakers
        ? stakers.others.map(({ who, value }): [AccountId, Balance] => [who, value.unwrap()])
        : [];
      const myAccounts = keyring.getAccounts().map(({ address }): string => address);
      const _stashId = stashId && stashId.toString();

      setStakingState({
        balanceOpts: {
          bonded: stakers && !stakers.own.isEmpty
            ? [stakers.own.unwrap(), stakers.total.unwrap().sub(stakers.own.unwrap())]
            : true
        },
        controllerId: controllerId && controllerId.toString(),
        hasNominators: nominators.length !== 0,
        isNominatorMe: nominators.some(([who]): boolean =>
          myAccounts.includes(who.toString())
        ),
        isSelected: !!(_stashId && currentElected && currentElected.includes(_stashId)),
        nominators,
        sessionId: nextSessionId && nextSessionId.toString(),
        // stashActive: stakingLedger
        //   ? formatBalance(stakingLedger.active)
        //   : null,
        // stashTotal: stakingLedger
        //   ? formatBalance(stakingLedger.total)
        //   : null,
        stashId: _stashId
      });
    }
  }, [currentElected, stakingInfo]);

  useEffect((): void => {
    if (stakingInfo) {
      const { online, offline, sessionIds, stashId } = stakingInfo;
      const onlineStatus = updateOnlineStatus(recentlyOnline)(sessionIds, { offline, online });

      setOnlineStatus({
        hasOfflineWarnings: !!(stashId && onlineStatus.offline && onlineStatus.offline.length),
        onlineStatus
      });
    }
  }, [recentlyOnline, stakingInfo]);

  if ((filter === 'hasNominators' && !hasNominators) ||
    (filter === 'noNominators' && hasNominators) ||
    (filter === 'hasWarnings' && !hasOfflineWarnings) ||
    (filter === 'noWarnings' && hasOfflineWarnings) ||
    (filter === 'iNominated' && !isNominatorMe) ||
    (filter === 'nextSet' && !isSelected)) {
    return null;
  }

  if (!stashId) {
    return (
      <AddressCard
        className={className}
        defaultName={defaultName}
        isDisabled
        value={address}
        withBalance={false}
      />
    );
  }

  const lastBlockNumber = authorsMap[stashId];
  const isAuthor = lastAuthor === stashId;
  // isDisabled={!!points && points.isEmpty}

  return (
    <AddressCard
      buttons={
        <div className='staking--Address-info'>
          {lastBlockNumber && (
            <div className={`blockNumberV${isSubstrateV2 ? '2' : '1'} ${isAuthor && 'isCurrent'}`}>#{lastBlockNumber}</div>
          )}
          {controllerId && (
            <div>
              <label className={classes('staking--label', isSubstrateV2 && !lastBlockNumber && 'controllerSpacer')}>{t('controller')}</label>
              <AddressMini value={controllerId} />
            </div>
          )}
          {!isSubstrateV2 && sessionId && (
            <div>
              <label className='staking--label'>{t('session')}</label>
              <AddressMini value={sessionId} />
            </div>
          )}
        </div>
      }
      className={className}
      defaultName={defaultName}
      extraInfo={extraInfo}
      iconInfo={
        <>
          {controllerId && onlineStatus && (
            <OnlineStatus
              value={onlineStatus}
              isTooltip
            />
          )}
          {isSelected && (
            <Badge
              hover={t('Selected for the next session')}
              info={<Icon name='check' />}
              isTooltip
              type='next'
            />
          )}
        </>
      }
      value={stashId}
      withBalance={balanceOpts}
      withValidatorPrefs={WITH_VALIDATOR_PREFS}
    >
      {withNominations && hasNominators && (
        <details>
          <summary>
            {t('Nominators ({{count}})', {
              replace: {
                count: nominators.length
              }
            })}
          </summary>
          {nominators.map(([who, bonded]): React.ReactNode =>
            <AddressMini
              bonded={bonded}
              key={who.toString()}
              value={who}
              withBonded
            />
          )}
        </details>
      )}
    </AddressCard>
  );
}

export default withMulti(
  styled(Address)`
    .blockNumberV1,
    .blockNumberV2 {
      border-radius: 0.25rem;
      font-size: 1.5rem;
      font-weight: 100;
      line-height: 1.5rem;
      opacity: 0.5;
      vertical-align: middle;
      z-index: 1;

      &.isCurrent {
        background: #3f3f3f;
        box-shadow: 0 3px 3px rgba(0,0,0,.2);
        color: #eee;
        opacity: 1;
      }
    }

    .blockNumberV2 {
      display: inline-block;
      margin-bottom: 0.75rem;
      padding: 0.25rem 0;

      &.isCurrent {
        margin-right: -0.25rem;
        padding: 0.25rem 0.75rem;
      }
    }

    .blockNumberV1 {
      padding: 0.25rem 0.5rem;
      position: absolute;
      right: 0;
    }

    .staking--Address-info {
      /* Small additional margin to take care of validator highlights */
      margin-right: 0.25rem;
      text-align: right;

      .staking--label {
        margin: 0 2.25rem -0.75rem 0;
      }
    }

    .staking--label.controllerSpacer {
      margin-top: 2.75rem;
    }
  `,
  translate,
  withCalls<Props>(
    ['derive.staking.info', {
      paramName: 'address',
      propName: 'stakingInfo'
    }]
  )
);

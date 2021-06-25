// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { DeriveStakerReward } from '@polkadot/api-derive/types';
import type { StakerState } from '@polkadot/react-hooks/types';
import type { PayoutStash, PayoutValidator } from './types';

import BN from 'bn.js';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import { ApiPromise } from '@polkadot/api';
import { Button, Table, ToggleGroup } from '@polkadot/react-components';
import { useApi, useCall, useOwnEraRewards } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { BN_THREE } from '@polkadot/util';

import ElectionBanner from '../ElectionBanner';
import { useTranslation } from '../translate';
import PayButton from './PayButton';
import Stash from './Stash';
import Validator from './Validator';

interface Props {
  className?: string;
  isInElection?: boolean;
  ownValidators?: StakerState[];
}

interface Available {
  stashAvail?: BN | null;
  stashes?: PayoutStash[];
  valAvail?: BN | null;
  valTotal?: BN | null;
  validators?: PayoutValidator[];
}

interface EraSelection {
  value: number;
  text: string;
}

const DAY_SECS = new BN(1000 * 60 * 60 * 24);

function groupByValidator (allRewards: Record<string, DeriveStakerReward[]>): PayoutValidator[] {
  return Object
    .entries(allRewards)
    .reduce((grouped: PayoutValidator[], [stashId, rewards]): PayoutValidator[] => {
      rewards
        .forEach((reward): void => {
          Object
            .entries(reward.validators)
            .forEach(([validatorId, { total, value }]): void => {
              const entry = grouped.find((entry) => entry.validatorId === validatorId);

              if (entry) {
                const eraEntry = entry.eras.find((entry) => entry.era.eq(reward.era));

                if (eraEntry) {
                  eraEntry.stashes[stashId] = value;
                } else {
                  entry.eras.push({
                    era: reward.era,
                    stashes: { [stashId]: value }
                  });
                }

                entry.available = entry.available.add(value);
                entry.total = entry.total.add(total);
              } else {
                grouped.push({
                  available: value,
                  eras: [{
                    era: reward.era,
                    stashes: { [stashId]: value }
                  }],
                  total,
                  validatorId
                });
              }
            });
        });

      return grouped;
    }, [])
    .sort((a, b) => b.available.cmp(a.available));
}

function extractStashes (allRewards: Record<string, DeriveStakerReward[]>): PayoutStash[] {
  return Object
    .entries(allRewards)
    .map(([stashId, rewards]): PayoutStash => ({
      available: rewards.reduce((result, { validators }) =>
        Object.values(validators).reduce((result, { value }) =>
          result.iadd(value), result), new BN(0)
      ),
      rewards,
      stashId
    }))
    .filter(({ available }) => !available.isZero())
    .sort((a, b) => b.available.cmp(a.available));
}

function getAvailable (allRewards: Record<string, DeriveStakerReward[]> | null | undefined): Available {
  if (allRewards) {
    const stashes = extractStashes(allRewards);
    const validators = groupByValidator(allRewards);
    const stashAvail = stashes.length
      ? stashes.reduce<BN>((a, { available }) => a.iadd(available), new BN(0))
      : null;
    const [valAvail, valTotal] = validators.length
      ? validators.reduce<[BN, BN]>(([a, t], { available, total }) => [a.iadd(available), t.iadd(total)], [new BN(0), new BN(0)])
      : [null, null];

    return {
      stashAvail,
      stashes,
      valAvail,
      valTotal,
      validators
    };
  }

  return {};
}

function getOptions (api: ApiPromise, eraLength: BN | undefined, historyDepth: BN | undefined, t: TFunction): EraSelection[] {
  if (!eraLength || !historyDepth) {
    return [{ text: '', value: 0 }];
  }

  const blocksPerDay = DAY_SECS.div(
    api.consts.babe?.expectedBlockTime ||
    api.consts.timestamp?.minimumPeriod.muln(2) ||
    new BN(6000)
  );
  const maxBlocks = eraLength.mul(historyDepth);
  const eraSelection: EraSelection[] = [];
  const days = new BN(2);

  while (true) {
    const dayBlocks = blocksPerDay.mul(days);

    if (dayBlocks.gte(maxBlocks)) {
      break;
    }

    eraSelection.push({
      text: t<string>('{{days}} days', { replace: { days: days.toString() } }),
      value: dayBlocks.div(eraLength).toNumber()
    });

    days.imul(BN_THREE);
  }

  eraSelection.push({
    text: t<string>('Max, {{eras}} eras', { replace: { eras: historyDepth.toNumber() } }),
    value: historyDepth.toNumber()
  });

  return eraSelection;
}

function Payouts ({ className = '', isInElection, ownValidators }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const isLoadingValidators = useMemo(() => ownValidators === undefined, [ownValidators]);
  const hasOwnValidators = useMemo(() => ownValidators && ownValidators.length !== 0, [ownValidators]);
  const [myStashesIndex, setMyStashesIndex] = useState(() => hasOwnValidators ? 0 : 1);

  useEffect(() => {
    setMyStashesIndex(hasOwnValidators ? 0 : 1);
  }, [hasOwnValidators]);

  const [eraSelectionIndex, setEraSelectionIndex] = useState(0);
  const eraLength = useCall<BN>(api.derive.session.eraLength);
  const historyDepth = useCall<BN>(api.query.staking.historyDepth);

  const eraSelection = useMemo(
    () => getOptions(api, eraLength, historyDepth, t),
    [api, eraLength, historyDepth, t]
  );

  const { allRewards, isLoadingRewards } = useOwnEraRewards(eraSelection[eraSelectionIndex].value, myStashesIndex ? undefined : ownValidators);

  const { stashAvail, stashes, valAvail, validators } = useMemo(
    () => getAvailable(allRewards),
    [allRewards]
  );

  const headerStashes = useMemo(() => [
    [myStashesIndex ? t('payout/stash') : t('overall/validator'), 'start', 2],
    [t('eras'), 'start'],
    [myStashesIndex ? t('own') : t('total')],
    [('remaining')],
    [undefined, undefined, 3]
  ], [myStashesIndex, t]);

  const headerValidatorsRef = useRef([
    [t('payout/validator'), 'start', 2],
    [t('eras'), 'start'],
    [t('own')],
    [('remaining')],
    [undefined, undefined, 3]
  ]);

  const valOptions = useMemo(() => [
    { isDisabled: isLoadingRewards || isLoadingValidators || !hasOwnValidators, text: t('My validators'), value: 'val' },
    { isDisabled: isLoadingRewards || isLoadingValidators, text: t('My stashes'), value: 'all' }
  ], [isLoadingRewards, isLoadingValidators, hasOwnValidators, t]);

  const footerStash = useMemo(() => (
    <tr>
      <td colSpan={3} />
      <td className='number'>
        {stashAvail && <FormatBalance value={stashAvail} />}
      </td>
      <td colSpan={4} />
    </tr>
  ), [stashAvail]);

  const footerVal = useMemo(() => (
    <tr>
      <td colSpan={3} />
      <td className='number'>
        {valAvail && <FormatBalance value={valAvail} />}
      </td>
      <td colSpan={4} />
    </tr>
  ), [valAvail]);

  return (
    <div className={className}>
      <Button.Group>
        <ToggleGroup
          onChange={setEraSelectionIndex}
          options={eraSelection}
          value={eraSelectionIndex}
        />
        {!isLoadingValidators && <ToggleGroup
          onChange={setMyStashesIndex}
          options={valOptions}
          value={myStashesIndex}
        />}
        <PayButton
          isAll
          isDisabled={isInElection}
          payout={validators}
        />
      </Button.Group>
      <ElectionBanner isInElection={isInElection} />
      {!isLoadingRewards && !stashes?.length && (
        <article className='warning centered'>
          <p>{t('Payouts of rewards for a validator can be initiated by any account. This means that as soon as a validator or nominator requests a payout for an era, all the nominators for that validator will be rewarded. Each user does not need to claim individually and the suggestion is that validators should claim rewards for everybody as soon as an era ends.')}</p>
          <p>{t('If you have not claimed rewards straight after the end of the era, the validator is in the active set and you are seeing no rewards, this would mean that the reward payout transaction was made by another account on your behalf. Always check your favorite explorer to see any historic payouts made to your accounts.')}</p>
        </article>
      )}
      <Table
        empty={!isLoadingRewards && stashes && (
          myStashesIndex
            ? t<string>('No pending payouts for your stashes')
            : t<string>('No pending payouts for your validators')
        )}
        emptySpinner={t<string>('Retrieving info for the selected eras, this will take some time')}
        footer={footerStash}
        header={headerStashes}
        isFixed
      >
        {!isLoadingRewards && stashes?.map((payout): React.ReactNode => (
          <Stash
            key={payout.stashId}
            payout={payout}
          />
        ))}
      </Table>
      {(myStashesIndex === 1) && !isLoadingRewards && validators && (validators.length !== 0) && (
        <Table
          footer={footerVal}
          header={headerValidatorsRef.current}
          isFixed
        >
          {!isLoadingRewards && validators.filter(({ available }) => !available.isZero()).map((payout): React.ReactNode => (
            <Validator
              isDisabled={isInElection}
              key={payout.validatorId}
              payout={payout}
            />
          ))}
        </Table>
      )}
    </div>
  );
}

export default React.memo(styled(Payouts)`
  .payout-eras {
    padding-left: 0.25rem;
    vertical-align: middle;

    span {
      white-space: nowrap;
    }
  }
`);

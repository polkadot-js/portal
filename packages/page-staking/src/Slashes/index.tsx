// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StakerState } from '@polkadot/react-hooks/types';
import type { UnappliedSlash } from '@polkadot/types/interfaces';
import type { Slash, SlashEra } from './types';

import BN from 'bn.js';
import React, { useMemo, useState } from 'react';

import { Table, ToggleGroup } from '@polkadot/react-components';
import { useAccounts, useMembers, useThresholds } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import Era from './Era';

interface Props {
  ownStashes?: StakerState[];
  slashes: [BN, UnappliedSlash[]][];
}

function calcSlashEras (slashes: [BN, UnappliedSlash[]][], ownStashes: StakerState[]): SlashEra[] {
  const slashEras: SlashEra[] = [];

  slashes
    .reduce((rows: Slash[], [era, slashes]): Slash[] => {
      return slashes.reduce((rows: Slash[], slash): Slash[] => {
        const totalOther = slash.others.reduce((total: BN, [, value]): BN => {
          return total.add(value);
        }, new BN(0));

        const isMine = ownStashes.some(({ stashId }): boolean => {
          return slash.validator.eq(stashId) || slash.others.some(([nominatorId]) => nominatorId.eq(stashId));
        });

        rows.push({ era, isMine, slash, total: slash.own.add(totalOther), totalOther });

        return rows;
      }, rows);
    }, [])
    .forEach((slash): void => {
      let slashEra = slashEras.find(({ era }) => era.eq(slash.era));

      if (!slashEra) {
        slashEra = {
          era: slash.era,
          nominators: [],
          payout: new BN(0),
          reporters: [],
          slashes: [],
          total: new BN(0),
          validators: []
        };
        slashEras.push(slashEra);
      }

      slashEra.payout.iadd(slash.slash.payout);
      slashEra.total.iadd(slash.total);
      slashEra.slashes.push(slash);

      const validatorId = slash.slash.validator.toString();

      if (!slashEra.validators.includes(validatorId)) {
        slashEra.validators.push(validatorId);
      }

      slash.slash.others.forEach(([accountId]): void => {
        const nominatorId = accountId.toString();

        if (slashEra && !slashEra.nominators.includes(nominatorId)) {
          slashEra.nominators.push(nominatorId);
        }
      });

      slash.slash.reporters.forEach((accountId): void => {
        const reporterId = accountId.toString();

        if (slashEra && !slashEra.reporters.includes(reporterId)) {
          slashEra.reporters.push(reporterId);
        }
      });
    });

  return slashEras.sort((a, b) => b.era.cmp(a.era));
}

function Slashes ({ ownStashes = [], slashes }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { allAccounts } = useAccounts();
  const { members } = useMembers();
  const { slashProposalThreshold } = useThresholds();

  const [selectedIndex, setSelectedIndex] = useState(0);

  const rows = useMemo(
    () => calcSlashEras(slashes, ownStashes),
    [ownStashes, slashes]
  );

  const eraOpts = useMemo(
    () => rows.map(({ era }) => ({
      text: t<string>('era {{era}}', { replace: { era: formatNumber(era) } }),
      value: era.toString()
    })),
    [rows, t]
  );

  const councilId = useMemo(
    () => allAccounts.find((accountId) => members.includes(accountId)) || null,
    [allAccounts, members]
  );

  if (!rows.length) {
    return (
      <Table
        empty={t<string>('There are no unapplied/pending slashes')}
        header={[[t('unapplied'), 'start']]}
      />
    );
  }

  return (
    <Era
      buttons={
        <ToggleGroup
          onChange={setSelectedIndex}
          options={eraOpts}
          value={selectedIndex}
        />
      }
      councilId={councilId}
      councilThreshold={slashProposalThreshold}
      key={rows[selectedIndex].era.toString()}
      slash={rows[selectedIndex]}
    />
  );
}

export default React.memo(Slashes);

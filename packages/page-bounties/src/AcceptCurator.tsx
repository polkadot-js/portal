// Copyright 2017-2020 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useMemo } from 'react';

import { TxButton } from '@polkadot/react-components';
import { useAccounts, useApi } from '@polkadot/react-hooks';

import { useTranslation } from './translate';

interface Props {
  curatorId: AccountId;
  index: number;
}

function AcceptCurator ({ curatorId, index }: Props) {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts, hasAccounts } = useAccounts();

  const isCurator = useMemo(() => allAccounts.includes(curatorId.toString()), [allAccounts, curatorId]);

  return hasAccounts && isCurator
    ? (
      <TxButton
        accountId={curatorId}
        icon='check'
        label={t<string>('Accept Curator')}
        params={[index]}
        tx={(api.tx.bounties || api.tx.treasury).acceptCurator}
      />
    )
    : null;
}

export default React.memo(AcceptCurator);

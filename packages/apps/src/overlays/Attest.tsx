// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect, useState } from 'react';
import { useApi, useAccounts } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';
import { EthereumAddress } from '@polkadot/types/interfaces';

import { Link } from 'react-router-dom';

import { useTranslation } from '../translate';
import BaseOverlay from './Base';

interface Props {
  className?: string;
}

function Attest ({ className }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { allAccounts } = useAccounts();
  const { api, isApiReady } = useApi();
  const [isOldClaimProcess, setIsOldClaimProcess] = useState(true);
  const [needAttest, setNeedAttest] = useState<Option<EthereumAddress>[]>([]);

  useEffect(() => {
    if (isApiReady && typeof api.query?.claims?.preclaims !== 'undefined') {
      setIsOldClaimProcess(false);
    }
  }, [api, isApiReady]);

  // Find accounts that need attest. They are accounts that
  // - already preclaimed,
  // - didn't sign the attest yet.
  // `claims.preclaims` returns Some() for these accounts.
  useEffect(() => {
    if (!isOldClaimProcess) {
      api.query.claims.preclaims.multi<Option<EthereumAddress>>(allAccounts)
        .then((options) => {
          setNeedAttest(options.filter((opt) => opt.isSome));
        });
    }
  }, [allAccounts, isOldClaimProcess]);

  if (!needAttest?.length) {
    return null;
  }

  return (
    <BaseOverlay className={className}
      icon='warning sign'
      type='error'>
      <div>
        {t(
          '{{number}} account {{need}} to sign the attest before receiving DOTs. Please sign the attest ',
          { replace: { need: needAttest.length === 1 ? 'needs' : 'need', number: needAttest.length } }
        )}
        <Link to='/claims'>{t('here.')}</Link>
      </div>
    </BaseOverlay>
  );
}

export default React.memo(Attest);

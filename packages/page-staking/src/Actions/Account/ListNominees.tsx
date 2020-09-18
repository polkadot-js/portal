// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect, useState } from 'react';
import { DeriveSessionProgress } from '@polkadot/api-derive/types';
import { AddressMini, Expander } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate';
import useInactives from '../useInactives';
import BN from 'bn.js';

interface Props {
  nominating?: string[];
  stashId: string;
}

function ListNominees ({ nominating, stashId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { nomsActive, nomsChilled, nomsInactive, nomsOver, nomsWaiting } = useInactives(stashId, nominating);
  const sessionInfo = useCall<DeriveSessionProgress>(api.query.staking && api.derive.session?.progress);
  const [nomBalanceMap, setNomBalanceMap] = useState<Record<string, BN>>({});

  useEffect(() => {
    let unsub: (() => void) | undefined;

    if (nomsActive && sessionInfo?.activeEra) {
      api.derive.staking.eraExposure(sessionInfo.activeEra, (v) => {
        // for every active nominee
        nomsActive.forEach((nom) => {
          // cycle through its nominator to find our current stash
          v.validators?.[nom].others.some((o) => {
            if (o.who.toString() === stashId) {
              const newN = { [nom]: o.value.toBn() };

              setNomBalanceMap({ ...nomBalanceMap, ...newN });

              return true;
            }

            return false;
          });
        });
      })
        .then((_unsub): void => {
          unsub = _unsub;
        }).catch(console.error);
    }

    return (): void => {
      unsub && unsub();
    };
  }, [api, nomBalanceMap, nomsActive, sessionInfo?.activeEra, stashId]);

  const max = api.consts.staking?.maxNominatorRewardedPerValidator?.toString();

  return (
    <>
      {nomsOver && nomsOver.length !== 0 && (
        <Expander
          className='stakeOver'
          help={t<string>('These validators are active but only the top {{max}} nominators by backing stake will be receiving rewards. The nominating stash is not one of those to be rewarded in the current era.', { replace: max })}
          summary={t<string>('Oversubscribed nominations ({{count}})', { replace: { count: nomsOver.length } })}
        >
          {nomsOver.map((nomineeId, index): React.ReactNode => (
            <AddressMini
              key={index}
              value={nomineeId}
              withBalance={false}
            />
          ))}
        </Expander>
      )}
      {nomsActive && nomsActive.length !== 0 && (
        <Expander
          help={t<string>('The validators selected by the Phragmen algorithm to nominate for this era.')}
          summary={t<string>('Active nominations ({{count}})', { replace: { count: nomsActive.length } })}
        >
          {nomsActive.map((nomineeId, index): React.ReactNode => (
            <AddressMini
              balance={nomBalanceMap[nomineeId]}
              key={index}
              value={nomineeId}
              withBalance
            />
          ))}
        </Expander>
      )}
      {nomsInactive && nomsInactive.length !== 0 && (
        <Expander
          help={t<string>('The elected validator list that did not get selected by the Phragmen algorithm for this era. However they may be selected in the future.')}
          summary={t<string>('Inactive nominations ({{count}})', { replace: { count: nomsInactive.length } })}
        >
          {nomsInactive.map((nomineeId, index): React.ReactNode => (
            <AddressMini
              key={index}
              value={nomineeId}
              withBalance={false}
            />
          ))}
        </Expander>
      )}
      {nomsChilled && nomsChilled.length !== 0 && (
        <Expander
          help={t<string>('The validators that got slashed and for which your nomination got auto-chilled. Re-nominating these will make them available to the Phragmen algorithm.')}
          summary={t<string>('Renomination required ({{count}})', { replace: { count: nomsChilled.length } })}
        >
          {nomsChilled.map((nomineeId, index): React.ReactNode => (
            <AddressMini
              key={index}
              value={nomineeId}
              withBalance={false}
            />
          ))}
        </Expander>
      )}
      {nomsWaiting && nomsWaiting.length !== 0 && (
        <Expander
          help={t<string>('The validators that are not in the validator set because they need more nominations or because they have willingly stop validating. Any nominations made before the next election will also appear here.')}
          summary={t<string>('Waiting nominations ({{count}})', { replace: { count: nomsWaiting.length } })}
        >
          {nomsWaiting.map((nomineeId, index): React.ReactNode => (
            <AddressMini
              key={index}
              value={nomineeId}
              withBalance={false}
            />
          ))}
        </Expander>
      )}
    </>
  );
}

export default React.memo(ListNominees);

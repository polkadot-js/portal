// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber, EventRecord, Extrinsic } from '@polkadot/types/interfaces';

import React from 'react';
import styled from 'styled-components';
import { registry } from '@polkadot/react-api';
import { AddressMini, Call, Expander, LinkExternal } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import Event from '../Event';

interface Props {
  blockNumber?: BlockNumber;
  className?: string;
  events?: EventRecord[];
  index: number;
  value: Extrinsic;
}

function getEra ({ era }: Extrinsic, blockNumber?: BlockNumber): [number, number] | null {
  if (blockNumber && era.isMortalEra) {
    const mortalEra = era.asMortalEra;

    return [mortalEra.birth(blockNumber.toNumber()), mortalEra.death(blockNumber.toNumber())];
  }

  return null;
}

function filterEvents (index: number, events: EventRecord[] = []): EventRecord[] {
  return events.filter(({ phase }) => phase.isApplyExtrinsic && phase.asApplyExtrinsic.eq(index));
}

function ExtrinsicDisplay ({ blockNumber, className, events, index, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { meta, method, section } = registry.findMetaCall(value.callIndex);
  const era = getEra(value, blockNumber);
  const thisEvents = filterEvents(index, events);

  return (
    <tr
      className={className}
      key={`extrinsic:${index}`}
    >
      <td className='top'>
        <Expander
          summary={`${section}.${method} (#${formatNumber(index)})`}
          summaryMeta={meta}
        >
          <Call
            className='details'
            mortality={
              era
                ? blockNumber
                  ? t('mortal, valid from #{{startAt}} to #{{endsAt}}', {
                    replace: {
                      endsAt: formatNumber(era[1]),
                      startAt: formatNumber(era[0])
                    }
                  })
                  : t('mortal')
                : t('immortal')
            }
            tip={value.tip?.toBn()}
            value={value}
            withHash
          />
        </Expander>
        {value.isSigned
          ? <LinkExternal data={value.hash.toHex()} type='extrinsic' />
          : null
        }
      </td>
      <td className='top'>
        {value.isSigned
          ? (
            <>
              <AddressMini value={value.signer} />
              <div className='explorer--BlockByHash-nonce'>
                {t('index')} {formatNumber(value.nonce)}
              </div>
            </>
          )
          : <label>{t('not signed')}</label>}
      </td>
      <td className='all top'>
        {thisEvents.map((event, index) =>
          <Event
            className='explorer--BlockByHash-event'
            key={`event:${index}`}
            value={event}
          />
        )}
      </td>
    </tr>
  );
}

export default React.memo(styled(ExtrinsicDisplay)`
  .explorer--BlockByHash-event+.explorer--BlockByHash-event {
    margin-top: 0.5rem;
  }

  .explorer--BlockByHash-header {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
  }

  .explorer--BlockByHash-nonce {
    font-size: 0.75rem;
    margin-left: 2.25rem;
    margin-top: -0.625rem;
    opacity: 0.45;
    text-align: left;
  }
`);

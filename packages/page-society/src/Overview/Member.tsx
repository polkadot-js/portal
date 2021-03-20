// Copyright 2017-2021 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { bool } from '@polkadot/types';
import type { BalanceOf, BlockNumber } from '@polkadot/types/interfaces';
import type { MapMember } from '../types';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { KUSAMA_GENESIS } from '@polkadot/apps-config';
import { AddressSmall, Columar, Expander, Icon, Modal, Tag } from '@polkadot/react-components';
import { useApi, useCallMulti, useToggle } from '@polkadot/react-hooks';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import drawCanary from '../draw/canary';
import { useTranslation } from '../translate';

interface Props {
  bestNumber?: BN;
  className?: string;
  isFounder?: boolean;
  isHead?: boolean;
  isSkeptic?: boolean;
  value: MapMember;
}

interface MultiState {
  isSuspended: boolean;
  payouts: [BlockNumber, BalanceOf][];
}

const CANVAS_STYLE = {
  display: 'block',
  margin: '0 auto'
};

const optMulti = {
  defaultValue: {
    isSuspended: false,
    payouts: [] as [BlockNumber, BalanceOf][]
  },
  transform: ([suspended, payouts]: [bool, [BlockNumber, BalanceOf][]]): MultiState => ({
    isSuspended: suspended.isTrue,
    payouts
  })
};

function Member ({ bestNumber, className = '', value: { isFounder, isHead, isSkeptic, isVoter, member: { accountId, strikes } } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canInk] = useState(() => api.genesisHash.eq(KUSAMA_GENESIS));
  const [isInkShowing, toggleInk] = useToggle();
  const { isSuspended, payouts } = useCallMulti<MultiState>([
    [api.query.society.suspendedMembers, accountId],
    [api.query.society.payouts, accountId]
  ], optMulti);

  const renderPayouts = useCallback(
    () => bestNumber && payouts.map(([bn, value], index) => (
      <p key={index}>
        <Columar>
          <Columar.Column>
            <FormatBalance value={value} />
          </Columar.Column>
          <Columar.Column>
            <div>#{formatNumber(bn)}</div>
            <BlockToTime
              key={index}
              value={bn.sub(bestNumber)}
            />
          </Columar.Column>
        </Columar>
      </p>
    )),
    [bestNumber, payouts]
  );

  useEffect((): void => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');

      if (ctx) {
        drawCanary(ctx, accountId);
      }
    }
  });

  return (
    <tr className={className}>
      <td className='address'>
        <AddressSmall value={accountId} />
      </td>
      <td>
        {isHead && (
          <Tag
            color='green'
            label={t<string>('society head')}
          />
        )}
        {isFounder && (
          <Tag
            color='green'
            label={t<string>('society founder')}
          />
        )}
        {isSkeptic && (
          <Tag
            color='yellow'
            label={t<string>('skeptic')}
          />
        )}
        {isVoter && (
          <Tag
            color='blue'
            label={t<string>('voted')}
          />
        )}
        {isSuspended && (
          <Tag
            color='red'
            label={t<string>('suspended')}
          />
        )}
      </td>
      <td className='all number'>
        {payouts.length !== 0 && (
          <Expander
            renderChildren={renderPayouts}
            summary={t<string>('Payouts ({{count}})', { replace: { count: formatNumber(payouts.length) } })}
          />
        )}
      </td>
      <td className='number'>{formatNumber(strikes)}</td>
      <td>
        {canInk && (
          <>
            <Icon
              icon='pen-nib'
              onClick={toggleInk}
            />
            {isInkShowing && (
              <Modal
                header={t('design samples')}
                size='large'
              >
                <Modal.Content>
                  <canvas
                    height={525}
                    ref={canvasRef}
                    style={CANVAS_STYLE}
                    width={800}
                  />
                </Modal.Content>
                <Modal.Actions
                  cancelLabel={t<string>('Close')}
                  onCancel={toggleInk}
                />
              </Modal>
            )}
          </>
        )}
      </td>
    </tr>
  );
}

export default React.memo(styled(Member)`
  .ui--Column {
    &:first-child {
      max-width: 100% !important;
    }

    &:last-child {
      max-width: 13ch;
      min-width: 13ch;
      white-space: nowrap;
    }
  }
`);

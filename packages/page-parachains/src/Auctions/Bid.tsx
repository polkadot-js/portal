// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { BlockNumber } from '@polkadot/types/interfaces';
import type { AuctionInfo, OwnedId, OwnerInfo, Winning } from '../types';

import React, { useMemo, useState } from 'react';

import { Button, Dropdown, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useBestNumber, useToggle } from '@polkadot/react-hooks';
import { BN_ZERO, formatNumber } from '@polkadot/util';

import InputOwner from '../InputOwner';
import { useTranslation } from '../translate';
import { useLeaseRanges } from '../useLeaseRanges';

interface Props {
  auctionInfo?: AuctionInfo;
  className?: string;
  lastWinners?: Winning;
  ownedIds: OwnedId[];
}

interface Option {
  firstPeriod: number;
  lastPeriod: number;
  text: string;
  value: number;
}

const EMPTY_OWNER: OwnerInfo = { accountId: null, paraId: 0 };

function Bid ({ auctionInfo, className, lastWinners, ownedIds }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { hasAccounts } = useAccounts();
  const bestNumber = useBestNumber();
  const ranges = useLeaseRanges();
  const [{ accountId, paraId }, setOwnerInfo] = useState<OwnerInfo>(EMPTY_OWNER);
  const [amount, setAmount] = useState<BN | undefined>(BN_ZERO);
  const [range, setRange] = useState(0);
  const [isOpen, toggleOpen] = useToggle();

  const rangeOpts = useMemo(
    (): Option[] => {
      if (!auctionInfo?.leasePeriod) {
        return [];
      }

      const leasePeriod = auctionInfo.leasePeriod.toNumber();

      return ranges.map(([first, last], value): Option => ({
        firstPeriod: leasePeriod + first,
        lastPeriod: leasePeriod + last,
        text: `${formatNumber(leasePeriod + first)} - ${formatNumber(leasePeriod + last)}`,
        value
      }));
    },
    [auctionInfo, ranges]
  );

  const currentWinner = useMemo(
    () => lastWinners && lastWinners.winners.find(({ firstPeriod, lastPeriod }) =>
      firstPeriod.eqn(rangeOpts[range].firstPeriod) &&
      lastPeriod.eqn(rangeOpts[range].lastPeriod)
    ),
    [lastWinners, range, rangeOpts]
  );

  const isAmountLess = !!(amount && currentWinner) && amount.lte(currentWinner.value);
  const isAmountError = !amount || amount.isZero() || isAmountLess;

  return (
    <>
      <Button
        icon='plus'
        isDisabled={!ownedIds.length || !hasAccounts || !auctionInfo?.numAuctions || !auctionInfo.leasePeriod || !auctionInfo.endBlock || !api.consts.auctions || bestNumber?.gte(auctionInfo.endBlock.add(api.consts.auctions.endingPeriod as BlockNumber))}
        label={t<string>('Bid')}
        onClick={toggleOpen}
      />
      {isOpen && (
        <Modal
          className={className}
          header={t<string>('Place bid')}
          size='large'
        >
          <Modal.Content>
            <InputOwner
              onChange={setOwnerInfo}
              ownedIds={ownedIds}
            />
            <Modal.Columns hint={t<string>('The first and last lease period for this bid. The last lease period should be after the first with the maximum determined by the auction config.')}>
              <Dropdown
                label={t<string>('bid period range (first lease - last lease)')}
                onChange={setRange}
                options={rangeOpts}
                value={range}
              />
            </Modal.Columns>
            <Modal.Columns hint={
              <>
                <p>{t<string>('The amount to to bid for this parachain lease period range.')}</p>
                <p>{t<string>('The bid should be more than the current range winner to be accepted and influence the auction outcome.')}</p>
              </>
            }>
              <InputBalance
                autoFocus
                isError={isAmountError}
                isZeroable={false}
                label={t<string>('bid amount')}
                onChange={setAmount}
              />
              <InputBalance
                defaultValue={currentWinner?.value}
                isDisabled
                key={range}
                label={t<string>('current range winning bid')}
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleOpen}>
            <TxButton
              accountId={accountId}
              icon='plus'
              isDisabled={!paraId || isAmountError || !auctionInfo?.leasePeriod}
              label={t<string>('Bid')}
              onStart={toggleOpen}
              params={[paraId, auctionInfo?.numAuctions, auctionInfo?.leasePeriod?.addn(ranges[range][0]), auctionInfo?.leasePeriod?.addn(ranges[range][1]), amount]}
              tx={api.tx.auctions.bid}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(Bid);

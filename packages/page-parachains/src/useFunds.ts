// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { AccountId, BalanceOf, BlockNumber, FundInfo, ParaId } from '@polkadot/types/interfaces';
import type { ITuple } from '@polkadot/types/types';
import type { Fund, FundResult } from './types';

import BN from 'bn.js';
import { useEffect, useState } from 'react';

import { useApi, useBestNumber, useCall, useEventTrigger } from '@polkadot/react-hooks';
import { BN_ZERO, stringToU8a, u8aConcat } from '@polkadot/util';
import { encodeAddress } from '@polkadot/util-crypto';

const EMPTY: FundResult = {
  activeCap: BN_ZERO,
  activeRaised: BN_ZERO,
  funds: null,
  totalCap: BN_ZERO,
  totalRaised: BN_ZERO
};

const PREFIX = stringToU8a('modlpy/cfund');
const EMPTY_U8A = new Uint8Array(32);

function createAccount (paraId: ParaId): Uint8Array {
  return u8aConcat(PREFIX, paraId.toU8a(), EMPTY_U8A).subarray(0, 32);
}

function isCrowdloadAccount (paraId: ParaId, accountId: AccountId): boolean {
  return accountId.eq(createAccount(paraId));
}

function hasLease (paraId: ParaId, leased: ParaId[]): boolean {
  return leased.some((l) => l.eq(paraId));
}

// map into a campaign
function updateFund (bestNumber: BN, minContribution: BN, retirementPeriod: BN, data: Fund, leased: ParaId[]): Fund {
  data.isCapped = data.info.cap.sub(data.info.raised).lt(minContribution);
  data.isEnded = bestNumber.gt(data.info.end);
  data.retireEnd = data.info.end.add(retirementPeriod);
  data.isRetired = bestNumber.gt(data.retireEnd);
  data.isWinner = hasLease(data.paraId, leased);

  return data;
}

function isFundUpdated (bestNumber: BlockNumber, minContribution: BN, retirementPeriod: BN, { info: { cap, end, raised }, paraId }: Fund, leased: ParaId[], allPrev: FundResult): boolean {
  const prev = allPrev.funds?.find((p) => p.paraId.eq(paraId));

  return !prev ||
    (!prev.isEnded && bestNumber.gt(end)) ||
    (!prev.isCapped && cap.sub(raised).lt(minContribution)) ||
    (!prev.isRetired && bestNumber.gt(end.add(retirementPeriod))) ||
    (!prev.isWinner && hasLease(paraId, leased));
}

// compare the current campaigns against the previous, manually adding ending and calculating the new totals
function createResult (bestNumber: BlockNumber, minContribution: BN, retirementPeriod: BN, funds: Fund[], leased: ParaId[], prev: FundResult): FundResult {
  const [activeRaised, activeCap, totalRaised, totalCap] = funds.reduce(([ar, ac, tr, tc], { info: { cap, end, raised } }) => [
    bestNumber.gt(end) ? ar : ar.iadd(raised),
    bestNumber.gt(end) ? ac : ac.iadd(cap),
    tr.iadd(raised),
    tc.iadd(cap)
  ], [new BN(0), new BN(0), new BN(0), new BN(0)]);
  const hasNewActiveCap = !prev.activeCap.eq(activeCap);
  const hasNewActiveRaised = !prev.activeRaised.eq(activeRaised);
  const hasNewTotalCap = !prev.totalCap.eq(totalCap);
  const hasNewTotalRaised = !prev.totalRaised.eq(totalRaised);
  const hasChanged =
    !prev.funds || prev.funds.length !== funds.length ||
    hasNewActiveCap || hasNewActiveRaised || hasNewTotalCap || hasNewTotalRaised ||
    funds.some((c) => isFundUpdated(bestNumber, minContribution, retirementPeriod, c, leased, prev));

  if (!hasChanged) {
    return prev;
  }

  return {
    activeCap: hasNewActiveCap
      ? activeCap
      : prev.activeCap,
    activeRaised: hasNewActiveRaised
      ? activeRaised
      : prev.activeRaised,
    funds: funds
      .map((c) => updateFund(bestNumber, minContribution, retirementPeriod, c, leased))
      .sort((a, b) =>
        a.isWinner !== b.isWinner
          ? a.isWinner
            ? -1
            : 1
          : a.isCapped !== b.isCapped
            ? a.isCapped
              ? -1
              : 1
            : a.isRetired !== b.isRetired
              ? a.isRetired
                ? 1
                : -1
              : a.isEnded !== b.isEnded
                ? a.isEnded
                  ? 1
                  : -1
                : 0
      ),
    totalCap: hasNewTotalCap
      ? totalCap
      : prev.totalCap,
    totalRaised: hasNewTotalRaised
      ? totalRaised
      : prev.totalRaised
  };
}

const optFundMulti = {
  transform: ([[paraIds], optFunds]: [[ParaId[]], Option<FundInfo>[]]): Fund[] =>
    paraIds
      .map((paraId, i): [ParaId, FundInfo | null] => [paraId, optFunds[i].unwrapOr(null)])
      .filter((v): v is [ParaId, FundInfo] => !!v[1])
      .map(([paraId, info]): Fund => ({
        accountId: encodeAddress(createAccount(paraId)),
        info,
        key: paraId.toString(),
        paraId,
        range: [info.firstPeriod.toNumber(), info.lastPeriod.toNumber()],
        value: info.raised
      }))
      .sort((a, b) =>
        a.info.end.cmp(b.info.end) ||
        a.info.firstPeriod.cmp(b.info.firstPeriod) ||
        a.info.lastPeriod.cmp(b.info.lastPeriod) ||
        a.paraId.cmp(b.paraId)
      ),
  withParamsTransform: true
};

const optLeaseMulti = {
  transform: ([[paraIds], leases]: [[ParaId[]], Option<ITuple<[AccountId, BalanceOf]>>[][]]): ParaId[] =>
    paraIds.filter((paraId, i) =>
      leases[i]
        .map((o) => o.unwrapOr(null))
        .filter((v): v is ITuple<[AccountId, BalanceOf]> => !!v)
        .filter(([accountId]) => isCrowdloadAccount(paraId, accountId))
        .length !== 0
    ),
  withParamsTransform: true
};

export default function useFunds (): FundResult {
  const { api } = useApi();
  const bestNumber = useBestNumber();
  const [paraIds, setParaIds] = useState<ParaId[]>([]);
  const trigger = useEventTrigger([api.events.crowdloan.Created]);
  const campaigns = useCall<Fund[]>(api.query.crowdloan.funds.multi, [paraIds], optFundMulti);
  const leases = useCall<ParaId[]>(api.query.slots.leases.multi, [paraIds], optLeaseMulti);
  const [result, setResult] = useState<FundResult>(EMPTY);

  // on event triggers, update the available paraIds
  useEffect((): void => {
    trigger &&
      api.query.crowdloan.funds
        .keys<[ParaId]>()
        .then((indexes) => setParaIds(
          indexes.map(({ args: [paraId] }) => paraId))
        )
        .catch(console.error);
  }, [api, trigger]);

  // here we manually add the actual ending status and calculate the totals
  useEffect((): void => {
    bestNumber && campaigns && leases && setResult((prev) =>
      createResult(bestNumber, api.consts.crowdloan.minContribution as BlockNumber, api.consts.crowdloan.retirementPeriod as BlockNumber, campaigns, leases, prev)
    );
  }, [api, bestNumber, campaigns, leases]);

  return result;
}

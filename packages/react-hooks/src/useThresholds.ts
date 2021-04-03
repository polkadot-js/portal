// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Threshold } from '@polkadot/apps-config';

import { useMemo } from 'react';

import { PROPOSE_THRESHOLDS,
  REJECT_THRESHOLDS,
  SLASH_THRESHOLDS,
  TREASURY_THRESHOLDS } from '@polkadot/apps-config';

import { useApi } from './useApi';
import { useMembers } from './useMembers';

export interface Thresholds {
  proposalThreshold: number;
  treasuryProposalThreshold: number;
  treasuryRejectionThreshold: number;
  slashProposalThreshold: number;
}

export function getMoreThanThresholdMembersCount (membersCount: number, thresholdRatio: number): number {
  if (membersCount === 0) { return 0; }

  return Math.floor(membersCount * thresholdRatio) + 1;
}

export function getAtLeastThresholdMembersCount (membersCount: number, thresholdRatio: number): number {
  return Math.ceil(membersCount * thresholdRatio);
}

function getThreshold (membersCount: number, threshold: Threshold): number {
  return threshold.option === 'AtLeast'
    ? getAtLeastThresholdMembersCount(membersCount, threshold.value)
    : getMoreThanThresholdMembersCount(membersCount, threshold.value);
}

export function useThresholds () : Thresholds {
  const { api } = useApi();
  const { members } = useMembers();

  return useMemo((): Thresholds => {
    const membersCount = members?.length;

    if (!membersCount) {
      return { proposalThreshold: 0, slashProposalThreshold: 0, treasuryProposalThreshold: 0, treasuryRejectionThreshold: 0 };
    }

    const genesisHash = api.genesisHash.toHex();

    return {
      proposalThreshold: getThreshold(membersCount,
        PROPOSE_THRESHOLDS[genesisHash] || PROPOSE_THRESHOLDS.default
      ),
      slashProposalThreshold: getThreshold(membersCount,
        SLASH_THRESHOLDS[genesisHash] || SLASH_THRESHOLDS.default
      ),
      treasuryProposalThreshold: getThreshold(membersCount,
        TREASURY_THRESHOLDS[genesisHash] || TREASURY_THRESHOLDS.default
      ),
      treasuryRejectionThreshold: getThreshold(membersCount,
        REJECT_THRESHOLDS[genesisHash] || REJECT_THRESHOLDS.default
      )
    };
  }, [api, members]);
}

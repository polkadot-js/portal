// Copyright 2017-2021 @polkadot/app-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { KULUPU_GENESIS, KUSAMA_GENESIS, POLKADOT_GENESIS } from '../constants';

export interface Threshold {
  value: number;
  option: 'AtLeast' | 'MoreThan';
}

export const PROPOSE_THRESHOLDS: Record<string, Threshold> = {
  [KULUPU_GENESIS]: { option: 'MoreThan', value: 0.8 },
  [KUSAMA_GENESIS]: { option: 'AtLeast', value: 0.5 },
  [POLKADOT_GENESIS]: { option: 'AtLeast', value: 0.6 },
  default: { option: 'AtLeast', value: 0.5 }
};

export const REJECT_THRESHOLDS: Record<string, Threshold> = {
  [KULUPU_GENESIS]: { option: 'MoreThan', value: 0.5 },
  [KUSAMA_GENESIS]: { option: 'MoreThan', value: 0.5 },
  [POLKADOT_GENESIS]: { option: 'MoreThan', value: 0.5 },
  default: { option: 'MoreThan', value: 0.5 }
};

export const SLASH_THRESHOLDS: Record<string, Threshold> = {
  [KUSAMA_GENESIS]: { option: 'AtLeast', value: 0.5 },
  [POLKADOT_GENESIS]: { option: 'AtLeast', value: 0.75 },
  default: { option: 'AtLeast', value: 0.5 }
};

export const TREASURY_THRESHOLDS: Record<string, Threshold> = {
  [KULUPU_GENESIS]: { option: 'MoreThan', value: 0.5 },
  [KUSAMA_GENESIS]: { option: 'AtLeast', value: 0.6 },
  [POLKADOT_GENESIS]: { option: 'AtLeast', value: 0.6 },
  default: { option: 'AtLeast', value: 0.6 }
};

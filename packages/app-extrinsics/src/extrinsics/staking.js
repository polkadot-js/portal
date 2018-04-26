// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ExtrinsicsBasic } from './types';

module.exports = ({
  description: 'Staking',
  methods: {
    public: {
      transfer: {
        description: 'Transfer',
        index: 0,
        params: [
          { name: 'to', type: 'AccountId' },
          { name: 'value', type: 'Balance' }
        ]
      },
      stake: {
        description: 'Stake',
        index: 1,
        params: []
      },
      unstake: {
        description: 'Unstake',
        index: 2,
        params: []
      }
    },
    private: {
      setSessionsPerEra: {
        description: 'Set sessions per era',
        index: 0,
        params: [
          { name: 'sessions', type: 'BlockNumber' }
        ]
      },
      setBondingDuration: {
        description: 'Set bonding duration',
        index: 1,
        params: [
          { name: 'duration', type: 'BlockNumber' }
        ]
      },
      setValidatorCount: {
        description: 'Set validator count',
        index: 2,
        params: [
          { name: 'count', type: 'u32' }
        ]
      },
      forceNewEra: {
        description: 'Force new era',
        index: 3,
        params: []
      }
    }
  }
}: ExtrinsicsBasic);

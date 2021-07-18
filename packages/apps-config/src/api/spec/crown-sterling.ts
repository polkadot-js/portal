// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

// structs need to be in order
/* eslint-disable sort-keys */

const definitions: OverrideBundleDefinition = {
  types: [
    {
      // on all versions
      minmax: [0, undefined],
      types: {
        Address: "MultiAddress",
        LookupSource: "MultiAddress",
        BalanceOf: "Balance",
        AccountInfo: {
          nonce: "Index",
          consumers: "RefCount",
          providers: "RefCount",
          data: "AccountData"
        },
        AuthorityOf: "AccountId",
        PaymentId: "[u8;16]",
        Payment: {
          id: "PaymentId",
          account_id: "AccountId", 
          success_url: "Vec<u8>", 
          failure_url: "Vec<u8>", 
          paid: "bool",
          pay_to:"AccountId"
        },
        PeerId: "(Vec<u8>)",
        Amendment: {
          statement: "Vec<u8>",
          owners: "Vec<AccountId>"
        },
        BlockNumber: "u32",
        VestingSchedule: {
          start: "BlockNumber",
          period: "BlockNumber",
          period_count: "BlockNumber",
          per_period: "Compact<Balance>"
        },
        VestingScheduleOf: "VestingSchedule"
      }
    }
  ]
};

export default definitions;

// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// structs need to be in order
/* eslint-disable sort-keys */

import { Mainnet } from '@edgeware/node-types';

export default {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  ...Mainnet,
  // aliases that don't do well as part of interfaces
  'voting::VoteType': 'VoteType',
  'voting::TallyType': 'TallyType',
  'voting::Tally': 'VotingTally',
  // Substrate overrides
  RefCount: 'u8',
  Weight: 'u64'
};

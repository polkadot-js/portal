// Copyright 2017-2019 @polkadot/app-status authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Health, PeerInfo, PendingExtrinsics } from '@polkadot/types';

export type Info = {
  health?: Health | null,
  peers?: Array<PeerInfo> | null,
  extrinsics?: PendingExtrinsics | null
};

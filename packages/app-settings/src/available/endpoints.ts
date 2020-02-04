// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Option } from '../types';

export default [
  { text: 'Acala Alpha Testnet', value: 'wss://testnet-node-1.acala.laminar.one/ws', info: 'substrate' },
  {
    info: 'local',
    text: 'Local Node (Own, 127.0.0.1:9944)',
    value: 'ws://127.0.0.1:9944/',
    withI18n: true
  }
] as Option[];

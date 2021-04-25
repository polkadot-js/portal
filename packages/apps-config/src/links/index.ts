// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ExternalDef } from './types';

import Commonwealth from './commonwealth';
import Polkascan from './polkascan';
import Polkassembly from './polkassembly';
import Polkastats from './polkastats';
import Subscan from './subscan';
import DotScanner from './dotscanner';

export const externalLinks: Record<string, ExternalDef> = {
  Commonwealth,
  DotScanner,
  Polkascan,
  Polkassembly,
  Polkastats,
  Subscan
};

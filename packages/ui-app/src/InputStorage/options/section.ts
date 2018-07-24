// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Storage$Sections } from '@polkadot/storage/types';
import { DropdownOptions } from '../../InputExtrinsic/types';
import { shouldDisplaySection } from '../../util/shouldDisplaySection';

import map from '@polkadot/storage';

export default function createOptions (type: 'public'): DropdownOptions {
  return Object
    .keys(map)
    .sort()
    .filter((name) => {
      const section = map[name as Storage$Sections];

      return shouldDisplaySection(section, type);
    })
    .map((name) => ({
      text: name,
      value: name
    }));
}

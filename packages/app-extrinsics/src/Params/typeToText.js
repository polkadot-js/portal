// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Param$Type } from '@polkadot/primitives/param';

export default function typeToText (type: Param$Type): string {
  if (Array.isArray(type)) {
    return `Array<${type.join(', ')}>`;
  }

  return type;
}

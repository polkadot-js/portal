// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export default function classes (...classNames: string[]): string {
  return classNames
    .filter((className): string => className)
    .join(' ');
}

// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { getAtLeastThresholdMembersCount, getMoreThanThresholdMembersCount } from './useThresholds';

describe('minimal members count', () => {
  it('0 members', () => {
    expect(getAtLeastThresholdMembersCount(0, 0.5)).toEqual(0);
    expect(getMoreThanThresholdMembersCount(0, 0.5)).toEqual(0);
  });

  it('even number of members', () => {
    expect(getAtLeastThresholdMembersCount(12, 0.5)).toEqual(6);
    expect(getMoreThanThresholdMembersCount(12, 0.5)).toEqual(7);
  });

  it('odd number of members', () => {
    expect(getAtLeastThresholdMembersCount(19, 0.5)).toEqual(10);
    expect(getMoreThanThresholdMembersCount(19, 0.5)).toEqual(10);
  });
});

// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedElectionsInfo } from '@polkadot/api-derive/types';
import { AccountId, BlockNumber } from '@polkadot/types/interfaces';

import React from 'react';
import { Button } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import Candidates from './Candidates';
import Members from './Members';
import SubmitCandidacy from './SubmitCandidacy';
import Summary from './Summary';
import Vote from './Vote';

interface Props {
  className?: string;
  prime: AccountId | null;
}

function transformVotes ([voters, casted]: [AccountId[], AccountId[][]]): Record<string, AccountId[]> {
  return voters.reduce((result: Record<string, AccountId[]>, voter, index): Record<string, AccountId[]> => {
    casted[index].forEach((candidate): void => {
      const address = candidate.toString();

      if (!result[address]) {
        result[address] = [];
      }

      result[address].push(voter);
    });

    return result;
  }, {});
}

function Overview ({ className, prime }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber, []);
  const electionsInfo = useCall<DerivedElectionsInfo>(api.derive.elections.info, []);
  const allVotes = useCall<Record<string, AccountId[]>>(api.query.electionsPhragmen?.votesOf, [], {
    transform: transformVotes
  });

  return (
    <div className={className}>
      <Summary
        bestNumber={bestNumber}
        electionsInfo={electionsInfo}
      />
      <Button.Group>
        <SubmitCandidacy electionsInfo={electionsInfo} />
        <Button.Or />
        <Vote electionsInfo={electionsInfo} />
      </Button.Group>
      <Members
        allVotes={allVotes}
        electionsInfo={electionsInfo}
        prime={prime}
      />
      <Candidates
        allVotes={allVotes}
        electionsInfo={electionsInfo}
      />
    </div>
  );
}

export default React.memo(Overview);

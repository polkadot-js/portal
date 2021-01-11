// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBounties } from '@polkadot/api-derive/types';
import type { BlockNumber, Bounty, BountyIndex } from '@polkadot/types/interfaces';

import { fireEvent, render } from '@testing-library/react';
import BN from 'bn.js';
import React, { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { lightTheme } from '@polkadot/apps/themes';
import { POLKADOT_GENESIS } from '@polkadot/apps-config';
import { Metadata } from '@polkadot/metadata';
import metaStatic from '@polkadot/metadata/static';
import { ApiContext } from '@polkadot/react-api';
import { ApiProps } from '@polkadot/react-api/types';
import i18next from '@polkadot/react-components/i18n';
import { TypeRegistry } from '@polkadot/types/create';

import Bounties from './Bounties';
import { BountyApi } from './hooks';

function aBounty (): Bounty {
  return new TypeRegistry().createType('Bounty');
}

function anIndex (): BountyIndex {
  return new TypeRegistry().createType('BountyIndex');
}

function balanceOf (number: number) {
  return new TypeRegistry().createType('Balance', new BN(number));
}

function aGenesisHash () {
  return new TypeRegistry().createType('Hash', POLKADOT_GENESIS);
}

let mockBountyApi: BountyApi = {
  approveBounty: jest.fn(),
  bestNumber: new BN(1) as BlockNumber,
  bounties: [] as DeriveBounties,
  bountyDepositBase: new BN(1),
  bountyValueMinimum: new BN(1),
  closeBounty: jest.fn(),
  dataDepositPerByte: new BN(1),
  maximumReasonLength: 100,
  proposeBounty: jest.fn()
};

let mockBalance = balanceOf(1);
let apiWithAugmentations: ApiPromise;

const mockTreasury = {
  burn: new BN(1),
  spendPeriod: new BN(0),
  value: balanceOf(1)
};

jest.mock('./hooks', () => {
  return {
    useBalance: () => mockBalance,
    useBounties: () => mockBountyApi
  };
});

jest.mock('@polkadot/react-hooks/useTreasury', () => {
  return {
    useTreasury: () => mockTreasury
  };
});

export function createApiWithAugmentations (): ApiPromise {
  const registry = new TypeRegistry();
  const metadata = new Metadata(registry, metaStatic);

  registry.setMetadata(metadata);

  const api = new ApiPromise({ provider: new WsProvider('ws://', false), registry });

  api.injectMetadata(metadata, true);

  return api;
}

describe('Bounties', () => {
  beforeAll(async () => {
    await i18next.changeLanguage('en');
    apiWithAugmentations = createApiWithAugmentations();
  });

  const renderBounties = (bountyApi: Partial<BountyApi> = {}, { balance = 1 } = {}) => {
    mockBountyApi = { ...mockBountyApi, ...bountyApi };
    mockBalance = balanceOf(balance);
    const mockApi: ApiProps = { api: {
      derive: {
        accounts: { info: () => Promise.resolve(() => { /**/ }) }
      },
      genesisHash: aGenesisHash(),
      query: {},
      registry: { chainDecimals: 12 }
    },
    systemName: 'substrate' } as unknown as ApiProps;

    return render(
      <Suspense fallback='...'>
        <MemoryRouter>
          <ThemeProvider theme={lightTheme}>
            <ApiContext.Provider value={mockApi}>
              <Bounties/>
            </ApiContext.Provider>
          </ThemeProvider>
        </MemoryRouter>
      </Suspense>
    );
  };

  it('creates correct bounty with proposal', () => {
    const bounty = apiWithAugmentations.registry.createType('Bounty', {
      curatorDeposit: new BN(1),
      status: 'Funded',
      value: new BN(10)
    });

    expect(bounty.curatorDeposit.eq(new BN(1))).toBeTruthy();
    expect(bounty.status.isFunded).toBeTruthy();
    expect(bounty.value.eq(new BN(10))).toBeTruthy();
  });

  it('creates correct proposal', () => {
    const proposal = apiWithAugmentations.registry.createType('Proposal', apiWithAugmentations.tx.bounties.proposeCurator(0, '5EYCAe5ijiYfyeZ2JJCGq56LmPyNRAKzpG4QkoQkkQNB5e6Z', 1));

    expect(proposal.args[0].eq(new BN(0))).toBeTruthy();
    expect(proposal.args[1].toString()).toEqual('5EYCAe5ijiYfyeZ2JJCGq56LmPyNRAKzpG4QkoQkkQNB5e6Z');
    expect(proposal.args[2].eq(new BN(1))).toBeTruthy();
    expect(proposal.method).toEqual('proposeCurator');
  });

  it('creates correct votes', () => {
    const votes = apiWithAugmentations.registry.createType('Votes', { ayes: ['5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'], index: 0, nays: ['5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'], threshold: 4 });

    expect(votes.ayes.length).toEqual(1);
    expect(votes.ayes[0].toString()).toEqual('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY');
    expect(votes.nays.length).toEqual(1);
    expect(votes.nays[0].toString()).toEqual('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty');
    expect(votes.index.toNumber()).toEqual(0);
    expect(votes.threshold.toNumber()).toEqual(4);
  });

  it('shows empty list when no bounties', async () => {
    const { findByText } = renderBounties();

    expect(await findByText('No open bounties')).toBeTruthy();
  });

  it('renders a bounty', async () => {
    const { findByText, queryAllByText } = renderBounties({ bounties: [{ bounty: aBounty(), description: 'kusama comic book', index: anIndex(), proposals: [] }] });

    expect(await findByText('kusama comic book')).toBeTruthy();
    expect(queryAllByText('No open bounties')).toHaveLength(0);
  });

  describe('create bounty modal', () => {
    it('validates bounty length', async () => {
      const { findByTestId, findByText } = renderBounties({ maximumReasonLength: 5 });

      const addBountyButton = await findByText('Add Bounty');

      fireEvent.click(addBountyButton);

      const titleInput = await findByTestId('bounty title');

      fireEvent.change(titleInput, { target: { value: 'longer than 5' } });

      expect(await findByText('Title too long')).toBeTruthy();
    });

    it('validates balance is enough for bond', async () => {
      const { findByTestId, findByText, queryByText } = renderBounties(
        { bountyDepositBase: new BN(10), dataDepositPerByte: new BN(1) },
        { balance: 10 }
      );

      const addBountyButton = await findByText('Add Bounty');

      fireEvent.click(addBountyButton);
      expect(await findByText('Description of the Bounty (to be stored on-chain)')).toBeTruthy(); // wait for load

      expect(queryByText('Account does not have enough funds.')).toBeFalsy();

      const titleInput = await findByTestId('bounty title');

      fireEvent.change(titleInput, { target: { value: 'add bytes' } });

      expect(await findByText('Account does not have enough funds.')).toBeTruthy();
    });
  });

  describe('Extended status for curator', () => {
    it('Curator under voting', () => {
      const bounty = new TypeRegistry().createType('Bounty', { status: 'Funded', value: new BN(151) });
      const proposal = apiWithAugmentations.registry.createType('Proposal', apiWithAugmentations.tx.bounties.proposeCurator(0, '5EYCAe5ijiYfyeZ2JJCGq56LmPyNRAKzpG4QkoQkkQNB5e6Z', 1));
      const votes = apiWithAugmentations.registry.createType('Votes', { ayes: ['5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'], index: 0, nays: ['5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'], threshold: 4 });

      console.log('To be continued', bounty, proposal, votes);
    });
  });
});

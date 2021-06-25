// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { screen } from '@testing-library/react';

import { StakerState } from '@polkadot/react-hooks/types';

import { mockHooks } from '../../test/hooks/defaults';
import { PayoutsPage } from '../../test/pages/payoutsPage';

jest.mock('@polkadot/react-hooks/useOwnEraRewards', () => ({
  useOwnEraRewards: () => mockHooks.ownEraRewards
}));

describe('Payouts', () => {
  let payoutsPage: PayoutsPage;
  const someOwnedValidator: StakerState = {
    controllerId: 'someId',
    hexSessionIdNext: '0x1112',
    hexSessionIdQueue: 'sth',
    isLoading: false,
    isOwnController: false,
    isOwnStash: false,
    isStashNominating: false,
    isStashValidating: false,
    sessionIds: [],
    stashId: 'someStashId'
  };

  beforeEach(() => {
    payoutsPage = new PayoutsPage();
  });

  describe('empty view', () => {
    it('renders `My validators/stashes` toggle', async () => {
      payoutsPage.renderPage([]);

      await payoutsPage.expectText('My validators');
      await payoutsPage.expectText('My stashes');
    });

    it('when no own validators, then `My validators` is disabled and not selected', async () => {
      payoutsPage.renderPage([]);

      await payoutsPage.expectMyValidators({ isDisabled: true, isSelected: false });
    });

    it('when some own validators, then `My validators` is enabled and selected', async () => {
      payoutsPage.renderPage([someOwnedValidator]);

      await payoutsPage.expectMyValidators({ isDisabled: false, isSelected: true });
    });

    it('when some own validators, but after accounts load and rerender, then `My validators` is selected',
      async () => {
        payoutsPage.renderPage([]);
        await payoutsPage.expectMyValidators({ isDisabled: true, isSelected: false });
        payoutsPage.renderPage([someOwnedValidator]);
        await payoutsPage.expectMyValidators({ isDisabled: false, isSelected: true });
      });

    it('when loading validators, then `My validators` and `My stashes` are not rendered', () => {
      payoutsPage.renderPage();

      expect((screen.queryByText('My validators'))).not.toBeInTheDocument();
      expect((screen.queryByText('My stashes'))).not.toBeInTheDocument();
    });

    it('when loading own era rewards, then `My validators` and `My stashes` are disabled', async () => {
      mockHooks.ownEraRewards.isLoadingRewards = true;

      payoutsPage.renderPage([]);
      await payoutsPage.expectMyValidators({ isDisabled: true, isSelected: false });
      await payoutsPage.expectMyStashes({ isDisabled: true, isSelected: true });
    });
  });
});

// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { render, RenderResult, screen } from '@testing-library/react';
import BN from 'bn.js';
import React, { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import Payouts from '@polkadot/app-staking/Payouts';
import { lightTheme } from '@polkadot/apps/themes';
import { ApiContext } from '@polkadot/react-api';
import registry from '@polkadot/react-api/typeRegistry';
import { ApiProps } from '@polkadot/react-api/types';
import { QueueProvider } from '@polkadot/react-components/Status/Context';
import { QueueProps, QueueTxExtrinsicAdd } from '@polkadot/react-components/Status/types';
import { StakerState } from '@polkadot/react-hooks/types';

class NotYetRendered extends Error {}

export class PayoutsPage {
  renderResult?: RenderResult;

  renderPage (ownValidators?: StakerState[]): void {
    const mockApi: ApiProps = {
      api: {
        consts: {
          staking: {
            maxNominatorRewardedPerValidator: registry.createType('u32', 16)
          }
        },
        derive: {
          accounts: {
            info: () => {
              return Promise.resolve(() => { /**/
              });
            }
          },
          session: {
            eraLength: () => new BN(1000)
          }
        },
        query: {
          staking: {
            bonded: {
              multi: () => []
            },
            historyDepth: () => new BN(1),
            ledger: {
              multi: () => []
            }
          }
        },
        tx: {
          staking: {
            payoutStakers: () => { /**/
            }
          }
        }
      },
      systemName: 'substrate'
    } as unknown as ApiProps;

    const queue = { queueExtrinsic: jest.fn() as QueueTxExtrinsicAdd } as QueueProps;

    const content = <>
      <div id='tooltips'/>
      <Suspense fallback='...'>
        <QueueProvider value={queue}>
          <MemoryRouter>
            <ThemeProvider theme={lightTheme}>
              <ApiContext.Provider value={mockApi}>
                <Payouts ownValidators={ownValidators}/>
              </ApiContext.Provider>
            </ThemeProvider>
          </MemoryRouter>
        </QueueProvider>
      </Suspense>
    </>;

    if (!this.hasBeenRendered()) {
      this.renderResult = render(content);
    } else {
      this.renderResult.rerender(content);
    }
  }

  private hasBeenRendered (): this is { renderResult: RenderResult; } {
    return this.renderResult !== undefined;
  }

  private assertRendered (): asserts this is { renderResult: RenderResult; } {
    if (!this.hasBeenRendered()) {
      throw new NotYetRendered();
    }
  }

  async expectText (expected: string): Promise<void> {
    this.assertRendered();
    expect(await screen.findByText(expected)).toBeTruthy();
  }

  async expectMyValidators (expected: {isDisabled: boolean, isSelected: boolean}): Promise<void> {
    await this.expectToggleOption('My validators', expected);
  }

  async expectMyStashes (expected: {isDisabled: boolean, isSelected: boolean}): Promise<void> {
    await this.expectToggleOption('My stashes', expected);
  }

  async expectToggleOption (toggleText: string, expected: {isDisabled: boolean, isSelected: boolean}): Promise<void> {
    this.assertRendered();
    const toggleOption = await screen.findByText(toggleText) as HTMLButtonElement;

    expect(toggleOption).toBeVisible();

    if (expected.isDisabled) {
      expect(toggleOption).toHaveClass('isDisabled');
    } else {
      expect(toggleOption).not.toHaveClass('isDisabled');
    }

    if (expected.isSelected) {
      expect(toggleOption).toHaveClass('isSelected');
    } else {
      expect(toggleOption).not.toHaveClass('isSelected');
    }
  }
}

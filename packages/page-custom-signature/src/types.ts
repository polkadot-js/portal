// Copyright 2017-2020 @polkadot/app-custom-signature authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface ComponentProps {
  allAccounts: string[];
  className?: string;
  isMine: boolean;
  sudoKey?: string;
}

// Ethereum provider types
interface RequestArguments {
  method: string;
  params?: unknown[] | Record<string, unknown>;
}

export interface EthereumProvider {
  isMetaMask?: boolean;
  on: (event: string, handler: (response: any) => void) => void;
  request: (args: RequestArguments) => Promise<unknown>;
}

export interface EcdsaAddressFormat {
  ethereum: string;
  ss58: string;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

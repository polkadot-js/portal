// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IconName } from '@fortawesome/fontawesome-svg-core';
import type { WithTranslation } from 'react-i18next';
import type { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import type { Abi } from '@polkadot/api-contract';
import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { AccountId, Index } from '@polkadot/types/interfaces';
import type { TxCallback, TxFailedCallback } from './Status/types';

export type StringOrNull = string | null;

export type VoidFn = () => void;

export interface BareProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface AppProps {
  basePath: string;
  className?: string;
  onStatusChange: (status: ActionStatus) => void;
}

export type I18nProps = BareProps & WithTranslation;

export interface TxButtonProps {
  accountId?: AccountId | StringOrNull;
  accountNonce?: Index;
  className?: string;
  extrinsic?: SubmittableExtrinsic | SubmittableExtrinsic[] | null;
  icon?: IconName;
  isBasic?: boolean;
  isBusy?: boolean;
  isDisabled?: boolean;
  isIcon?: boolean;
  isToplevel?: boolean;
  isUnsigned?: boolean;
  label?: React.ReactNode;
  onClick?: VoidFn;
  onFailed?: TxFailedCallback;
  onSendRef?: React.MutableRefObject<VoidFn | undefined>;
  onStart?: VoidFn;
  onSuccess?: TxCallback;
  onUpdate?: TxCallback;
  params?: any[] | (() => any[]);
  tooltip?: string;
  tx?: string;
  withoutLink?: boolean;
  withSpinner?: boolean;
}

export type BitLength = 8 | 16 | 32 | 64 | 128 | 256;

interface ContractBase {
  abi: Abi;
}

export interface Contract extends ContractBase {
  address: null;
}

export interface ContractDeployed extends ContractBase {
  address: string;
}

export type CallContract = ContractDeployed;

export interface NullContract {
  abi: null;
  address: null;
}

export interface ThemeDef {
  bgInput: string;
  bgInputError: string;
  bgInverse: string;
  bgMenu: string;
  bgMenuHover: string;
  bgPage: string;
  bgTable: string;
  bgTabs: string;
  bgToggle: string;
  borderTable: string;
  borderTabs: string;
  color: string;
  colorCheckbox: string;
  colorError: string;
  colorLabel: string;
  colorSummary: string;
  contentHalfWidth: string;
  contentMaxWidth: string;
  fontSans: string;
  fontMono: string;
  fontWeightLight: number;
  fontWeightNormal: number;
  theme: 'dark' | 'light';
}

export interface ThemeProps {
  theme: ThemeDef;
}

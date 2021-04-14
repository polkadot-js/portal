// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types';

import Component from '@polkadot/app-custom-signature';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: [
        'tx.ethCall.call'
      ]
    },
    group: 'accounts',
    icon: 'signature',
    name: 'custom-signature',
    text: t('nav.custom-signature', 'Custom Signature', { ns: 'apps-routing' })
  };
}

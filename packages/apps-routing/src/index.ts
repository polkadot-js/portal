// Copyright 2017-2021 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Routes } from './types';

import accounts from './accounts';
import addresses from './addresses';
import assets from './assets';
import bounties from './bounties';
import calendar from './calendar';
import claims from './claims';
import contracts from './contracts';
import council from './council';
import customSignature from './custom-signature';
import democracy from './democracy';
import explorer from './explorer';
import extrinsics from './extrinsics';
import gilt from './gilt';
import js from './js';
import parachains from './parachains';
import poll from './poll';
import rpc from './rpc';
import settings from './settings';
import signing from './signing';
import society from './society';
import staking from './staking';
import storage from './storage';
import sudo from './sudo';
import techcomm from './techcomm';
import transfer from './transfer';
import treasury from './treasury';

export default function create (t: TFunction): Routes {
  return [
    accounts(t),
    addresses(t),
    explorer(t),
    claims(t),
    customSignature(t),
    poll(t),
    transfer(t),
    staking(t),
    democracy(t),
    council(t),
    treasury(t),
    bounties(t),
    techcomm(t),
    parachains(t),
    gilt(t),
    assets(t),
    society(t),
    calendar(t),
    contracts(t),
    storage(t),
    extrinsics(t),
    rpc(t),
    signing(t),
    sudo(t),
    js(t),
    settings(t)
  ];
}

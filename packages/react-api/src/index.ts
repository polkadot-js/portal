// Copyright 2017-2019 @polkadot/react-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Api, { api } from './Api';
import ApiContext from './ApiContext';
import registry from './typeRegistry';

import { withApi, withCalls, withCallDiv, withMulti, withObservable } from './hoc';
import { isLedgerCapable, isLedger, clearLedger, getLedger } from './ledger';

export default Api;

export {
  api,
  Api,
  ApiContext,
  registry,
  withApi, withCalls, withCallDiv, withMulti, withObservable,
  isLedgerCapable, isLedger, clearLedger, getLedger
};

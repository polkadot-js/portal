// Copyright 2017-2019 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { withObservableDiv } from './with/index';

const Component: React.ComponentType<any> = withObservableDiv('isConnected')(
  (value: boolean = false): string => {
    return value
      ? 'connected'
      : 'disconnected';
  },
  { className: 'rx--Connected' }
);

export default Component;

// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { GroupProps } from './types';

import React from 'react';
import SUIButton from 'semantic-ui-react/dist/commonjs/elements/Button/Button';
import styled from 'styled-components';

function ButtonGroup ({ children, className = '', isBasic, isCentered }: GroupProps): React.ReactElement<GroupProps> {
  return (
    <div className={`${className} ui--Button-Group ${isCentered ? 'centered' : ''}`}>
      <SUIButton.Group
        basic={isBasic}
        size='small'
      >
        {children}
      </SUIButton.Group>
    </div>
  );
}

export default React.memo(styled(ButtonGroup)`
  text-align: right;

  :not(:first-child) {
    margin-top: 0.75rem;
  }

  &.centered {
    margin-bottom: 0.5rem;
    text-align: center;
  }

  &+.ui--Table {
    margin-top: 1.5rem;
  }

  .ui--Button {
    margin-left: 1px !important;

    &:not(:first-of-type) {
      border-bottom-left-radius: 0rem !important;
      border-top-left-radius: 0rem !important;
    }

    &:not(:last-of-type) {
      border-bottom-right-radius: 0 !important;
      border-top-right-radius: 0 !important;
    }
  }
`);

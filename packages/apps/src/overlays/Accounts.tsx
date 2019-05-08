// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

import React from 'react';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { withApi, withMulti, withObservable } from '@polkadot/ui-api';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';

import translate from '../translate';

type Props = I18nProps & ApiProps & {
  allAccounts?: SubjectInfo
};

type State = {
  isDismissed: boolean,
  hasAccounts: boolean
};

const Wrapper = styled.div`
  background: #FFFACD;
  bottom: 0;
  left: 0;
  line-height: 1.5em;
  padding: 1em 5em;
  position: fixed;
  right: 0;
  text-align: center;
  z-index: 500;
`;

class Accounts extends React.PureComponent<Props, State> {
  state: State = {
    isDismissed: false,
    hasAccounts: false
  };

  static getDerivedStateFromProps ({ allAccounts }: Props, prevState: State): State | null {
    if (!allAccounts) {
      return null;
    }

    const hasAccounts = Object.keys(allAccounts).length !== 0;

    if (hasAccounts === prevState.hasAccounts) {
      return null;
    }

    return {
      hasAccounts
    } as State;
  }

  render () {
    const { isApiReady } = this.props;
    const { isDismissed, hasAccounts } = this.state;

    if (!isApiReady || isDismissed || hasAccounts) {
      return null;
    }

    return (
      <Wrapper>
        <Trans i18nKey='noAccounts'>You have no accounts. Some features such as the ability to send extrinsics only become available once you have accounts. <Link to ='/accounts'>Create an account now.</Link></Trans>
      </Wrapper>
    );
  }
}

export default withMulti(
  Accounts,
  translate,
  withApi,
  withObservable(accountObservable.subject, { propName: 'allAccounts' })
);

// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Tuple } from '@polkadot/types/codec';
import { withApiCall, withMulti } from '@polkadot/ui-react-rx/with/index';

import Proposal from './Proposal';
import translate from './translate';

type Props = I18nProps & {
  query_democracy_publicProps?: Array<Tuple>
};

class Proposals extends React.PureComponent<Props> {
  render () {
    const { t } = this.props;

    return (
      <section className='democracy--Proposals'>
        <h1>{t('proposals.header', {
          defaultValue: 'proposals'
        })}</h1>
        {this.renderProposals()}
      </section>
    );
  }

  private renderProposals () {
    const { query_democracy_publicProps, t } = this.props;

    if (!query_democracy_publicProps || !query_democracy_publicProps.length) {
      return (
        <div className='ui disabled'>
          {t('proposals.none', {
            defaultValue: 'no available proposals'
          })}
        </div>
      );
    }

    return query_democracy_publicProps.map((proposal) => (
      <Proposal
        idNumber={proposal[0]}
        key={proposal[0].toString()}
        value={proposal}
      />
    ));
  }
}

export default withMulti(
  Proposals,
  translate,
  withApiCall('query.democracy.publicProps')
);

// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { Info } from './types';

import React from 'react';
import { CardSummary } from '@polkadot/ui-app/index';
import { BestNumber } from '@polkadot/ui-reactive/index';

import translate from './translate';

type Props = I18nProps & {
  info?: Info;
};

class Summary extends React.PureComponent<Props> {
  render () {
    const { info = {}, t } = this.props;

    return (
      <summary>
        <section>
          <CardSummary
            label={t('summary.peers', {
              defaultValue: 'total peers'
            })}
          >
            {
              info.health
                ? `${info.health.peers.toNumber()}`
                : '-'
            }
          </CardSummary>
        </section>
        <section>
          <CardSummary
            label={t('summary.queued', {
              defaultValue: 'queued tx'
            })}
          >
            {
              info.extrinsics
                ? `${info.extrinsics.length}`
                : '-'
            }
          </CardSummary>
        </section>
        <section>
          <CardSummary
            label={t('summary.best', {
              defaultValue: 'best'
            })}
          >
            <BestNumber />
          </CardSummary>
          <CardSummary
            label={t('summary.sync', {
              defaultValue: 'syncing'
            })}
          >
            {
              info.health
                ? (
                  info.health.isSyncing.valueOf()
                    ? t('summary.syncyes', {
                      defaultValue: 'yes'
                    })
                    : t('summary.syncno', {
                      defaultValue: 'no'
                    })
                )
                : '-'
            }
          </CardSummary>
        </section>
      </summary>
    );
  }
}

export default translate(Summary);

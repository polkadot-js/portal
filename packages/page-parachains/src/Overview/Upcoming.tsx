// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParaGenesisArgs, ParaId } from '@polkadot/types/interfaces';

import React, { useRef } from 'react';
import styled from 'styled-components';

import { Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  ids: ParaId;
}

// parasSudoWrapper.sudoScheduleParaInitialize



function Upcoming ({ ids }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const info = useCall<ParaGenesisArgs>(api.query.paras.upcomingParasGenesis, [id], transformGenesis);

  const headerRef = useRef([
    [t('upcoming'), 'start']
  ]);

  return (
    <Table
      empty={ids && t<string>('There are no upcoming parachains')}
      header={headerRef.current}
    >
      {ids?.map((id): React.ReactNode => (
        <tr key={id.toString()}>
          <td className='number'>
            <h1>{id.toString()}</h1>
          </td>
        </tr>
      ))}
    </Table>
  );
}

export default React.memo(styled(Upcoming)`
  tbody tr {
    cursor: pointer;
  }
`);

// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BondInfo } from './partials/types';

import React, { useState } from 'react';
import { Button, Modal, TxButton } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import BondPartial from './partials/Bond';

function NewStash (): React.ReactElement {
  const { t } = useTranslation();
  const [isVisible, toggleVisible] = useToggle();
  const [{ bondTx, stashId }, setBondInfo] = useState<BondInfo>({});

  return (
    <>
      <Button
        icon='add'
        key='new-stash'
        label={t('Stash')}
        onClick={toggleVisible}
      />
      {isVisible && (
        <Modal
          header={t('Bonding Preferences')}
          size='large'
        >
          <Modal.Content>
            <BondPartial onChange={setBondInfo} />
          </Modal.Content>
          <Modal.Actions onCancel={toggleVisible}>
            <TxButton
              accountId={stashId}
              extrinsic={bondTx}
              icon='sign-in'
              isDisabled={!bondTx || !stashId}
              isPrimary
              label={t('Bond')}
              onStart={toggleVisible}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(NewStash);

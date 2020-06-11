// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { QueueTx, QueueTxMessageSetStatus, QueueTxResult, QueueTxStatus } from '@polkadot/react-components/Status/types';
import { DefinitionRpcExt, SignerPayloadJSON } from '@polkadot/types/types';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ApiPromise } from '@polkadot/api';
import { Modal, StatusContext } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { assert, isFunction } from '@polkadot/util';
import { format } from '@polkadot/util/logger';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  currentItem: QueueTx;
}

function SignerModal ({ className = '', currentItem }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  return (
    <Modal
      className={`ui--signer-Signer ${className}`}
      header={t('Authorize transaction')}
      size='large'
    >
      <ErrorBoundary onError={this.onRenderError}>
        {this.renderContent()}
      </ErrorBoundary>
      {this.renderButtons()}
    </Modal>
  );
}

export default React.memo(styled(SignerModal)``);

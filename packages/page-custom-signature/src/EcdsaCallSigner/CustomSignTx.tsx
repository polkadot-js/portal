// Copyright 2017-2020 @polkadot/app-custom-signature authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';

import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import { Button, Extrinsic, Icon, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { u8aToHex } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  // method that takes the payload and returns its signature
  onClickSignTx: (payload: string) => Promise<string | undefined>;
  // the ss58 encoded address of the sender
  sender: string;
  className?: string;
}

function CustomSignTx ({ className, onClickSignTx, sender }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [method, setMethod] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [callSignature, setCallSignature] = useState<string>();
  // internal message state
  const [errorMessage, setErrorMessage] = useState<Error>();

  const [isModalOpen, toggleModalView] = useToggle();

  const _onChangeExtrinsic = useCallback(
    (method: SubmittableExtrinsic<'promise'> | null = null) => {
      // reset the signature if the user changes the extrinsic
      setCallSignature(undefined);
      setMethod(() => method);
    }, []
  );

  const _onClickSignCall = useCallback(async () => {
    if (method) {
      setIsBusy(true);
      // fixme: the call serialization method is different from what the chain is expecting, which will spit a `Bad Signature` error
      const callPayload = u8aToHex(method.toU8a(true).slice(1));

      try {
        // reset the error message if it already exists
        if (typeof errorMessage !== 'undefined') {
          setErrorMessage(undefined);
        }

        const callSig = await onClickSignTx(callPayload);

        setCallSignature(callSig);

        if (!isModalOpen) {
          toggleModalView();
        }
      } catch (err) {
        console.log(err);
        setErrorMessage(err);
      } finally {
        setIsBusy(false);
      }
    }
  }, [errorMessage, method, onClickSignTx, isModalOpen, toggleModalView]);

  // transaction confirmation modal
  const TransactionModal = useCallback(() => {
    return (
      <>
        <Modal
          className='app--accounts-Modal'
          header={t<string>('Transaction Confirmation')}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns>
              <p>{t<string>('Submit the signed transaction to the chain.')}</p>
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleModalView}>
            <TxButton
              icon='paper-plane'
              isDisabled={!callSignature}
              isUnsigned
              label={t<string>('Send Transaction')}
              onStart={toggleModalView}
              params={[method, sender, callSignature]}
              tx={api.tx.ethCall.call}
              withSpinner
            />
          </Modal.Actions>
        </Modal>
      </>
    );
  }, [t, method, sender, callSignature, api, toggleModalView]);

  return (
    <div className={className}>
      <Extrinsic
        defaultValue={api.tx.balances.transfer}
        label={t<string>('submit the following extrinsic')}
        onChange={_onChangeExtrinsic}
      />
      <Button.Group>
        {callSignature && isModalOpen && <TransactionModal />}
        <Button
          icon='sign-in-alt'
          isBusy={isBusy || isModalOpen}
          isDisabled={!method || !api.tx.ethCall.call}
          label={t<string>('Sign Transaction')}
          onClick={_onClickSignCall}
        />
      </Button.Group>
      {errorMessage && (
        <article className='error padded'>
          <div>
            <Icon icon='ban' />
            {errorMessage.message}
          </div>
        </article>
      )}
    </div>
  );
}

export default React.memo(styled(CustomSignTx)`

`);

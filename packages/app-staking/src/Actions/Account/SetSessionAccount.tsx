// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-api/types';
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Button, InputAddress, Modal, TxButton } from '@polkadot/ui-app';
import { withApi, withMulti } from '@polkadot/ui-api';

import ValidationSessionKey from './InputValidationSessionKey';
import translate from '../../translate';

type Props = I18nProps & ApiProps & {
  controllerId: string;
  isOpen: boolean;
  onClose: () => void;
  sessionIds: string[];
  stashId: string;
};

interface State {
  ed25519: string;
  ed25519Error: string | null;
  sr25519: string;
  sr25519Error: string | null;
}

class SetSessionKey extends React.PureComponent<Props, State> {
  public state: State;

  public constructor (props: Props) {
    super(props);

    this.state = {
      ed25519: props.sessionIds[0] || props.controllerId,
      ed25519Error: null,
      sr25519: props.sessionIds[1] || props.controllerId,
      sr25519Error: null
    };
  }

  public render (): React.ReactNode {
    const { controllerId, isOpen, isSubstrateV2, onClose, t } = this.props;
    const { ed25519, ed25519Error, sr25519, sr25519Error } = this.state;

    if (!isOpen) {
      return null;
    }

    const hasError = !ed25519 || !!ed25519Error || (isSubstrateV2 ? (!sr25519 || !!sr25519Error) : false);

    return (
      <Modal
        className='staking--SetSessionAccount'
        dimmer='inverted'
        open
        size='small'
      >
        {this.renderContent()}
        <Modal.Actions>
          <Button.Group>
            <Button
              isNegative
              onClick={onClose}
              label={t('Cancel')}
            />
            <Button.Or />
            <TxButton
              accountId={controllerId}
              isDisabled={hasError}
              isPrimary
              label={t('Set Session Key')}
              onClick={onClose}
              params={
                isSubstrateV2
                  ? [{ ed25519, sr25519 }, new Uint8Array([])]
                  : [ed25519]
              }
              tx={
                isSubstrateV2
                  ? 'session.setKeys'
                  : 'session.setKey'
              }
            />
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }

  private renderContent (): React.ReactNode {
    const { controllerId, isSubstrateV2, stashId, t } = this.props;
    const { ed25519, sr25519 } = this.state;

    return (
      <>
        <Modal.Header>
          {t('Set Session Key')}
        </Modal.Header>
        <Modal.Content className='ui--signer-Signer-Content'>
          <InputAddress
            className='medium'
            defaultValue={controllerId}
            isDisabled
            label={t('controller account')}
          />
          <InputAddress
            className='medium'
            help={t('Changing the key only takes effect at the start of the next session. If validating, it must be an ed25519 key.')}
            label={
              isSubstrateV2
                ? t('Grandpa key (ed25519)')
                : t('Session key (ed25519)')
            }
            onChange={this.onChangeEd25519}
            value={ed25519}
          />
          <ValidationSessionKey
            controllerId={controllerId}
            onError={this.onSessionErrorEd25519}
            sessionId={ed25519}
            stashId={stashId}
          />
          {
            isSubstrateV2
              ? (
                <>
                  <InputAddress
                    className='medium'
                    help={t('Changing the key only takes effect at the start of the next session. If validating, it must be an sr25519 key.')}
                    label={t('Babe key (sr25519)')}
                    onChange={this.onChangeSr25519}
                    value={sr25519}
                  />
                  <ValidationSessionKey
                    controllerId={controllerId}
                    onError={this.onSessionErrorSr25519}
                    sessionId={sr25519}
                    stashId={stashId}
                  />
                </>
              )
              : null
          }

        </Modal.Content>
      </>
    );
  }

  private onChangeEd25519 = (ed25519: string): void => {
    this.setState({ ed25519 });
  }

  private onChangeSr25519 = (sr25519: string): void => {
    this.setState({ sr25519 });
  }

  private onSessionErrorEd25519 = (ed25519Error: string | null): void => {
    this.setState({ ed25519Error });
  }

  private onSessionErrorSr25519 = (sr25519Error: string | null): void => {
    this.setState({ sr25519Error });
  }
}

export default withMulti(
  SetSessionKey,
  translate,
  withApi
);

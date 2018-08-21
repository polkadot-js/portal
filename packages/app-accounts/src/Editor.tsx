// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair } from '@polkadot/util-keyring/types';
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';

import Button from '@polkadot/ui-app/Button';
import Input from '@polkadot/ui-app/Input';
import InputAddress from '@polkadot/ui-app/InputAddress';
import classes from '@polkadot/ui-app/util/classes';
import keyring from '@polkadot/ui-keyring/index';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import withObservableBase from '@polkadot/ui-react-rx/with/observableBase';

import AddressSummary from '@polkadot/ui-app/AddressSummary';
import UploadButton from './UploadButton';
import translate from './translate';

type Props = I18nProps & {
  accountAll?: Array<any>,
  onBack: () => void
};

type State = {
  current: KeyringPair | null,
  editedName: string,
  isEdited: boolean
};

class Editor extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = this.createState(null);
  }

  render () {
    const { className, style } = this.props;

    return (
      <div
        className={classes('accounts--Editor', className)}
        style={style}
      >
        {this.renderData()}
        {this.renderButtons()}
      </div>
    );
  }

  renderButtons () {
    const { t } = this.props;
    const { current, isEdited } = this.state;

    if (!current) {
      return null;
    }

    return (
      <Button.Group>
        <Button
          isNegative
          onClick={this.onForget}
          text={t('editor.forget', {
            defaultValue: 'Forget'
          })}
        />
        <Button.Group.Divider />
        <Button
          isDisabled={!isEdited}
          onClick={this.onDiscard}
          text={t('editor.reset', {
            defaultValue: 'Reset'
          })}
        />
        <Button
          isDisabled={!isEdited}
          isPrimary
          onClick={this.onCommit}
          text={t('editor.save', {
            defaultValue: 'Save'
          })}
        />
      </Button.Group>
    );
  }

  renderData () {
    const { accountAll, t } = this.props;
    const { current, editedName } = this.state;

    if (!accountAll || !Object.keys(accountAll).length) {
      return (
        <div>
          <div>{t('editor.none', { defaultValue: 'There are no saved accounts. Create an account or upload a JSON file of a saved account.' })}</div>
          <div className='accounts--Address-wrapper'>
            <div className='accounts--Address-file'>
              <UploadButton onChangeAccount={this.onChangeAccount} />
            </div>
          </div>
        </div>
      );
    }

    const address = current
      ? current.address()
      : undefined;

    return (
      <div className='accounts--flex-group-row'>
        <div className='accounts--flex-container-col-summary'>
          <div className='accounts--flex-item'>
            <AddressSummary
              className='shrink'
              value={address || ''}
              withDownloadButton
            />
          </div>
          <UploadButton onChangeAccount={this.onChangeAccount} />
        </div>
        <div className='accounts--flex-container-col-inputs'>
          <div className='accounts--flex-item'>
            <InputAddress
              className='full'
              hideAddress
              isInput={false}
              label={t('editor.select', {
                defaultValue: 'using my account'
              })}
              onChange={this.onChangeAccount}
              type='account'
              value={address}
            />
          </div>
          <div className='accounts--flex-item'>
            <Input
              className='full'
              isEditable
              label={t('editor.name', {
                defaultValue: 'identified by the name'
              })}
              onChange={this.onChangeName}
              value={editedName}
            />
          </div>
        </div>
      </div>
    );
  }

  createState (current: KeyringPair | null): State {
    return {
      current,
      editedName: current
        ? current.getMeta().name || ''
        : '',
      isEdited: false
    };
  }

  nextState (newState: State = {} as State): void {
    this.setState(
      (prevState: State): State => {
        let { current = prevState.current, editedName = prevState.editedName } = newState;
        const previous = prevState.current || { address: () => undefined };
        let isEdited = false;

        if (current) {
          if (current.address() !== previous.address()) {
            editedName = current.getMeta().name || '';
          } else if (editedName !== current.getMeta().name) {
            isEdited = true;
          }
        } else {
          editedName = '';
        }

        return {
          current,
          editedName,
          isEdited
        };
      }
    );
  }

  onChangeAccount = (publicKey: Uint8Array): void => {
    const current = publicKey && publicKey.length === 32
      ? keyring.getPair(publicKey)
      : null;

    this.nextState({
      current
    } as State);
  }

  onChangeName = (editedName: string): void => {
    this.nextState({ editedName } as State);
  }

  onCommit = (): void => {
    const { current, editedName } = this.state;

    if (!current) {
      return;
    }

    keyring.saveAccountMeta(current, {
      name: editedName,
      whenEdited: Date.now()
    });

    this.nextState({} as State);
  }

  onDiscard = (): void => {
    const { current } = this.state;

    if (!current) {
      return;
    }

    this.nextState({
      editedName: current.getMeta().name
    } as State);
  }

  onForget = (): void => {
    const { current } = this.state;

    if (!current) {
      return;
    }

    this.setState(
      this.createState(null),
      () => {
        keyring.forgetAccount(
          current.address()
        );
      }
    );
  }
}

export {
  Editor
};

export default withObservableBase(
  accountObservable.subject, { propName: 'accountAll' }
)(translate(Editor));

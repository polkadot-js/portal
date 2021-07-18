// Copyright 2017-2021 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ActionStatus } from '@polkadot/react-components/Status/types';

import React, { useCallback, useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import store from 'store';
import styled from 'styled-components';

import { decodeUrlTypes, encodeUrlTypes } from '@polkadot/react-api/urlTypes';
import { Button, CopyButton, Editor, InputFile } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { isJsonObject, stringToU8a, u8aToString } from '@polkadot/util';

import { useTranslation } from './translate';

const EMPTY_CODE = '{\n\n}';
const EMPTY_TYPES = {};

interface AllState {
  code: string;
  isJsonValid: boolean;
  isTypesValid: boolean;
  types: Record<string, any>;
  typesPlaceholder: string | null;
}

interface Props {
  className?: string;
  onStatusChange: (status: ActionStatus) => void;
}

function Developer ({ className = '', onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [code, setCode] = useState(EMPTY_CODE);
  const [isJsonValid, setIsJsonValid] = useState(true);
  const [isTypesValid, setIsTypesValid] = useState(true);
  const [types, setTypes] = useState<Record<string, any>>(EMPTY_TYPES);
  const [typesPlaceholder, setTypesPlaceholder] = useState<string | null>(null);
  const [sharedUrl, setSharedUrl] = useState<string | null>(null);

  useEffect((): void => {
    const types = decodeUrlTypes() || store.get('types') as Record<string, unknown> || {};

    if (Object.keys(types).length) {
      setCode(JSON.stringify(types, null, 2));
      setTypes({});
      setTypesPlaceholder(Object.keys(types).join(', '));
      setSharedUrl(encodeUrlTypes(types));
    }
  }, []);

  const _setState = useCallback(
    ({ code, isJsonValid, isTypesValid, types, typesPlaceholder }: AllState): void => {
      setCode(code);
      setIsJsonValid(isJsonValid);
      setIsTypesValid(isTypesValid);
      setTypes(types);
      setTypesPlaceholder(typesPlaceholder);
    },
    []
  );

  const _clearTypes = useCallback(
    (): void => {
      store.remove('types');

      _setState({
        code: EMPTY_CODE,
        isJsonValid: true,
        isTypesValid: true,
        types: EMPTY_TYPES,
        typesPlaceholder: null
      });
    },
    [_setState]
  );

  const _onChangeTypes = useCallback(
    (data: Uint8Array): void => {
      const code = u8aToString(data);

      try {
        const types = JSON.parse(code) as Record<string, unknown>;
        const typesPlaceholder = Object.keys(types).join(', ');

        console.log('Detected types:', typesPlaceholder);

        _setState({
          code,
          isJsonValid: true,
          isTypesValid: true,
          types: Object.keys(types).length === 0 ? {} : types,
          typesPlaceholder
        });
      } catch (error) {
        console.error('Error registering types:', error);

        _setState({
          code,
          isJsonValid: false,
          isTypesValid: false,
          types: {},
          typesPlaceholder: (error as Error).message
        });
      }
    },
    [_setState]
  );

  const _onEditTypes = useCallback(
    (code: string): void => {
      try {
        if (!isJsonObject(code)) {
          throw Error(t('This is not a valid JSON object.'));
        }

        _onChangeTypes(stringToU8a(code));
      } catch (error) {
        setCode(code);
        setIsJsonValid(false);
        setTypesPlaceholder((error as Error).message);
      }
    },
    [_onChangeTypes, t]
  );

  const _saveDeveloper = useCallback(
    (): void => {
      let url: string | null = null;

      try {
        api.registerTypes(types);
        store.set('types', types);
        setIsTypesValid(true);
        onStatusChange({
          action: t<string>('Your custom types have been added'),
          status: 'success'
        });

        if (Object.keys(types).length) {
          url = encodeUrlTypes(types);

          console.log(url);
        }
      } catch (error) {
        console.error(error);
        setIsTypesValid(false);
        onStatusChange({
          action: t(`Error saving your custom types. ${(error as Error).message}`),
          status: 'error'
        });
      }

      setSharedUrl(url);
    },
    [api, onStatusChange, t, types]
  );

  const typesHasNoEntries = Object.keys(types).length === 0;

  // Trans component
  /* eslint-disable react/jsx-max-props-per-line */

  return (
    <div className={className}>
      <div className='ui--row'>
        <div className='full'>
          <InputFile
            clearContent={typesHasNoEntries && isTypesValid}
            help={t<string>('Save the type definitions for your custom structures as key-value pairs in a valid JSON file. The key should be the name of your custom structure and the value an object containing your type definitions.')}
            isError={!isTypesValid}
            label={t<string>('Additional types as a JSON file (or edit below)')}
            onChange={_onChangeTypes}
            placeholder={typesPlaceholder}
          />
        </div>
      </div>
      <div className='ui--row'>
        <div className='full'>
          <Editor
            className='editor'
            code={code}
            isValid={isJsonValid}
            onEdit={_onEditTypes}
          />
        </div>
      </div>
      <div className='ui--row'>
        <div className='full'>
          <Trans i18nKey='devConfig'><div className='help'>If you are a development team with at least a test network available, consider adding the types directly <a href='https://github.com/polkadot-js/apps/tree/master/packages/apps-config' rel='noopener noreferrer' target='_blank'>to the apps-config</a>, allowing out of the box operation for your spec &amp; chains, both for you and anybody trying to connect to it. This is not a replacement for your chain-specific UI, however doing so does help in allowing users to easily discover and use with zero-config.</div></Trans>
        </div>
      </div>
      <Button.Group>
        <CopyButton
          label={t<string>('Share')}
          type={t<string>('url')}
          value={sharedUrl}
        />
        <Button
          icon='sync'
          label={t<string>('Reset')}
          onClick={_clearTypes}
        />
        <Button
          icon='save'
          isDisabled={!isTypesValid || !isJsonValid}
          label={t<string>('Save')}
          onClick={_saveDeveloper}
        />
      </Button.Group>
    </div>
  );
}

export default React.memo(styled(Developer)`
  .editor {
    height: 21rem;
    margin-left: 2rem;
    position: relative;
  }

  .help {
    padding: 0.5rem 2rem;
  }
`);

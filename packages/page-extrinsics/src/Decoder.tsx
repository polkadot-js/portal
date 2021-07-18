// Copyright 2017-2021 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic, SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { Call } from '@polkadot/types/interfaces';

import React, { useCallback, useState } from 'react';

import { Button, Call as CallDisplay, Input, InputAddress, InputExtrinsic, MarkError, Output, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BalanceFree } from '@polkadot/react-query';
import { assert, isHex } from '@polkadot/util';

import { useTranslation } from './translate';

interface Props {
  className?: string;
}

interface ExtrinsicInfo {
  extrinsic: SubmittableExtrinsic<'promise'> | null;
  extrinsicCall: Call | null;
  extrinsicError: string | null;
  extrinsicFn: SubmittableExtrinsicFunction<'promise'> | null;
  extrinsicHash: string | null;
  extrinsicHex: string | null;
}

const DEFAULT_INFO: ExtrinsicInfo = {
  extrinsic: null,
  extrinsicCall: null,
  extrinsicError: null,
  extrinsicFn: null,
  extrinsicHash: null,
  extrinsicHex: null
};

function Decoder ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [{ extrinsic, extrinsicCall, extrinsicError, extrinsicFn, extrinsicHash }, setExtrinsicInfo] = useState<ExtrinsicInfo>(DEFAULT_INFO);
  const [accountId, setAccountId] = useState<string | null>(null);

  const _setExtrinsicHex = useCallback(
    (extrinsicHex: string): void => {
      try {
        assert(isHex(extrinsicHex), 'Expected a hex-encoded call');

        let extrinsicCall: Call;

        try {
          // cater for an extrinsic input...
          extrinsicCall = api.createType('Call', api.tx(extrinsicHex).method);
        } catch (e) {
          extrinsicCall = api.createType('Call', extrinsicHex);
        }

        const extrinsicHash = extrinsicCall.hash.toHex();
        const { method, section } = api.registry.findMetaCall(extrinsicCall.callIndex);
        const extrinsicFn = api.tx[section][method];

        const extrinsic = extrinsicFn(...extrinsicCall.args);

        setExtrinsicInfo({ ...DEFAULT_INFO, extrinsic, extrinsicCall, extrinsicFn, extrinsicHash, extrinsicHex });
      } catch (e) {
        setExtrinsicInfo({ ...DEFAULT_INFO, extrinsicError: (e as Error).message });
      }
    },
    [api]
  );

  return (
    <div className={className}>
      <Input
        isError={!extrinsicFn}
        label={t<string>('hex-encoded call')}
        onChange={_setExtrinsicHex}
        placeholder={t<string>('0x...')}
      />
      {extrinsicError && (
        <MarkError content={extrinsicError} />
      )}
      {extrinsicFn && extrinsicCall && (
        <>
          <InputExtrinsic
            defaultValue={extrinsicFn}
            isDisabled
            label={t<string>('decoded call')}
          />
          <CallDisplay
            className='details'
            value={extrinsicCall}
          />
        </>
      )}
      {extrinsicHash && (
        <Output
          isDisabled
          label='encoded call hash'
          value={extrinsicHash}
          withCopy
        />
      )}
      <InputAddress
        label={t<string>('using the selected account')}
        labelExtra={
          <BalanceFree
            label={<label>{t<string>('free balance')}</label>}
            params={accountId}
          />
        }
        onChange={setAccountId}
        type='account'
      />
      <Button.Group>
        <TxButton
          extrinsic={extrinsic}
          icon='sign-in-alt'
          isUnsigned
          label={t<string>('Submit Unsigned')}
          withSpinner
        />
        <TxButton
          accountId={accountId}
          extrinsic={extrinsic}
          icon='sign-in-alt'
          label={t<string>('Submit Transaction')}
        />
      </Button.Group>
    </div>
  );
}

export default React.memo(Decoder);

// Copyright 2017-2020 @polkadot/app-custom-signature authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

// note: this pull the chain metadata from the settings page to make the code shorter
import useChainInfo from '@polkadot/app-settings/useChainInfo';
import { AddressMini, Button, Icon } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import { EcdsaAddressFormat } from '../types';
import { useMetaMask } from '../useMetaMask';
import * as utils from '../utils';

interface Props {
  className?: string;
  onAccountChanged?: (account?: EcdsaAddressFormat) => void;
}

function EcdsaAccount ({ className = '', onAccountChanged }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { activateMetaMask, ethereum, loadedAccounts } = useMetaMask();
  const chainInfo = useChainInfo();
  // internal message state
  const [errorMessage, setErrorMessage] = useState<Error>();
  // note: currently, MetaMask will only export one account at a time.
  // so this value will always be either an empty array or an array with one item.
  const [ecdsaAccounts, setEcdsaAccounts] = useState<EcdsaAddressFormat>();

  const [isBusy, setIsBusy] = useState(false);

  const _onClickLoadAccount = useCallback(async () => {
    setIsBusy(true);

    try {
      // reset the error message if it already exists
      if (typeof errorMessage !== 'undefined') {
        setErrorMessage(undefined);
      }

      // fetch the current active account from MetaMask
      const accounts = await activateMetaMask();
      const loadingAddr = accounts[0];
      const loginMsg = `Sign this message to login with address ${loadingAddr}`;

      // send a signature method to sign an arbitrary message
      // note: we only get the first account for now
      const signature = await ethereum?.request({ method: 'personal_sign', params: [loadingAddr, loginMsg] });
      // recover the ethereum ECDSA compressed public key from the signature
      const pubKey = utils.recoverPublicKeyFromSig(loadingAddr, loginMsg, signature as string);

      console.log(`Public key: ${pubKey}`);
      // encode the public key to Substrate-compatible ss58
      // note: the default prefix is `42`, which is for the dev node
      const ss58Address = utils.ecdsaPubKeyToSs58(pubKey, chainInfo?.ss58Format);

      setEcdsaAccounts({ ethereum: loadingAddr, ss58: ss58Address });
    } catch (err) {
      setErrorMessage(err);
    } finally {
      setIsBusy(false);
    }
  }, [activateMetaMask, chainInfo, ethereum, errorMessage]);

  // reset the account cache if the user changes their account in MetaMask
  useEffect(() => {
    // check if the selected account is different from the loaded account
    if (loadedAccounts.length > 0 && ecdsaAccounts?.ethereum !== loadedAccounts[0]) {
      setEcdsaAccounts(undefined);
    }
  }, [ecdsaAccounts, loadedAccounts]);

  // emit the account change event handler
  useEffect(() => {
    onAccountChanged && onAccountChanged(ecdsaAccounts);
  }, [ecdsaAccounts, onAccountChanged]);

  return (
    <div className={`${className}`}>
      {typeof ecdsaAccounts === 'undefined'
        ? (
          <>
            <Button
              icon='sync'
              isBusy={isBusy}
              label={t<string>('Load account from MetaMask')}
              onClick={_onClickLoadAccount}
            />
          </>
        )
        : (
          <>
            <AddressMini label='Current Account'
              value={ecdsaAccounts.ss58}
              withBalance />
          </>
        )
      }
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

export default React.memo(styled(EcdsaAccount)`

`);

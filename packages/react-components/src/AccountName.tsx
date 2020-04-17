// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveAccountInfo, DeriveAccountRegistration } from '@polkadot/api-derive/types';
import { BareProps } from '@polkadot/react-api/types';
import { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { AccountSidebarToggle } from '@polkadot/app-accounts/Sidebar';
import registry from '@polkadot/react-api/typeRegistry';
import { useCall, useApi } from '@polkadot/react-hooks';
import { stringToU8a } from '@polkadot/util';

import { getAddressName } from './util';
import Badge from './Badge';
import Icon from './Icon';

interface Props extends BareProps {
  children?: React.ReactNode;
  defaultName?: string;
  label?: React.ReactNode;
  noLookup?: boolean;
  onClick?: () => void;
  override?: React.ReactNode;
  // this is used by app-account/addresses to toggle editing
  toggle?: boolean;
  value: AccountId | AccountIndex | Address | string | Uint8Array | null | undefined;
  withSidebar?: boolean;
}

const KNOWN: [AccountId, string][] = [
  [registry.createType('AccountId', stringToU8a('modlpy/socie'.padEnd(32, '\0'))), 'Society'],
  [registry.createType('AccountId', stringToU8a('modlpy/trsry'.padEnd(32, '\0'))), 'Treasury']
];

const displayCache: Map<string, React.ReactNode> = new Map();
const nameCache: Map<string, [boolean, [React.ReactNode, React.ReactNode | null]]> = new Map();

function defaultOrAddr (defaultName = '', _address: AccountId | AccountIndex | Address | string | Uint8Array, _accountIndex?: AccountIndex | null): [[React.ReactNode, React.ReactNode | null], boolean, boolean, boolean] {
  const known = KNOWN.find(([known]) => known.eq(_address));

  if (known) {
    return [[known[1], null], false, false, true];
  }

  const accountId = _address.toString();
  const accountIndex = (_accountIndex || '').toString();

  if (!accountId) {
    return [[defaultName, null], false, false, false];
  }

  const [isAddressExtracted,, extracted] = getAddressName(accountId, null, defaultName);
  const [isAddressCached, nameCached] = nameCache.get(accountId) || [false, [null, null]];

  if (extracted && isAddressCached && !isAddressExtracted) {
    // skip, default return
  } else if (nameCached[0]) {
    return [nameCached, false, isAddressCached, false];
  } else if (isAddressExtracted && accountIndex) {
    nameCache.set(accountId, [true, [accountIndex, null]]);

    return [[accountIndex, null], false, true, false];
  }

  return [[extracted, null], !isAddressExtracted, isAddressExtracted, false];
}

function extractName (address: string, accountIndex?: AccountIndex, defaultName?: string): React.ReactNode {
  const displayCached = displayCache.get(address);

  if (displayCached) {
    return displayCached;
  }

  const [[displayFirst, displaySecond], isLocal, isAddress, isSpecial] = defaultOrAddr(defaultName, address, accountIndex);

  return (
    <span className='via-identity'>
      {isSpecial && (
        <Badge
          info={<Icon name='simplybuilt' />}
          isInline
          isSmall
          type='green'
        />
      )}
      <span className={`name ${(isLocal || isSpecial) ? 'isLocal' : (isAddress ? 'isAddress' : '')}`}>{
        displaySecond
          ? <><span className='top'>{displayFirst}</span><span className='sub'>/{displaySecond}</span></>
          : displayFirst
      }</span>
    </span>
  );
}

function extractIdentity (address: string, identity: DeriveAccountRegistration): React.ReactNode {
  const judgements = identity.judgements.filter(([, judgement]): boolean => !judgement.isFeePaid);
  const isGood = judgements.some(([, judgement]): boolean => judgement.isKnownGood || judgement.isReasonable);

  const displayName = isGood
    ? identity.display
    : (identity.display || '').replace(/[^\x20-\x7E]/g, '');
  const displayParent = identity.displayParent
    ? (
      isGood
        ? identity.displayParent
        : identity.displayParent.replace(/[^\x20-\x7E]/g, '')
    )
    : undefined;

  const nameElem = (
    <div className='via-identity'>
      {
        displayParent
          ? <span className={`name ${isGood && 'isGood'}`}><span className='top'>{displayParent}</span><span className='sub'>/{displayName}</span></span>
          : <span className={`name ${isGood && 'isGood'}`}>{displayName}</span>
      }
    </div>
  );

  nameCache.set(address, [false, displayParent ? [displayParent, displayName] : [displayName, null]]);
  displayCache.set(address, nameElem);

  return nameElem;
}

function AccountName ({ children, className, defaultName, label, noLookup, onClick, override, value, withSidebar }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const info = useCall<DeriveAccountInfo>(!noLookup && api.derive.accounts.info, [value]);
  const [name, setName] = useState<React.ReactNode>(() => extractName((value || '').toString(), undefined, defaultName));
  const toggleSidebar = useContext(AccountSidebarToggle);

  const _setName = useCallback(
    (): void => {
      const { accountId, accountIndex, identity, nickname } = info || {};
      const cacheAddr = (accountId || value || '').toString();

      if (api.query.identity && api.query.identity.identityOf) {
        setName(() =>
          identity?.display
            ? extractIdentity(cacheAddr, identity)
            : extractName(cacheAddr, accountIndex)
        );
      } else if (nickname) {
        nameCache.set(cacheAddr, [false, [nickname, null]]);

        setName(nickname);
      } else {
        setName(defaultOrAddr(defaultName, cacheAddr, accountIndex));
      }
    },
    [api, defaultName, info, value]
  );

  // set the actual nickname, local name, accountIndex, accountId
  useEffect((): void => {
    _setName();
  }, [_setName]);

  const _onUpdateName = useCallback(
    (): void => {
      value && ((): void => {
        displayCache.delete(value.toString());
        nameCache.delete(value.toString());

        _setName();
      })();
    },
    [_setName, value]
  );

  const onToggleSidebar = useCallback(
    () => toggleSidebar && value && toggleSidebar([value.toString(), _onUpdateName]),
    [_onUpdateName, toggleSidebar, value]
  );

  return (
    <div
      className={`ui--AccountName ${withSidebar && 'withSidebar'} ${className}`}
      onClick={withSidebar ? onToggleSidebar : onClick}
    >
      {label || ''}{override || name}{children}
    </div>
  );
}

export default React.memo(styled(AccountName)`
  &.withSidebar {
    cursor: help !important;

    .via-identity {
      .name {
        border-top: 1px solid transparent;
        border-bottom: 1px solid transparent;
    
        &:hover {
          border-bottom: 1px dotted #333;
        }
      }
    }
  }

  .via-identity {
    display: inline-block;
    vertical-align: bottom;

    .name {
      font-weight: normal !important;
      filter: grayscale(100%);
      opacity: 0.6;
      text-transform: uppercase;

      &.isAddress {
        font-family: monospace;
        text-transform: none;
      }

      &.isGood,
      &.isLocal {
        opacity: 1;
      }

      .sub {
        font-size: 0.75rem;
        opacity: 0.75;
      }
    }

    div.name {
      display: inline-block;
    }

    > * {
      line-height: 1em;
      vertical-align: middle;
    }
  }
`);

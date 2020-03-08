// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveAccountInfo } from '@polkadot/api-derive/types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { getAddressName } from './util';
import AddressMini from './AddressMini';
import Toggle from './Toggle';

interface Props {
  address: string;
  className?: string;
  isHidden?: boolean;
  filter?: string;
  noToggle?: boolean;
  onChange?: (isChecked: boolean) => void;
  value?: boolean;
}

<<<<<<< HEAD
function AddressToggle ({ address, className, filter, isHidden = false, onChange, value }: Props): React.ReactElement<Props> | null {
=======
function getIsFiltered (address: string, filter?: string, info?: DeriveAccountInfo): boolean {
  if (!filter || address.includes(filter)) {
    return false;
  }

  const [,, extracted] = getAddressName(address);
  const filterLower = filter.toLowerCase();

  if (extracted.toLowerCase().includes(filterLower)) {
    return false;
  }

  if (info) {
    const { accountId, accountIndex, identity, nickname } = info;

    if (identity.display?.toLowerCase().includes(filterLower) || accountId?.toString().includes(filter) || accountIndex?.toString().includes(filter) || nickname?.toLowerCase().includes(filterLower)) {
      return false;
    }
  }

  return true;
}

function AddressToggle ({ address, className, filter, isHidden, noToggle, onChange, value }: Props): React.ReactElement<Props> | null {
>>>>>>> master
  const { api } = useApi();
  const info = useCall<DeriveAccountInfo>(api.derive.accounts.info as any, [address]);
  const [isFiltered, setIsFiltered] = useState(false);

  useEffect((): void => {
<<<<<<< HEAD
    let isFiltered = true;

    if (!filter || address.includes(filter)) {
      isFiltered = false;
    } else if (info) {
      const [,, extracted] = getAddressName(address);
      const filterLower = filter.toLowerCase();

      if (extracted.toLowerCase().includes(filterLower)) {
        isFiltered = false;
      } else if (info) {
        const { accountId, accountIndex, identity, nickname } = info;

        if (identity.display?.toLowerCase().includes(filterLower) || accountId?.toString().includes(filter) || accountIndex?.toString().includes(filter) || nickname?.toLowerCase().includes(filterLower)) {
          isFiltered = false;
        }
      }
    }

    setIsFiltered(isFiltered);
  }, [filter, info, value]);
=======
    setIsFiltered(getIsFiltered(address, filter, info));
  }, [address, filter, info]);
>>>>>>> master

  const _onClick = (): void => onChange && onChange(!value);

  return (
    <div
<<<<<<< HEAD
      className={`ui--AddressToggle ${className} ${value ? 'isAye' : 'isNay'} ${isHidden || isFiltered ? 'isHidden' : ''}`}
=======
      className={`ui--AddressToggle ${className} ${(value || noToggle) ? 'isAye' : 'isNay'} ${isHidden || isFiltered ? 'isHidden' : ''}`}
>>>>>>> master
      onClick={_onClick}
    >
      <AddressMini
        className='ui--AddressToggle-address'
        value={address}
      />
<<<<<<< HEAD
      <div className='ui--AddressToggle-toggle'>
        <Toggle
          label=''
          value={value}
        />
      </div>
=======
      {!noToggle && (
        <div className='ui--AddressToggle-toggle'>
          <Toggle
            label=''
            value={value}
          />
        </div>
      )}
>>>>>>> master
    </div>
  );
}

export default styled(AddressToggle)`
  align-items: flex-start;
  border: 1px solid transparent; /* #eee */
  border-radius: 0.25rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  margin: 0.125rem;
  padding: 0.125rem 0.25rem;
  text-align: left;
  vertical-align: middle;
  white-space: nowrap;

  .ui--AddressToggle-address {
    filter: grayscale(100%);
    opacity: 0.5;
  }

  &:hover {
    border-color: #ccc;
  }

  &.isHidden {
    display: none;
  }

  &.isDragging {
    background: white;
    box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.15);
  }

  &.isAye {
    cursor: move;
    .ui--AddressToggle-address {
      filter: none;
      opacity: 1;
    }
    /* border-color: #ccc; */
  }

  .ui--AddressToggle-address,
  .ui--AddressToggle-toggle {
    flex: 1;
    padding: 0;
  }

  .ui--AddressToggle-toggle {
    margin-top: 0.1rem;
    text-align: right;
  }
`;

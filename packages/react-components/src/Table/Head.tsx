// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

type HeaderDef = [React.ReactNode?, string?, number?, (() => void)?];

interface Props {
  className?: string;
  filter?: React.ReactNode;
  header?: (null | undefined | HeaderDef)[];
  isEmpty: boolean;
}

function Head ({ className = '', filter, header, isEmpty }: Props): React.ReactElement<Props> | null {
  if (!header?.length) {
    return null;
  }

  return (
    <thead className={className}>
      {filter && (
        <tr className='filter'>
          <th colSpan={100}>{filter}</th>
        </tr>
      )}
      <tr>
        {header.filter((h): h is HeaderDef => !!h).map(([label, className = 'default', colSpan = 1, onClick], index) =>
          <th
            className={className}
            colSpan={colSpan}
            key={index}
            onClick={onClick}
          >
            {index === 0
              ? <h1>{label}</h1>
              : isEmpty
                ? ''
                : label
            }
          </th>
        )}
      </tr>
    </thead>
  );
}

export default React.memo(styled(Head)`
  th {
    font-family: sans-serif;
    font-weight: 100;
    padding: 0.75rem 1rem;
    text-align: right;
    vertical-align: baseline;
    white-space: nowrap;

    &:first-child {
      border-left: 1px solid #e4e6e8;
      border-top-left-radius: 0.25rem;
    }

    &:last-child {
      border-right: 1px solid #e4e6e8;
      border-top-rights-radius: 0.25rem;
    }

    h1, h2 {
      font-size: 1.75rem;
    }

    &.address {
      padding-left: 3rem;
      text-align: left;
    }

    &.badge {
      padding: 0;
    }

    &.isClickable {
      border-bottom: 2px solid transparent;
      cursor: pointer;
    }

    &.mini {
      padding: 0 !important;
    }

    &.start {
      text-align: left;
    }
  }

  tr {
    background: rgba(255, 255, 255, 0.45);
    text-transform: lowercase;

    &:first-child th {
      border-top: 1px solid #e4e6e8;
    }

    &.filter {
      .ui.input {
        margin-top: 0;
      }

      th {
        padding: 0;
      }
    }
  }
`);

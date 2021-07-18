// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiProps } from '@polkadot/react-api/types';
import type { Header } from '@polkadot/types/interfaces';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { CardSummary, IdentityIcon, SummaryBox } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from './translate';

interface LinkHeader {
  author: string | null;
  bn: string;
  hash: string;
  height: number;
  isEmpty: boolean;
  isFinalized: boolean;
  parent: string;
  width: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface,no-use-before-define
interface LinkArray extends Array<Link> {}

interface Link {
  arr: LinkArray;
  hdr: LinkHeader;
}

interface Props extends ApiProps {
  className?: string;
  finHead?: Header;
  newHead?: Header;
}

type UnsubFn = () => void;

interface Col {
  author: string | null;
  hash: string;
  isEmpty: boolean;
  isFinalized: boolean;
  parent: string;
  width: number;
}

interface Row {
  bn: string;
  cols: Col[];
}

// adjust the number of columns in a cell based on the children and tree depth
function calcWidth (children: LinkArray): number {
  return Math.max(1, children.reduce((total, { hdr: { width } }): number => {
    return total + width;
  }, 0));
}

// counts the height of a specific node
function calcHeight (children: LinkArray): number {
  return children.reduce((max, { arr, hdr }): number => {
    hdr.height = hdr.isEmpty
      ? 0
      : 1 + calcHeight(arr);

    return Math.max(max, hdr.height);
  }, 0);
}

// a single column in a row, it just has the details for the entry
function createCol ({ hdr: { author, hash, isEmpty, isFinalized, parent, width } }: Link): Col {
  return { author, hash, isEmpty, isFinalized, parent, width };
}

// create a simplified structure that allows for easy rendering
function createRows (arr: LinkArray): Row[] {
  if (!arr.length) {
    return [];
  }

  return createRows(
    arr.reduce((children: LinkArray, { arr }: Link): LinkArray =>
      children.concat(...arr), [])
  ).concat({
    bn: arr.reduce((result, { hdr: { bn } }): string =>
      result || bn, ''),
    cols: arr.map(createCol)
  });
}

// fills in a header based on the supplied data
function createHdr (bn: string, hash: string, parent: string, author: string | null, isEmpty = false): LinkHeader {
  return { author, bn, hash, height: 0, isEmpty, isFinalized: false, parent, width: 0 };
}

// empty link helper
function createLink (): Link {
  return {
    arr: [],
    hdr: createHdr('', ' ', ' ', null, true)
  };
}

// even out the columns, i.e. add empty spacers as applicable to get tree rendering right
function addColumnSpacers (arr: LinkArray): void {
  // check is any of the children has a non-empty set
  const hasChildren = arr.some(({ arr }): boolean => arr.length !== 0);

  if (hasChildren) {
    // ok, non-empty found - iterate through an add at least an empty cell to all
    arr
      .filter(({ arr }): boolean => arr.length === 0)
      .forEach(({ arr }): number => arr.push(createLink()));

    const newArr = arr.reduce((flat: LinkArray, { arr }): LinkArray => flat.concat(...arr), []);

    // go one level deeper, ensure that the full tree has empty spacers
    addColumnSpacers(newArr);
  }
}

// checks to see if a row has a single non-empty entry, i.e. it is a candidate for collapsing
function isSingleRow (cols: Col[]): boolean {
  if (!cols[0] || cols[0].isEmpty) {
    return false;
  }

  return cols.reduce((result: boolean, col, index): boolean => {
    return index === 0
      ? result
      : (!col.isEmpty ? false : result);
  }, true);
}

function renderCol ({ author, hash, isEmpty, isFinalized, parent, width }: Col, index: number): React.ReactNode {
  return (
    <td
      className={`header ${isEmpty ? 'isEmpty' : ''} ${isFinalized ? 'isFinalized' : ''}`}
      colSpan={width}
      key={`${hash}:${index}:${width}`}
    >
      {isEmpty
        ? <div className='empty' />
        : (
          <>
            {author && (
              <IdentityIcon
                className='author'
                size={28}
                value={author}
              />
            )}
            <div className='contents'>
              <div className='hash'>{hash}</div>
              <div className='parent'>{parent}</div>
            </div>
          </>
        )
      }
    </td>
  );
}

// render the rows created by createRows to React nodes
function renderRows (rows: Row[]): React.ReactNode[] {
  const lastIndex = rows.length - 1;
  let isPrevShort = false;

  return rows.map(({ bn, cols }, index): React.ReactNode => {
    // if not first, not last and single only, see if we can collapse
    if (index !== 0 && index !== lastIndex && isSingleRow(cols)) {
      if (isPrevShort) {
        // previous one was already a link, this one as well - skip it
        return null;
      } else if (isSingleRow(rows[index - 1].cols)) {
        isPrevShort = true;

        return (
          <tr key={bn}>
            <td key='blockNumber' />
            <td
              className='header isLink'
              colSpan={cols[0].width}
            >
              <div className='link'>&#8942;</div>
            </td>
          </tr>
        );
      }
    }

    isPrevShort = false;

    return (
      <tr key={bn}>
        <td key='blockNumber'>{`#${bn}`}</td>
        {cols.map(renderCol)}
      </tr>
    );
  });
}

function Forks ({ className }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [tree, setTree] = useState<Link | null>(null);
  const childrenRef = useRef<Map<string, string[]>>(new Map([['root', []]]));
  const countRef = useRef({ numBlocks: 0, numForks: 0 });
  const headersRef = useRef<Map<string, LinkHeader>>(new Map());
  const firstNumRef = useRef('');

  const _finalize = useCallback(
    (hash: string): void => {
      const hdr = headersRef.current.get(hash);

      if (hdr && !hdr.isFinalized) {
        hdr.isFinalized = true;

        _finalize(hdr.parent);
      }
    },
    []
  );

  // adds children for a specific header, retrieving based on matching parent
  const _addChildren = useCallback(
    (base: LinkHeader, children: LinkArray): LinkArray => {
      // add the children
      (childrenRef.current.get(base.hash) || [])
        .map((hash): LinkHeader | undefined => headersRef.current.get(hash))
        .filter((hdr): hdr is LinkHeader => !!hdr)
        .forEach((hdr): void => {
          children.push({ arr: _addChildren(hdr, []), hdr });
        });

      // calculate the max height/width for this entry
      base.height = calcHeight(children);
      base.width = calcWidth(children);

      // place the active (larger, finalized) columns first for the pyramid display
      children.sort((a, b): number =>
        (a.hdr.width > b.hdr.width || a.hdr.height > b.hdr.height || a.hdr.isFinalized)
          ? -1
          : (a.hdr.width < b.hdr.width || a.hdr.height < b.hdr.height || b.hdr.isFinalized)
            ? 1
            : 0
      );

      return children;
    },
    []
  );

  // create a tree list from the available headers
  const _generateTree = useCallback(
    (): Link => {
      const root = createLink();

      // add all the root entries first, we iterate from these
      // We add the root entry explicitly, it exists as per init
      (childrenRef.current.get('root') || []).forEach((hash): void => {
        const hdr = headersRef.current.get(hash);

        // if this fails, well, we have a bigger issue :(
        if (hdr) {
          root.arr.push({ arr: [], hdr: { ...hdr } });
        }
      });

      // iterate through, adding the children for each of the root nodes
      root.arr.forEach(({ arr, hdr }): void => {
        _addChildren(hdr, arr);
      });

      // align the columns with empty spacers - this aids in display
      addColumnSpacers(root.arr);

      root.hdr.height = calcHeight(root.arr);
      root.hdr.width = calcWidth(root.arr);

      return root;
    },
    [_addChildren]
  );

  // callback when finalized
  const _newFinalized = useCallback(
    (header: Header): void => {
      _finalize(header.hash.toHex());
    },
    [_finalize]
  );

  // callback for the subscribe headers sub
  const _newHeader = useCallback(
    (header: Header): void => {
      // formatted block info
      const bn = formatNumber(header.number);
      const hash = header.hash.toHex();
      const parent = header.parentHash.toHex();
      let isFork = false;

      // if this the first one?
      if (!firstNumRef.current) {
        firstNumRef.current = bn;
      }

      if (!headersRef.current.has(hash)) {
        // if this is the first, add to the root entry
        if (firstNumRef.current === bn) {
          (childrenRef.current.get('root') as any[]).push(hash);
        }

        // add to the header map
        // also for HeaderExtended header.author ? header.author.toString() : null
        headersRef.current.set(hash, createHdr(bn, hash, parent, null));

        // check to see if the children already has a entry
        if (childrenRef.current.has(parent)) {
          isFork = true;
          (childrenRef.current.get(parent) as any[]).push(hash);
        } else {
          childrenRef.current.set(parent, [hash]);
        }

        // if we don't have the parent of this one, retrieve it
        if (!headersRef.current.has(parent)) {
          // just make sure we are not first in the list, we don't want to full chain
          if (firstNumRef.current !== bn) {
            console.warn(`Retrieving missing header ${header.parentHash.toHex()}`);

            api.rpc.chain.getHeader(header.parentHash).then(_newHeader).catch(console.error);

            // catch the refresh on the result
            return;
          }
        }

        // update our counters
        countRef.current.numBlocks++;

        if (isFork) {
          countRef.current.numForks++;
        }

        // do the magic, extract the info into something useful and add to state
        setTree(_generateTree());
      }
    },
    [api, _generateTree]
  );

  useEffect((): () => void => {
    let _subFinHead: UnsubFn | null = null;
    let _subNewHead: UnsubFn | null = null;

    (async (): Promise<void> => {
      [_subFinHead, _subNewHead] = await Promise.all([
        api.rpc.chain.subscribeFinalizedHeads(_newFinalized),
        api.rpc.chain.subscribeNewHeads(_newHeader)
      ]);
    })().catch(console.error);

    return (): void => {
      _subFinHead && _subFinHead();
      _subNewHead && _subNewHead();
    };
  }, [api, _newFinalized, _newHeader]);

  if (!tree) {
    return null;
  }

  return (
    <div className={className}>
      <SummaryBox>
        <section>
          <CardSummary label={t<string>('blocks')}>{formatNumber(countRef.current.numBlocks)}</CardSummary>
          <CardSummary label={t<string>('forks')}>{formatNumber(countRef.current.numForks)}</CardSummary>
        </section>
      </SummaryBox>
      <table>
        <tbody>
          {renderRows(createRows(tree.arr))}
        </tbody>
      </table>
    </div>
  );
}

export default React.memo(styled(Forks)`
  margin-bottom: 1.5rem;

  table {
    border-collapse: separate;
    border-spacing: 0.25rem;
    font: var(--font-mono);

    td {
      padding: 0.25rem 0.5rem;
      text-align: center;

      .author,
      .contents {
        display: inline-block;
        vertical-align: middle;
      }

      .author {
        margin-right: 0.25rem;
      }

      .contents {
        .hash, .parent {
          margin: 0 auto;
          max-width: 6rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .parent {
          font-size: 0.75rem;
          line-height: 0.75rem;
          max-width: 4.5rem;
        }
      }

      &.blockNumber {
        font-size: 1.25rem;
      }

      &.header {
        background: #fff;
        border: 1px solid #e6e6e6;
        border-radius: 0.25rem;

        &.isEmpty {
          background: transparent;
          border-color: transparent;
        }

        &.isFinalized {
          background: rgba(0, 255, 0, 0.1);
        }

        &.isLink {
          background: transparent;
          border-color: transparent;
          line-height: 1rem;
          padding: 0;
        }

        &.isMissing {
          background: rgba(255, 0, 0, 0.05);
        }
      }
    }
  }
`);

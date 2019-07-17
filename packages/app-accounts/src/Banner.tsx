// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import { detect } from 'detect-browser';
import React from 'react';
import styled from 'styled-components';
import { isWeb3Injected } from '@polkadot/extension-dapp';
import { stringUpperFirst } from '@polkadot/util';

import translate from './translate';

// it would have been really good to import this from detect, however... not exported
type Browser = 'chrome' | 'firefox';

interface Extension {
  link: string;
  name: string;
}

interface Props extends I18nProps {
  className?: string;
}

const EXTENSIONS = [
  {
    browsers: {
      chrome: 'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd',
      firefox: 'https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/'
    },
    name: 'polkadot-js extension'
  }
];

const available: Record<Browser, Extension[]> = {
  chrome: [],
  firefox: []
};

EXTENSIONS.forEach(({ browsers, name }): void => {
  Object.entries(browsers).forEach(([browser, link]): void => {
    available[browser as Browser].push({ link, name });
  });
});

const browserInfo = detect();
const browserName: Browser | null = (browserInfo && (browserInfo.name as Browser)) || null;
const isSupported = browserName && ['chrome', 'firefox'].includes(browserName);

class Banner extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { className, t } = this.props;

    if (isWeb3Injected || !isSupported || !browserName) {
      return null;
    }

    return (
      <div className={className}>
        <p>{t('It is recommended that you store and create the accounts that you care about, externally from the app. On {{yourBrowser}} the following signer extensions are available for use -', { replace: {
          yourBrowser: stringUpperFirst(browserName)
        } })}</p>
        <ul>{available[browserName].map(({ name, link }): React.ReactNode => (
          <li key={name}>
            <a
              href={link}
              rel='noopener noreferrer'
              target='_blank'
            >
              {name}
            </a>
          </li>
        ))
        }</ul>
        <p>{t('The list is evolving and is updated as more extensions and external signers become available and it supported by the extension-dapp bridge. ')}<a
          href='https://github.com/polkadot-js/extension'
          rel='noopener noreferrer'
          target='_blank'
        >{t('Learn more...')}</a></p>
      </div>
    );
  }
}

export default translate(styled(Banner)`
  border: 1px solid darkorange;
  border-radius: 0.25rem;
  background: #fff6e5;
  padding: 1rem 1.5rem;
`);

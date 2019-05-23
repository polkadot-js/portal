// Copyright 2017-2019 @polkadot/ui-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiInjected, ApiInjectedProps, Subtract, WindowInjected } from './types';

import React from 'react';

const objmap = (window as WindowInjected).injectedWeb3;
const injectedPromise = !objmap || Object.keys(objmap).length === 0
  ? Promise.resolve([] as Array<ApiInjected>)
  : Promise.all(Object.values(objmap).map(({ name, version, enable }) =>
      Promise.all([
        Promise.resolve({ name, version }),
        enable('polkadot-js/apps').catch(() => null)
      ])))
      .then((values) => values.filter(([, result]) => result !== null))
      .then((values) => values.map(([info, result]) => ({ ...info, ...result })))
      .catch(() => [] as Array<ApiInjected>);

const InjectedContext = React.createContext(injectedPromise);
const InjectedConsumer = InjectedContext.Consumer;

export {
  InjectedConsumer
};

export function withInjected<P extends ApiInjectedProps> (Component: React.ComponentType<P>): React.ComponentType<Subtract<P, ApiInjectedProps>> {
  return (props: Subtract<P, ApiInjectedProps>) => {
    return (
      <InjectedContext.Consumer>
        {(injected) => (
          // @ts-ignore Something here with the props are going wonky
          <Component
            {...props}
            injectedPromise={injectedPromise}
          />
        )}
      </InjectedContext.Consumer>
    );
  };
}

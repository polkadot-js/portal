// Copyright 2017-2019 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StorageFunction } from '@polkadot/types/primitive/StorageKey';
import { I18nProps } from '@polkadot/ui-app/types';
import { QueryTypes, StorageModuleQuery } from './types';

import React from 'react';
import { Compact } from '@polkadot/types';
import { Button, Labelled } from '@polkadot/ui-app/index';
import valueToText from '@polkadot/ui-params/valueToText';
import { withCallDiv } from '@polkadot/ui-api/index';
import { isU8a, u8aToHex, u8aToString } from '@polkadot/util';

import translate from './translate';
import { RenderFn, DefaultProps, ComponentRenderer } from '@polkadot/ui-api/with/types';
import { thistle } from 'color-name';

type Props = I18nProps & {
  onRemove: (id: number) => void,
  value: QueryTypes
};

type ComponentProps = {};

type State = {
  inputs: Array<React.ReactNode>,
  Component: React.ComponentType<ComponentProps>,
  spread: { [index: number]: boolean }
};

type CacheInstance = {
  Component: React.ComponentType<any>,
  render: RenderFn,
  refresh: (swallowErrors: boolean, contentShorten: boolean) => React.ComponentType<any>
};

const cache: Array<CacheInstance> = [];

class Query extends React.PureComponent<Props, State> {
  state: State = { spread: {} } as State;

  static getCachedComponent (query: QueryTypes): CacheInstance {
    const { id, key, params = [] } = query as StorageModuleQuery;

    if (!cache[id]) {
      const values: Array<any> = params.map(({ value }) => value);
      const type = key.meta
        ? key.meta.type.toString()
        : 'Data';
      const defaultProps = { className: 'ui--output' };

      // render function to create an element for the query results which is plugged to the api
      const renderHelper = withCallDiv('subscribe', { params: [key, ...values] });
      const Component = renderHelper(
        // By default we render a simple div node component with the query results in it
        (value: any) => valueToText(type, value, true, true),
        defaultProps
      );
      cache[query.id] = Query.createComponent(type, Component, defaultProps, renderHelper);
    }

    return cache[id];
  }

  static createComponent (type: string, Component: React.ComponentType<any>, defaultProps: DefaultProps, renderHelper: ComponentRenderer) {
    return {
      Component,
      // In order to replace the default component during runtime we can provide a RenderFn to create a new 'plugged' component
      render: (createComponent: RenderFn) => {
        return renderHelper(createComponent, defaultProps);
      },
      // In order to modify the parameters which are used to render the default component, we can use this method
      refresh: (swallowErrors: boolean, contentShorten: boolean) => {
        return renderHelper(
          (value: any) => valueToText(type, value, swallowErrors, contentShorten),
          defaultProps
        );
      }
    };
  }

  static getDerivedStateFromProps ({ value }: Props, prevState: State): State | null {
    const Component = Query.getCachedComponent(value).Component;
    const inputs: Array<React.ReactNode> = isU8a(value.key)
      ? []
      // FIXME We need to render the actual key params
      // const { key, params } = value;
      // const inputs = key.params.map(({ name, type }, index) => (
      //   <span key={`param_${name}_${index}`}>
      //     {name}={valueToText(type, params[index].value)}
      //   </span>
      // ));
      : [];

    return {
      Component,
      inputs
    } as State;
  }

  render () {
    const { value } = this.props;
    const { Component, inputs } = this.state;
    const { key } = value;
    const type = isU8a(key)
      ? 'Data'
      : (
        key.meta.modifier.isOptional
          ? `Option<${key.meta.type}>`
          : key.meta.type.toString()
      );

    return (
      <div className='storage--Query storage--actionrow'>
        <div className='storage--actionrow-value'>
          {this.keyToName(key)}({this.renderInputs()}): {type}
          <Component />
        </div>
        <div className='storage--actionrow-buttons'>
          <div className='container'>
            {this.renderButtons()}
          </div>
        </div>
      </div>
    );
  }

  private typeIsTuple (type: string): boolean {
    return type.charAt(0) === '(' && type.charAt(type.length - 1) === ')';
  }

  private breakDownTuple (type: string): Array<any> {
    return type.substring(1, type.length - 1).split(',');
  }

  private renderInputs () {
    const value = this.props.value;
    const { key } = value;

    // if function has inputs, render them
    if ((value as StorageModuleQuery).params.length > 0) {
      const type = isU8a(key) ? 'Data' : key.meta.type.asMap.key.toString();
      const params = (value as StorageModuleQuery).params;
      return (
        <span>
          {type}:&nbsp;
          {
            params.map((obj) => {
              // check if the type name references a tuple, e.g. "(Hash, AccountId)"
              if (this.typeIsTuple(type)) {
                let types = this.breakDownTuple(type);
                // if so run this function on each element of the tuple
                let output = [];
                for (let i = 0; i < types.length; i++) {
                  output[i] =
                  <span>
                    {
                      valueToText(types[i], (obj.value as Array<any>)[i])
                    }
                    {
                      (i === types.length - 1 ? '' : ', ')
                      /* comma separated list */
                    }
                  </span>;
                }

                return output;
              }

              return valueToText(type, obj.value);
            })
          }
        </span>
      );
    } else {
      return <span></span>;
    }
  }

  private renderButtons () {
    const { id, key } = this.props.value as StorageModuleQuery;

    const buttons = [
      <Button
        icon='close'
        isNegative
        key='close'
        onClick={this.onRemove}
      />
    ];

    if (key.meta && ['Bytes', 'Data'].includes(key.meta.type.toString())) {
      // TODO We are currently not performing a copy
      // buttons.unshift(
      //   <Button
      //     icon='copy'
      //     onClick={this.copyHandler(id)}
      //   />
      // );
      buttons.unshift(
        <Button
          icon='ellipsis horizontal'
          key='spread'
          onClick={this.spreadHandler(id)}
        />
      );
    }

    return buttons;
  }

  private keyToName (key: Uint8Array | StorageFunction): string {
    if (isU8a(key)) {
      const u8a = Compact.stripLengthPrefix(key);

      // If the string starts with `:`, handle it as a pure string
      return u8a[0] === 0x3a
        ? u8aToString(u8a)
        : u8aToHex(u8a);
    }

    return `${key.section}.${key.method}`;
  }

  private spreadHandler (id: number) {
    return () => {
      const { spread } = this.state;

      cache[id].Component = cache[id].refresh(true, !!spread[id]);
      spread[id] = !spread[id];

      this.setState({
        ...this.state,
        ...spread,
        Component: cache[id].Component
      });
    };
  }

  private onRemove = (): void => {
    const { onRemove, value: { id } } = this.props;

    delete cache[id];

    onRemove(id);
  }
}

export default translate(Query);

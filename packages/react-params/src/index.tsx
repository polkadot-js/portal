// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { ComponentMap, ParamDef, RawParam, RawParams, RawParamOnChange, RawParamOnChangeValue } from './types';

import './Params.css';

import React from 'react';
import { classes } from '@polkadot/react-components/util';
import translate from '@polkadot/react-components/translate';

import Param from './Param';
import { createValue } from './values';

interface Props extends I18nProps {
  isDisabled?: boolean;
  onChange?: (value: RawParams) => void;
  onEnter?: () => void;
  overrides?: ComponentMap;
  params: ParamDef[];
  values?: RawParams | null;
}

interface State {
  handlers?: RawParamOnChange[];
  onChangeParam: (at: number, next: RawParamOnChangeValue) => void;
  params?: ParamDef[];
  values?: RawParams;
}

class Params extends React.PureComponent<Props, State> {
  public state: State;

  public constructor (props: Props) {
    super(props);

    this.state = {
      onChangeParam: this.onChangeParam
    };
  }

  public static getDerivedStateFromProps (props: Props, { params, onChangeParam }: State): State | null {
    const isSame = JSON.stringify(params) === JSON.stringify(props.params);

    if (props.isDisabled || isSame) {
      return null;
    }

    const values = props.params.reduce(
      (result: RawParams, param, index): RawParams => [
        ...result,
        props.values && props.values[index]
          ? props.values[index]
          : createValue(param)
      ],
      []
    );

    const handlers = values.map(
      (_, index): RawParamOnChange =>
        (value: RawParamOnChangeValue): void =>
          onChangeParam(index, value)
    );

    return {
      handlers,
      onChangeParam,
      params: props.params,
      values
    };
  }

  // Fire the intial onChange (we did update) when the component is loaded
  public componentDidMount (): void {
    this.componentDidUpdate({} as unknown as Props, {} as unknown as State);
  }

  // This is needed in the case where the item changes, i.e. the values get
  // initialised and we need to alert the parent that we have new values
  public componentDidUpdate (_: Props, prevState: State): void {
    const { onChange, isDisabled } = this.props;
    const { values } = this.state;

    if (!isDisabled && prevState.values !== values) {
      onChange && onChange(values || []);
    }
  }

  public render (): React.ReactNode {
    const { className, isDisabled, onEnter, overrides, params, style } = this.props;
    const { handlers = [], values = this.props.values } = this.state;

    if (!params || params.length === 0 || !values || values.length === 0) {
      return null;
    }

    return (
      <div
        className={classes('ui--Params', className)}
        style={style}
      >
        <div className='ui--Params-Content'>
          {params.map(({ isOptional = false, name, type }, index): React.ReactNode => (
            <Param
              defaultValue={values[index]}
              isDisabled={isDisabled}
              isOptional={isOptional}
              key={`${name}:${name}:${index}`}
              name={name}
              onChange={handlers[index]}
              onEnter={onEnter}
              overrides={overrides}
              type={type}
            />
          ))}
        </div>
      </div>
    );
  }

  private onChangeParam = (at: number, newValue: RawParamOnChangeValue): void => {
    const { isDisabled } = this.props;

    if (isDisabled) {
      return;
    }

    const { isValid = false, value } = newValue;

    this.setState(
      (prevState: State): Pick<State, never> => ({
        values: (prevState.values || []).map((prev, index): RawParam =>
          index !== at
            ? prev
            : {
              isValid,
              value
            }
        )
      }),
      this.triggerUpdate
    );
  }

  private triggerUpdate = (): void => {
    const { values } = this.state;
    const { onChange, isDisabled } = this.props;

    if (isDisabled || !values) {
      return;
    }

    onChange && onChange(values);
  }
}

export default translate(Params);

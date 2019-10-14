// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TypeDef } from '@polkadot/types/types';
import { Props, RawParam } from '../types';

import React, { useEffect, useState } from 'react';
import { createType, getTypeDef } from '@polkadot/types';

import Params from '../';
import Base from './Base';
import Static from './Static';

export default function StructParam (props: Props): React.ReactElement<Props> {
  const [defs, setDefs] = useState<TypeDef[]>([]);
  const { className, isDisabled, label, onChange, style, type, withLabel } = props;

  useEffect((): void => {
    const rawType = createType(type as any).toRawType();
    const typeDef = getTypeDef(rawType);

    // HACK This is a quick hack to allow `Option<struct>` ... this is certainly not the right
    // place for this, so we need to move it (even the detection just sucks)... also see enum
    setDefs(
      typeDef.type.startsWith('Option<')
        ? (typeDef.sub as TypeDef).sub as TypeDef[]
        : typeDef.sub as TypeDef[]
    );
  }, [type]);

  if (isDisabled) {
    return <Static {...props} />;
  }

  const _onChangeParams = (values: RawParam[]): void => {
    onChange && onChange({
      isValid: values.reduce((result, { isValid }): boolean => result && isValid, true as boolean),
      value: defs.reduce((value, { name }, index): Record<string, any> => {
        value[name as string] = values[index].value;

        return value;
      }, {} as unknown as Record<string, any>)
    });
  };

  const params = defs.map((type): { name?: string; type: TypeDef } => ({ name: type.name, type }));

  return (
    <div className='ui--Params-Struct'>
      <Base
        className={className}
        label={label}
        style={style}
        withLabel={withLabel}
      />
      <Params
        onChange={_onChangeParams}
        params={params}
      />
    </div>
  );
}

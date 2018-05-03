// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Props as BaseProps } from '../types';

type Props = BaseProps & {
  t: I18Next$Translate
};

const React = require('react');

const translate = require('../../translate');
const Base = require('./Base');
const typeToText = require('../typeToText');

function Unknown ({ label, subject, t, value: { type } }: Props): React$Node {
  subject.next({
    isValid: false,
    value: new Uint8Array([])
  });

  return (
    <Base
      size='full'
      label={label}
    >
      <div className='ui--Param-Unknown ui dropdown error selection'>
        {t('param.unknown', {
          defaultValue: `ERROR: Unimplemented type '{{type}}' requested. No renderer exists`,
          replace: {
            type: typeToText(type)
          }
        })}
      </div>
    </Base>
  );
}

module.exports = translate(Unknown);

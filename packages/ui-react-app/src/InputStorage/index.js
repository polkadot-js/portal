// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { StorageDef$Key, StateDb$SectionNames } from '@polkadot/storage/types';
import type { I18nProps } from '../types';

type Props = I18nProps & {
  isError?: boolean,
  labelMethod?: string,
  labelSection?: string,
  onChange?: (event: SyntheticEvent<*>, value: StorageDef$Key) => void,
  subject?: rxjs$Subject<StorageDef$Key>
};

require('./InputStorage.css');

const React = require('react');
const { Subject } = require('rxjs/Subject');

const SelectKey = require('./SelectKey');
const SelectSection = require('./SelectSection');
const withObservable = require('@polkadot/rx-react/with/observable');

const translate = require('../translate');

class InputStorage extends React.PureComponent<Props> {
  sectionSubject: rxjs$Subject<StateDb$SectionNames>;
  SelectKey: React$ComponentType<*>;

  constructor (props: Props) {
    super(props);

    this.sectionSubject = new Subject();
    this.SelectKey = withObservable(this.sectionSubject)(SelectKey);
  }

  render (): React$Node {
    const { className, labelMethod, labelSection, onChange, style, subject, t } = this.props;

    return (
      <div
        className={['ui--InputStorage', 'ui--form', className].join(' ')}
        style={style}
      >
        <div className='small'>
          <SelectSection
            label={labelSection || t('input.storage.section', {
              defaultValue: 'storage area'
            })}
            subject={this.sectionSubject}
          />
        </div>
        <div className='large'>
          <this.SelectKey
            label={labelMethod || t('input.storage.key', {
              defaultValue: 'with storage key'
            })}
            onChange={onChange}
            subject={subject}
          />
        </div>
      </div>
    );
  }
}

module.exports = translate(InputStorage);

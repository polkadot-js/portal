// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { StorageQuery } from './types';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

type ValueSubject = rxjs$BehaviorSubject<*>;
type ValueSubjects = Array<ValueSubject>;

type Subjects = {
  params: rxjs$BehaviorSubject<ValueSubjects>,
  queries: rxjs$BehaviorSubject<Array<StorageQuery>>
};

function createSubjects (): Subjects {
  return {
    params: new BehaviorSubject([]),
    queries: new BehaviorSubject([])
  };
}

export default createSubjects();

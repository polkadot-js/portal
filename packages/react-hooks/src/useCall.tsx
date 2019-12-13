// Copyright 2017-2019 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Codec } from '@polkadot/types/types';
import { CallOptions, CallParam, CallParams } from './types';

import { useEffect, useRef, useState } from 'react';
import { isNull, isUndefined } from '@polkadot/util';

import { extractParams, transformIdentity } from './util';

interface TrackFnCallback {
  (value: Codec): void;
}

type TrackFnResult = Promise<() => void>;

interface TrackFn {
  (a: CallParam, b: CallParam, c: CallParam, cb: TrackFnCallback): TrackFnResult;
  (a: CallParam, b: CallParam, cb: TrackFnCallback): TrackFnResult;
  (a: CallParam, cb: TrackFnCallback): TrackFnResult;
  (cb: TrackFnCallback): TrackFnResult;
  meta?: {
    type: {
      isDoubleMap: boolean;
    };
  };
}

interface Tracker {
  isActive: boolean;
  count: number;
  paramCount: number;
  serialized: string | null;
  subscriber: TrackFnResult | null;
}

interface TrackerRef {
  current: Tracker;
}

// unsubscribe and remove from  the tracker
function unsubscribe (tracker: TrackerRef): void {
  if (tracker.current.subscriber) {
    tracker.current.isActive = false;
    tracker.current.subscriber.then((unsubFn): void => unsubFn());
    tracker.current.subscriber = null;
  }
}

// subscribe, tyring to play nice with the browser threads
function subscribe <T> (tracker: TrackerRef, fn: TrackFn | undefined, params: CallParams, setValue: (value: T) => void, { isSingle, transform = transformIdentity }: CallOptions<T>): void {
  const validParams = params.filter((p): boolean => !isUndefined(p));

  unsubscribe(tracker);

  setTimeout((): void => {
    tracker.current.isActive = true;
    tracker.current.count = 0;
    tracker.current.subscriber = fn && (!fn.meta || !fn.meta.type?.isDoubleMap || validParams.length === 2)
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore We tried to get the typings right, close but no cigar...
      ? fn(...params, (value: any): void => {
        // when we don't have an active sub, or single-shot, ignore (we use the isActive flag here
        // since .subscriber may not be set on immeditae callback)
        if (tracker.current.isActive && (!isSingle || !tracker.current.count)) {
          tracker.current.count++;
          setValue(transform(value));
        }
      })
      : null;
  }, 0);
}

// tracks a stream, typically an api.* call (derive, rpc, query) that
//  - returns a promise with an unsubscribe function
//  - has a callback to set the value
// FIXME The typings here need some serious TLC
export default function useCall <T> (fn: TrackFn | undefined, params: CallParams, options: CallOptions<T> = {}): T | undefined {
  const [value, setValue] = useState<T | undefined>(options.defaultValue);
  const tracker = useRef<Tracker>({ isActive: false, count: 0, paramCount: -1, serialized: null, subscriber: null });

  // initial effect, we need an unsubscription
  useEffect((): () => void => {
    return (): void => {
      unsubscribe(tracker);
    };
  }, []);

  // on changes, re-subscribe
  useEffect((): void => {
    // check if we have a function
    if (fn) {
      const nonEmptyParams = params.filter((param): boolean => !(isNull(param) || !isUndefined(param)));

      // in the case on unmounting, the params may go empty, cater for this, don't trigger
      if (nonEmptyParams.length >= tracker.current.paramCount) {
        const [serialized, mappedParams] = extractParams(fn, params, options.paramMap || transformIdentity);

        if (mappedParams && serialized !== tracker.current.serialized) {
          tracker.current.paramCount = nonEmptyParams.length;
          tracker.current.serialized = serialized;

          subscribe(tracker, fn, mappedParams, setValue, options);
        }
      }
    }
  }, [fn, params]);

  return value;
}

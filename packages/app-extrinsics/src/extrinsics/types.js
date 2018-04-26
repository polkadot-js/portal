// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

export type Extrinsic$Type = 'AccountId' | 'Balance' | 'BlockNumber' | 'u32';

export type Extrinsic$Params = Array<Extrinsic$Type>;

export type ExtrinsicBasic = {
  description: string,
  index: number,
  isPrivate?: boolean,
  params: Extrinsic$Params
}

export type ExtrinsicsBasic = {
  description: string,
  methods: {
    private: {
      [string]: ExtrinsicBasic
    },
    public: {
      [string]: ExtrinsicBasic
    }
  }
}

export type Extrinsic = {
  description: string,
  index: Uint8Array,
  isPrivate: boolean,
  name: string,
  params: Extrinsic$Params
};

export type ExtrinsicSection = {
  description: string,
  hasPrivate: boolean,
  hasPublic: boolean,
  index: Uint8Array,
  methods: Array<Extrinsic>,
  name: string
};

export type Extrinsics = {
  sections: Array<ExtrinsicSection>,
  get: (sectionMethod: string) => Extrinsic
}

export type ExtrinsicsMap = {
  [string]: Extrinsic
};

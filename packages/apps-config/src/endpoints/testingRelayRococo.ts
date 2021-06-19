// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { EndpointOption } from './types';

import { EndpointType } from '../../../../../ui/packages/ui-settings/src/types';
import { ROCOCO_GENESIS } from '../api/constants';

/* eslint-disable sort-keys */

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   value: The actual hosted secure websocket endpoint

// Based on history, this will expand so keep it as a singular chunk
export function createRococo (t: TFunction): EndpointOption {
  return {
    dnslink: 'rococo',
    genesisHash: ROCOCO_GENESIS,
    info: 'rococo',
    text: t('rpc.rococo', 'Rococo', { ns: 'apps-config' }),
    providers: {
      Parity: { type: 'json-rpc' as EndpointType, param: 'wss://rococo-rpc.polkadot.io' },
      OnFinality: { type: 'json-rpc' as EndpointType, param: 'wss://rococo.api.onfinality.io/public-ws' },
      'Patract Elara': { type: 'json-rpc' as EndpointType, param: 'wss://rococo.elara.patract.io' },
      'Ares Protocol': { type: 'json-rpc' as EndpointType, param: 'wss://rococo.aresprotocol.com' },
      Pinknode:  { type: 'json-rpc' as EndpointType, param: 'wss://rpc.pinknode.io/rococo/explorer' }
    },
    linked: [
      // these are the base chains
      {
        info: 'rococoTick',
        paraId: 100,
        text: t('rpc.rococo.tick', 'Tick', { ns: 'apps-config' }),
        providers: {
          Parity: { type: 'json-rpc' as EndpointType, param: 'wss://tick-rpc.polkadot.io' }
        }
      },
      {
        info: 'rococoTrick',
        paraId: 110,
        text: t('rpc.rococo.trick', 'Trick', { ns: 'apps-config' }),
        providers: {
          Parity: { type: 'json-rpc' as EndpointType, param: 'wss://trick-rpc.polkadot.io' }
        }
      },
      {
        info: 'rococoTrack',
        paraId: 120,
        text: t('rpc.rococo.track', 'Track', { ns: 'apps-config' }),
        providers: {
          Parity: { type: 'json-rpc' as EndpointType, param: 'wss://track-rpc.polkadot.io' }
        }
      },
      {
        info: 'rococoStatemint',
        paraId: 1000,
        text: t('rpc.rococo.statemint', 'Statemint', { ns: 'apps-config' }),
        providers: {
          Parity: { type: 'json-rpc' as EndpointType, param: 'wss://statemint-rococo-rpc.parity.io' }
        }
      },
      // add any additional parachains here, alphabetical
      {
        info: 'rococoApron',
        isDisabled: true, // Rococo reset
        paraId: 2048,
        text: t('rpc.rococo.apron', 'Apron PC1', { ns: 'apps-config' }),
        providers: {
          'Apron Network': { type: 'json-rpc' as EndpointType, param: 'wss://rococo.apron.network' }
        }
      },
      {
        info: 'rococoAres',
        isDisabled: true, // Rococo reset
        paraId: 1006,
        text: t('rpc.rococo.ares', 'Ares PC1', { ns: 'apps-config' }),
        providers: {
          'Ares Protocol': { type: 'json-rpc' as EndpointType, param: 'wss://rococo.parachain.aresprotocol.com' }
        }
      },
      {
        info: 'rococoBifrost',
        isDisabled: true, // Rococo reset
        paraId: 1024,
        text: t('rpc.rococo.bifrost', 'Bifrost PC1', { ns: 'apps-config' }),
        providers: {
          Bifrost: { type: 'json-rpc' as EndpointType, param: 'wss://rococo-1.testnet.liebi.com' }
        }
      },
      {
        info: 'rococoBitCountry',
        isDisabled: true, // Rococo reset
        paraId: 1008,
        text: t('rpc.rococo.bitcountry', 'Bit.Country PC1', { ns: 'apps-config' }),
        providers: {
          BitCountry: { type: 'json-rpc' as EndpointType, param: 'wss://tewai-parachain.bit.country:9955' }
        }
      },
      {
        info: 'rococoClover',
        isDisabled: true, // Rococo reset
        paraId: 229,
        text: t('rpc.rococo.clover', 'Clover PC1', { ns: 'apps-config' }),
        providers: {
          Clover: { type: 'json-rpc' as EndpointType, param: 'wss://api-rococo.clover.finance' }
        }
      },
      {
        info: 'rococoCrab',
        isDisabled: true, // Rococo reset
        paraId: 9,
        text: t('rpc.rococo.crab', 'Darwinia Crab PC2', { ns: 'apps-config' }),
        providers: {
          Darwinia: { type: 'json-rpc' as EndpointType, param: 'wss://crab-pc2-rpc.darwinia.network' }
        }
      },
      {
        info: 'rococoCrust',
        isDisabled: true, // Rococo reset
        paraId: 2001,
        text: t('rpc.rococo.crust', 'Crust PC1', { ns: 'apps-config' }),
        providers: {
          Crust: { type: 'json-rpc' as EndpointType, param: 'wss://api-rococo.crust.network' }
        }
      },
      {
        info: 'rococoChainX',
        isDisabled: true, // Rococo reset
        paraId: 1059,
        text: t('rpc.rococo.chainx', 'ChainX PC1', { ns: 'apps-config' }),
        providers: {
          ChainX: { type: 'json-rpc' as EndpointType, param: 'wss://sherpax.chainx.org' }
        }
      },
      {
        info: 'rococoDarwinia',
        isDisabled: true, // Rococo reset
        paraId: 18,
        text: t('rpc.rococo.darwinia', 'Darwinia PC2', { ns: 'apps-config' }),
        providers: {
          Darwinia: { type: 'json-rpc' as EndpointType, param: 'wss://pc2-rpc.darwinia.network' }
        }
      },
      {
        info: 'rococoDataHighway',
        isDisabled: true, // Rococo reset
        paraId: 2,
        text: t('rpc.rococo.datahighway', 'DataHighway', { ns: 'apps-config' }),
        providers: {
          DataHighway: { type: 'json-rpc' as EndpointType, param: 'wss://spreehafen.datahighway.com' }
        }
      },
      {
        info: 'rococoEave',
        isDisabled: true, // Rococo reset
        paraId: 2003,
        text: t('rpc.rococo.eave', 'Steam PC', { ns: 'apps-config' }),
        providers: {
          EAVE: { type: 'json-rpc' as EndpointType, param: 'wss://steamcollator.eave.network' }
        }
      },
      {
        info: 'rococoEncointer',
        isDisabled: true, // Rococo reset
        paraId: 1862,
        text: t('rpc.rococo.encointer', 'Encointer PC1', { ns: 'apps-config' }),
        providers: {
          Encointer: { type: 'json-rpc' as EndpointType, param: 'wss://rococo.encointer.org' }
        }
      },
      {
        info: 'rococoGalital',
        isDisabled: true, // Rococo reset
        paraId: 1230,
        text: t('rpc.rococo.galital', 'Galital PC1', { ns: 'apps-config' }),
        providers: {
          StarkleyTech: { type: 'json-rpc' as EndpointType, param: 'wss://galital-rpc.starkleytech.com' }
        }
      },
      {
        info: 'rococoGenshiro',
        paraId: 2021,
        text: t('rpc.rococo.genshiro', 'Genshiro', { ns: 'apps-config' }),
        providers: {
          Equilibrium: 'wss://gens-rococo.equilibrium.io'
        }
      },
      {
        info: 'rococoHalongbay',
        paraId: 2018,
        text: t('rpc.rococo.halongbay', 'Halongbay', { ns: 'app-config' }),
        providers: {
          Halongbay: 'wss://halongbay.polkafoundry.com'
        }
      },
      {
        info: 'rococoHydrate',
        isDisabled: true, // Rococo reset
        paraId: 82406,
        text: t('rpc.rococo.hydrate', 'Hydrate', { ns: 'apps-config' }),
        providers: {
          HydraDX: { type: 'json-rpc' as EndpointType, param: 'wss://hydrate-rpc.hydradx.io:9944' }
        }
      },
      {
        info: 'rococoIdavoll',
        isDisabled: true, // Rococo reset
        paraId: 7766,
        text: t('rpc.rococo.idavoll', 'Idavoll', { ns: 'apps-config' }),
        providers: {
          Idavoll: { type: 'json-rpc' as EndpointType, param: 'wss://rococo.idavoll.network' }
        }
      },
      {
        info: 'rococoIntegritee',
        isDisabled: true, // Rococo reset
        paraId: 1983,
        text: t('rpc.rococo.integritee', 'IntegriTEE PC1', { ns: 'apps-config' }),
        providers: {
          SCS: { type: 'json-rpc' as EndpointType, param: 'wss://rococo.integritee.network' }
        }
      },
      {
        info: 'rococoKilt',
        isDisabled: true, // Rococo reset
        paraId: 12623,
        text: t('rpc.rococo.kilt', 'KILT PC1', { ns: 'apps-config' }),
        providers: {
          'KILT Protocol': { type: 'json-rpc' as EndpointType, param: 'wss://para.rococo-v1.kilt.io' }
        }
      },
      {
        info: 'rococoKonomi',
        isDisabled: true, // Rococo reset
        paraId: 18403,
        text: t('rpc.rococo.konomi', 'Komomi Network', { ns: 'apps-config' }),
        providers: {
          'Konomi Network': { type: 'json-rpc' as EndpointType, param: 'wss://rococo.konomi.tech' }
        }
      },
      {
        info: 'rococoKylin',
        paraId: 2013,
        text: t('rpc.kylin-node.co.uk', 'Kylin Network', { ns: 'apps-config' }),
        providers: {
          'Kylin Network': 'wss://rpc.kylin-node.co.uk'
        }
      },
      {
        info: 'rococoLitentry',
        isDisabled: true, // Rococo reset
        paraId: 1984,
        text: t('rpc.rocco.litentry', 'Litentry Rostock', { ns: 'apps-config' }),
        providers: {
          Litentry: { type: 'json-rpc' as EndpointType, param: 'wss://rococov1.litentry.io' }
        }
      },
      {
        info: 'rococoAcala',
        isDisabled: true, // Rococo reset
        paraId: 1000,
        text: t('rpc.rococo.acala', 'Mandala PC2', { ns: 'apps-config' }),
        providers: {
          Acala: { type: 'json-rpc' as EndpointType, param: 'wss://rococo-1.acala.laminar.one' }
        }
      },
      {
        info: 'rococoMathChain',
        isDisabled: true, // Rococo reset
        paraId: 40,
        text: t('rpc.rococo.mathchain', 'MathChain PC1', { ns: 'apps-config' }),
        providers: {
          MathWallet: { type: 'json-rpc' as EndpointType, param: 'wss://testpara.maiziqianbao.net/ws' }
        }
      },
      {
        info: 'rococoManta',
        isDisabled: true, // Rococo reset
        paraId: 2021,
        text: t('rpc.rococo.manta', 'Manta PC1', { ns: 'apps-config' }),
        providers: {
          Manta: { type: 'json-rpc' as EndpointType, param: 'wss://rococo.manta.network' }
        }
      },
      {
        info: 'rococoMoonrock',
        isDisabled: true, // Rococo reset
        paraId: 1286,
        text: t('rpc.rococo.moonrock', 'Moonrock', { ns: 'apps-config' }),
        providers: {
          Moonrock: { type: 'json-rpc' as EndpointType, param: 'wss://wss-moonrock.gcp.purestake.run' }
        }
      },
      {
        info: 'rococoOriginTrail',
        paraId: 2024,
        text: t('rpc.origintrail', 'OriginTrail Parachain', { ns: 'apps-config' }),
        providers: {
          'Trace Labs': 'wss://parachain-rpc.origin-trail.network'
        }
      },
      {
        info: 'rococoParami',
        isDisabled: true, // Rococo reset
        paraId: 18888,
        text: t('rpc.rococo.parami', 'Parami PC2', { ns: 'apps-config' }),
        providers: {
          Parami: { type: 'json-rpc' as EndpointType, param: 'wss://rococo.parami.io' }
        }
      },
      {
        info: 'rococoJupiter',
        isDisabled: true, // Rococo reset
        paraId: 1010,
        text: t('rpc.rococo.jupiter', 'Patract Jupiter PC1', { ns: 'apps-config' }),
        providers: {
          jupiter: { type: 'json-rpc' as EndpointType, param: 'wss://ws.rococo.jupiter.patract.cn' }
        }
      },
      {
        info: 'rococoPhala',
        isDisabled: true, // Rococo reset
        paraId: 1030,
        text: t('rpc.rococo.phala', 'Phala PC1', { ns: 'apps-config' }),
        providers: {
          Phala: { type: 'json-rpc' as EndpointType, param: 'wss://rococov1.phala.network/ws' }
        }
      },
      {
        info: 'rococoPhoenix',
        isDisabled: true, // Rococo reset
        paraId: 6806,
        text: t('rpc.rococo.phoenix', 'PHOENIX PC1', { ns: 'apps-config' }),
        providers: {
          'PHOENIX Protocol': { type: 'json-rpc' as EndpointType, param: 'wss://phoenix-ws.coinid.pro' }
        }
      },
      {
        info: 'rococoPlasm',
        isDisabled: true, // Rococo reset
        paraId: 5000,
        text: t('rpc.rococo.plasm', 'Plasm PC2', { ns: 'apps-config' }),
        providers: {
          PlasmNetwork: { type: 'json-rpc' as EndpointType, param: 'wss://rpc.rococo.plasmnet.io' }
        }
      },
      {
        info: 'rococoPolkabtc',
        isDisabled: true, // Rococo reset
        paraId: 21,
        text: t('rpc.rococo.polkabtc', 'PolkaBTC PC1', { ns: 'apps-config' }),
        providers: {
          Interlay: { type: 'json-rpc' as EndpointType, param: 'wss://rococo.polkabtc.io/api/parachain' }
        }
      },
      {
        info: 'rococoPolkaFoundry',
        isDisabled: true, // Rococo reset
        paraId: 1111,
        text: t('rpc.rococo.polkafoundry', 'PolkaFoundry PC1', { ns: 'apps-config' }),
        providers: {
          PolkaFoundry: { type: 'json-rpc' as EndpointType, param: 'wss://rococo.polkafoundry.com' }
        }
      },
      {
        info: 'rococoPrism',
        isDisabled: true, // Rococo reset
        paraId: 2002,
        text: t('rpc.rococo.prism', 'Prism PC1', { ns: 'apps-config' }),
        providers: {
          Prism: { type: 'json-rpc' as EndpointType, param: 'wss://rococo.psm.link' }
        }
      },
      {
        info: 'rococoRobonomics',
        isDisabled: true, // Rococo reset
        paraId: 3000,
        text: t('rpc.rococo.robonomics', 'Robonomics PC2', { ns: 'apps-config' }),
        providers: {
          Airalab: { type: 'json-rpc' as EndpointType, param: 'wss://rococo.parachain.robonomics.network' }
        }
      },
      {
        info: 'rococoSubDAO',
        isDisabled: true, // Rococo reset
        paraId: 888,
        text: t('rpc.rococo.subdao', 'SubDAO PC1', { ns: 'apps-config' }),
        providers: {
          SubDAONetwork: { type: 'json-rpc' as EndpointType, param: 'wss://parachain.subdao.network' }
        }
      },
      {
        info: 'rococoSubsocial',
        isDisabled: true, // Rococo reset
        paraId: 28,
        text: t('rpc.rococo.subsocial', 'Subsocial PC1', { ns: 'apps-config' }),
        providers: {
          DappForce: { type: 'json-rpc' as EndpointType, param: 'wss://roc.subsocial.network' }
        }
      },
      {
        info: 'rococoTrustBase',
        isDisabled: true, // Rococo reset
        paraId: 6633,
        text: t('rpc.rococo.trustbase', 'TrustBase PC1', { ns: 'apps-config' }),
        providers: {
          TrustBase: { type: 'json-rpc' as EndpointType, param: 'wss://rococo.trustednodes.net' }
        }
      },
      {
        info: 'rococoUnitv',
        isDisabled: true, // Rococo reset
        paraId: 3,
        text: t('rpc.rococo.unitv', 'Unit Network', { ns: 'apps-config' }),
        providers: {
          'Unit Network': { type: 'json-rpc' as EndpointType, param: 'wss://unitp.io' }
        }
      },
      {
        info: 'rococoVln',
        paraId: 2007,
        text: t('rpc.rococo.vln', 'Valibre Network PC', { ns: 'apps-config' }),
        providers: {
          Valibre:  { type: 'json-rpc' as EndpointType, param: 'wss://testnet.valibre.dev' }
        }
      },
      {
        info: 'rococoZeitgeist',
        isDisabled: true, // Rococo reset
        paraId: 9123,
        text: t('rpc.rococo.zeitgeist', 'Zeitgeist PC', { ns: 'apps-config' }),
        providers: {
          Zeitgeist: { type: 'json-rpc' as EndpointType, param: 'wss://roc.zeitgeist.pm' }
        }
      },
      {
        info: 'rococoZenlink',
        isDisabled: true, // Rococo reset
        paraId: 1188,
        text: t('rpc.rococo.zenlink', 'Zenlink PC1', { ns: 'apps-config' }),
        providers: {
          Zenlink: { type: 'json-rpc' as EndpointType, param: 'wss://rococo-parachain.zenlink.pro' }
        }
      }
    ]
  };
}

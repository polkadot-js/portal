// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { EndpointOption } from './types';

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
      Parity: 'wss://rococo-rpc.polkadot.io',
      OnFinality: 'wss://rococo.api.onfinality.io/public-ws',
      'Patract Elara': 'wss://rococo.elara.patract.io'
      // 'Ares Protocol': 'wss://rococo.aresprotocol.com' // https://github.com/polkadot-js/apps/issues/5767
      // Pinknode: 'wss://rpc.pinknode.io/rococo/explorer' // https://github.com/polkadot-js/apps/issues/5721
    },
    teleport: [1000, 100, 110, 120],
    linked: [
      // (1) all system parachains
      {
        info: 'rococoTick',
        paraId: 100,
        text: t('rpc.rococo.tick', 'Tick', { ns: 'apps-config' }),
        providers: {
          Parity: 'wss://tick-rpc.polkadot.io'
        },
        teleport: [-1]
      },
      {
        info: 'rococoTrick',
        paraId: 110,
        text: t('rpc.rococo.trick', 'Trick', { ns: 'apps-config' }),
        providers: {
          Parity: 'wss://trick-rpc.polkadot.io'
        },
        teleport: [-1]
      },
      {
        info: 'rococoTrack',
        paraId: 120,
        text: t('rpc.rococo.track', 'Track', { ns: 'apps-config' }),
        providers: {
          Parity: 'wss://track-rpc.polkadot.io'
        },
        teleport: [-1]
      },
      // (2) common good, leave as second group
      {
        info: 'rococoStatemint',
        paraId: 1000,
        text: t('rpc.rococo.statemint', 'Statemint', { ns: 'apps-config' }),
        providers: {
          Parity: 'wss://statemint-rococo-rpc.parity.io'
        },
        teleport: [-1]
      },
      // (3) parachains with id (info here maps to the actual "named icon")
      //
      // NOTE: Added alphabetical based on chain name
      {
        info: 'rococoApron',
        isDisabled: true, // Rococo reset
        paraId: 2048,
        text: t('rpc.rococo.apron', 'Apron PC1', { ns: 'apps-config' }),
        providers: {
          'Apron Network': 'wss://rococo.apron.network'
        }
      },
      {
        info: 'rococoAres',
        isDisabled: true, // Rococo reset
        paraId: 1006,
        text: t('rpc.rococo.ares', 'Ares PC1', { ns: 'apps-config' }),
        providers: {
          'Ares Protocol': 'wss://rococo.parachain.aresprotocol.com'
        }
      },
      {
        info: 'rococoBifrost',
        isDisabled: true, // Rococo reset
        paraId: 1024,
        text: t('rpc.rococo.bifrost', 'Bifrost PC1', { ns: 'apps-config' }),
        providers: {
          Bifrost: 'wss://rococo-1.testnet.liebi.com'
        }
      },
      {
        info: 'rococoBitCountry',
        isDisabled: true, // Rococo reset
        paraId: 1008,
        text: t('rpc.rococo.bitcountry', 'Bit.Country PC1', { ns: 'apps-config' }),
        providers: {
          BitCountry: 'wss://tewai-parachain.bit.country:9955'
        }
      },
      {
        info: 'rococoClover',
        isDisabled: true, // Rococo reset
        paraId: 229,
        text: t('rpc.rococo.clover', 'Clover PC1', { ns: 'apps-config' }),
        providers: {
          Clover: 'wss://api-rococo.clover.finance'
        }
      },
      {
        info: 'rococoCrab',
        isDisabled: true, // Rococo reset
        paraId: 9,
        text: t('rpc.rococo.crab', 'Darwinia Crab PC2', { ns: 'apps-config' }),
        providers: {
          Darwinia: 'wss://crab-pc2-rpc.darwinia.network'
        }
      },
      {
        info: 'rococoCrust',
        isDisabled: true, // Rococo reset
        paraId: 2001,
        text: t('rpc.rococo.crust', 'Crust PC1', { ns: 'apps-config' }),
        providers: {
          Crust: 'wss://api-rococo.crust.network'
        }
      },
      {
        info: 'rococoChainX',
        isDisabled: true, // Rococo reset
        paraId: 1059,
        text: t('rpc.rococo.chainx', 'ChainX PC1', { ns: 'apps-config' }),
        providers: {
          ChainX: 'wss://sherpax.chainx.org'
        }
      },
      {
        info: 'rococoDarwinia',
        isDisabled: true, // Rococo reset
        paraId: 18,
        text: t('rpc.rococo.darwinia', 'Darwinia PC2', { ns: 'apps-config' }),
        providers: {
          Darwinia: 'wss://pc2-rpc.darwinia.network'
        }
      },
      {
        info: 'rococoDataHighway',
        isDisabled: true, // Rococo reset
        paraId: 2,
        text: t('rpc.rococo.datahighway', 'DataHighway', { ns: 'apps-config' }),
        providers: {
          DataHighway: 'wss://spreehafen.datahighway.com'
        }
      },
      {
        info: 'rococoEave',
        isDisabled: true, // Rococo reset
        paraId: 2003,
        text: t('rpc.rococo.eave', 'Steam PC', { ns: 'apps-config' }),
        providers: {
          EAVE: 'wss://steamcollator.eave.network'
        }
      },
      {
        info: 'rococoEncointer',
        isDisabled: true, // Rococo reset
        paraId: 1862,
        text: t('rpc.rococo.encointer', 'Encointer PC1', { ns: 'apps-config' }),
        providers: {
          Encointer: 'wss://rococo.encointer.org'
        }
      },
      {
        info: 'rococoGalital',
        isDisabled: true, // Rococo reset
        paraId: 1230,
        text: t('rpc.rococo.galital', 'Galital PC1', { ns: 'apps-config' }),
        providers: {
          StarkleyTech: 'wss://galital-rpc.starkleytech.com'
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
        text: t('rpc.rococo.halongbay', 'Halongbay', { ns: 'apps-config' }),
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
          HydraDX: 'wss://hydrate-rpc.hydradx.io:9944'
        }
      },
      {
        info: 'rococoIdavoll',
        isDisabled: true, // Rococo reset
        paraId: 7766,
        text: t('rpc.rococo.idavoll', 'Idavoll', { ns: 'apps-config' }),
        providers: {
          Idavoll: 'wss://rococo.idavoll.network'
        }
      },
      {
        info: 'rococoIntegritee',
        isDisabled: true, // Rococo reset
        paraId: 1983,
        text: t('rpc.rococo.integritee', 'Integritee PC1', { ns: 'apps-config' }),
        providers: {
          SCS: 'wss://rococo.integritee.network'
        }
      },
      {
        info: 'rococoKilt',
        isDisabled: true, // Rococo reset
        paraId: 12623,
        text: t('rpc.rococo.kilt', 'KILT PC1', { ns: 'apps-config' }),
        providers: {
          'KILT Protocol': 'wss://para.rococo-v1.kilt.io'
        }
      },
      {
        info: 'rococoKonomi',
        isDisabled: true, // Rococo reset
        paraId: 18403,
        text: t('rpc.rococo.konomi', 'Komomi Network', { ns: 'apps-config' }),
        providers: {
          'Konomi Network': 'wss://rococo.konomi.tech'
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
          Litentry: 'wss://rococov1.litentry.io'
        }
      },
      {
        info: 'rococoLoomNetwork',
        paraId: 2043,
        text: t('rpc.rococo.loomnetwork', 'Loom Network', { ns: 'apps-config' }),
        providers: {
          LoomNetwork: 'wss://rococo.dappchains.com'
        }
      },
      {
        info: 'rococoAcala',
        isDisabled: true, // Rococo reset
        paraId: 1000,
        text: t('rpc.rococo.acala', 'Mandala PC2', { ns: 'apps-config' }),
        providers: {
          Acala: 'wss://rococo-1.acala.laminar.one'
        }
      },
      {
        info: 'rococoMathChain',
        isDisabled: true, // Rococo reset
        paraId: 40,
        text: t('rpc.rococo.mathchain', 'MathChain PC1', { ns: 'apps-config' }),
        providers: {
          MathWallet: 'wss://testpara.maiziqianbao.net/ws'
        }
      },
      {
        info: 'rococoManta',
        isDisabled: true, // Rococo reset
        paraId: 2021,
        text: t('rpc.rococo.manta', 'Manta PC1', { ns: 'apps-config' }),
        providers: {
          Manta: 'wss://rococo.manta.network'
        }
      },
      {
        info: 'rococoMoonrock',
        isDisabled: true, // Rococo reset
        paraId: 1286,
        text: t('rpc.rococo.moonrock', 'Moonrock', { ns: 'apps-config' }),
        providers: {
          Moonrock: 'wss://wss-moonrock.gcp.purestake.run'
        }
      },
      {
        info: 'rococoOriginTrail',
        paraId: 2037,
        text: t('rpc.origintrail', 'OriginTrail Parachain', { ns: 'apps-config' }),
        providers: {
          'Trace Labs': 'wss://polkadot-js-second.origin-trail.network'
        }
      },
      {
        info: 'rococoParami',
        isDisabled: true, // Rococo reset
        paraId: 18888,
        text: t('rpc.rococo.parami', 'Parami PC2', { ns: 'apps-config' }),
        providers: {
          Parami: 'wss://rococo.parami.io'
        }
      },
      {
        info: 'rococoJupiter',
        isDisabled: true, // Rococo reset
        paraId: 1010,
        text: t('rpc.rococo.jupiter', 'Patract Jupiter PC1', { ns: 'apps-config' }),
        providers: {
          jupiter: 'wss://ws.rococo.jupiter.patract.cn'
        }
      },
      {
        info: 'rococoPhala',
        isDisabled: true, // Rococo reset
        paraId: 1030,
        text: t('rpc.rococo.phala', 'Phala PC1', { ns: 'apps-config' }),
        providers: {
          Phala: 'wss://rococov1.phala.network/ws'
        }
      },
      {
        info: 'rococoPhoenix',
        isDisabled: true, // Rococo reset
        paraId: 6806,
        text: t('rpc.rococo.phoenix', 'PHOENIX PC1', { ns: 'apps-config' }),
        providers: {
          'PHOENIX Protocol': 'wss://phoenix-ws.coinid.pro'
        }
      },
      {
        info: 'rococoPlasm',
        isDisabled: true, // Rococo reset
        paraId: 5000,
        text: t('rpc.rococo.plasm', 'Plasm PC2', { ns: 'apps-config' }),
        providers: {
          PlasmNetwork: 'wss://rpc.rococo.plasmnet.io'
        }
      },
      {
        info: 'rococoPolkabtc',
        isDisabled: true, // Rococo reset
        paraId: 21,
        text: t('rpc.rococo.polkabtc', 'PolkaBTC PC1', { ns: 'apps-config' }),
        providers: {
          Interlay: 'wss://rococo.polkabtc.io/api/parachain'
        }
      },
      {
        info: 'rococoPolkaFoundry',
        isDisabled: true, // Rococo reset
        paraId: 1111,
        text: t('rpc.rococo.polkafoundry', 'PolkaFoundry PC1', { ns: 'apps-config' }),
        providers: {
          PolkaFoundry: 'wss://rococo.polkafoundry.com'
        }
      },
      {
        info: 'rococoPrism',
        isDisabled: true, // Rococo reset
        paraId: 2002,
        text: t('rpc.rococo.prism', 'Prism PC1', { ns: 'apps-config' }),
        providers: {
          Prism: 'wss://rococo.psm.link'
        }
      },
      {
        info: 'rococoRobonomics',
        isDisabled: true, // Rococo reset
        paraId: 3000,
        text: t('rpc.rococo.robonomics', 'Robonomics PC2', { ns: 'apps-config' }),
        providers: {
          Airalab: 'wss://rococo.parachain.robonomics.network'
        }
      },
      {
        info: 'rococoSubDAO',
        isDisabled: true, // Rococo reset
        paraId: 888,
        text: t('rpc.rococo.subdao', 'SubDAO PC1', { ns: 'apps-config' }),
        providers: {
          SubDAONetwork: 'wss://parachain.subdao.network'
        }
      },
      {
        info: 'rococoSubsocial',
        isDisabled: true, // Rococo reset
        paraId: 28,
        text: t('rpc.rococo.subsocial', 'Subsocial PC1', { ns: 'apps-config' }),
        providers: {
          DappForce: 'wss://roc.subsocial.network'
        }
      },
      {
        info: 'rococoTrustBase',
        isDisabled: true, // Rococo reset
        paraId: 6633,
        text: t('rpc.rococo.trustbase', 'TrustBase PC1', { ns: 'apps-config' }),
        providers: {
          TrustBase: 'wss://rococo.trustednodes.net'
        }
      },
      {
        info: 'rococoUnitv',
        isDisabled: true, // Rococo reset
        paraId: 3,
        text: t('rpc.rococo.unitv', 'Unit Network', { ns: 'apps-config' }),
        providers: {
          'Unit Network': 'wss://unitp.io'
        }
      },
      {
        info: 'rococoVln',
        paraId: 2007,
        text: t('rpc.rococo.vln', 'Valibre Network PC', { ns: 'apps-config' }),
        providers: {
          Valibre: 'wss://testnet.valibre.dev'
        }
      },
      {
        info: 'rococoZeitgeist',
        isDisabled: true, // See https://github.com/polkadot-js/apps/issues/5842
        paraId: 2050,
        text: t('rpc.rococo.zeitgeist', 'Zeitgeist PC', { ns: 'apps-config' }),
        providers: {
          Zeitgeist: 'wss://roc.zeitgeist.pm'
        }
      },
      {
        info: 'rococoZenlink',
        isDisabled: true, // Rococo reset
        paraId: 1188,
        text: t('rpc.rococo.zenlink', 'Zenlink PC1', { ns: 'apps-config' }),
        providers: {
          Zenlink: 'wss://rococo-parachain.zenlink.pro'
        }
      }
    ]
  };
}

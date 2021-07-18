// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint sort-keys: ["error", "asc", { caseSensitive: false }] */

import { sanitize } from './util';

// The mapping here is done on the actual chain name (system.chain RPC) or
// the actual RPC node it is corrected to (system.name RPC)

// defaults
const emptyColor = '#99999';

// based on chain name
// alphabetical
const chainApron = 'linear-gradient(45deg, #0099F7 0%, #2E49EB 100%)';
const chainBitCountry = '#191a2e';
const chainBeastEave = '#900048';
const chainCrab = '#7C30DD';
const chainCrust = '#ff8812';
const chainClover = 'linear-gradient(to right, #52ad75, #7cc773)';
const chainChainx = '#F6C94A';
const chainCrownSterling = '#13264b';
const chainDarwinia = 'linear-gradient(-45deg, #FE3876 0%, #7C30DD 71%, #3A30DD 100%)';
const chainDotMog = '#020609';
const chainEquilibrium = '#1792ff';
const chainFantour = '#5a189a';
const chainGalital = '#00063F';
const chainGamePower = '#5d21a5';
const chainGenshiro = '#e8662d';
const chainHanonycash = '#0099CC';
const chainHydrate = '#000000';
const chainIpse = '#08a1e8';
const chainKarura = '#ff4c3b';
const chainKhala = '#03f3f3';
const chainKlug = '#000000';
const chainKulupu = '#003366';
const chainManta = '#2070a6';
const chainMoonrock = '#3d1d5a';
const chainNFTMart = '#815287';
const chainOakTestnet = '#E38985';
const chainPangolin = '#5744ff';
const chainParami = '#ee06e2';
const chainPhala = '#a7e300';
const chainPhoenix = '#d42181';
const chainPlasm = '#2096F3';
const chainPolkabtc = '#510101';
const chainPolkadex = '#7C30DD';
const chainPolkadot = '#e6007a';
const chainPolkaFoundry = '#ff527c';
const chainPolkaSmith = '#0DDDFB';
const chainPontem = '#A92FAC';
const chainPrism = 'linear-gradient(45deg, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)';
const chainKilt = '#5ab9aa';
const chainKonomi = '#007aff';
const chainKusama = '#000000';
const chainKylin = '#ed007e';
const chainLitentry = 'linear-gradient(45deg, #5cc27c 0%, #6de98f 100%)';
const chainMybank = '#282736';
const chainRocco = '#6f36dc';
const chainRoccoAcala = '#173DC9';
const chainRoccoAres = '#70FF8B';
const chainRoccoBifrost = 'linear-gradient(-45deg, #9E3BFF 0%, #492CFF 100%)';
const chainRoccoDarwinia = 'linear-gradient(-45deg, #FE3876 0%, #7C30DD 71%, #3A30DD 100%)';
const chainRoccoDataHighway = 'linear-gradient(-90deg, #9400D3 0%, #5A5CA9 50%, #00BFFF 100%)';
const chainRococoEave = '#900048';
const chainRococoLaminar = '#004FFF';
const chainRoccoTick = '#22bb22';
const chainRoccoTrack = '#bb2222';
const chainRoccoTrick = '#2222bb';
const chainRiochain = '#4d87f6';
const chainSakura = '#ff5995';
const chainShadow = '#ffa940';
const chainShiden = '#5923B2';
const chainSnakenet = '#f653a2';
const chainWestend = '#da68a7';
const chainWhala = '#03f3f3';
const chainGalois = '#000000';
const chainZero = '#000000';
const chainZenlink = 'linear-gradient(45deg, #F20082 0%, #FF4D4D 100%)';
const chainJupiter = '#7143ff';
const chainUniarts = 'linear-gradient(150deg, #333ef7 0%, #55adff 100%)';
const chainUnique = '#40BCFF';
const chainIdavoll = '#ff43ff';
const chainSubDAO = 'linear-gradient(50deg, #F20092 0%, #FF4D5D 100%)';
const chainSubsocial = '#b9018c';
const chainTrustBase = '#ff43aa';
const chainUnitv = '#1452F0';
const chainVln = '#33cc33';
const chainWeb3games = 'linear-gradient(45deg, #0099F7 0%, #F11712 100%)';
const chainWestlake = 'linear-gradient(-90deg, #9400D3 0%, #5A5CA9 50%, #00BFFF 100%)';
// based on node name
// alphabetical
const nodeApron = 'linear-gradient(45deg, #0099F7 0%, #2E49EB 100%)';
const nodeAres = '#70FF8B';
const nodeBasilisk = '#9eec1b';
const nodeBitCountry = '#191a2e';
const nodeBifrost = 'linear-gradient(-45deg, #9E3BFF 0%, #492CFF 100%)';
const nodeCanvas = '#c77cff';
const nodeCentrifuge = '#fcc367';
const nodeDotMog = '#020609';
const nodeEdgeware = '#0a95df';
const nodeEncointerNotee = '#cc0000';
const nodeEncointerTeeproxy = '#0000cc';
const nodeFantour = '#5a189a';
const nodeGalital = '#00063F;';
const nodeGamePower = '#5d21a5';
const nodeGeek = '#4f46e5';
const nodeIntegritee = '#658ea9';
const nodeIpse = '#08a1e8';
const nodeJupiter = '#7143ff';
const nodeKonomi = '#007aff';
const nodeKpron = 'linear-gradient(45deg, #0099F7 0%, #2E49EB 100%)';
const nodeKylin = '#ed007e';
const nodeKlug = '#663399';
const nodeLitentry = 'linear-gradient(45deg, #5cc27c 0%, #6de98f 100%)';
const nodeManta = '#2070a6';
const nodeMoonbeam = '#53cbc9';
const nodeMoonriver = '#0E132E';
const nodeMybank = '#282736';
const nodeNFTMart = '#307182';
const nodeNodle = '#1ab394';
const nodeOakTestnet = '#E38985';
const nodeOpportunity = '#6143bc';
const nodeOriginTrail = '#131415';
const nodePangolin = '#5744ff';
const nodeParami = '#ee06e2';
const nodePolkadex = '#7C30DD';
const nodePolymesh = '#1348e4';
const nodePontem = '#A92FAC';
const nodePrism = 'linear-gradient(45deg, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)';
const nodeRealis = 'linear-gradient(45deg, #E8AAC9 0%, #C4D9E7 50%, #EFD6E0 100%)';
const nodeRiochain = '#1A3BB3';
const nodeSora = '#2D2926';
const nodeStafi = '#00F3AB';
const nodeSubDAO = 'linear-gradient(50deg, #F20092 0%, #FF4D5D 100%)';
const nodeSubsocial = '#b9018c';
const nodeTernoa = '#d622ff';
const nodeUniarts = chainUniarts;
const nodeUnique = chainUnique;
const nodeWeb3games = 'linear-gradient(45deg, #0099F7 0%, #F11712 100%)';
const nodeWestlake = chainWestlake;
const nodeZeitgeist = 'linear-gradient(180deg, rgba(32,90,172,1) 0%, rgba(26,72,138,1) 50%, rgba(13,36,69,1) 100%)';
const nodeZero = '#0099cc';
const nodeZenlink = 'linear-gradient(45deg, #F20082 0%, #FF4D4D 100%)';
const nodeSubGame = '#EB027D';
const nodeZCloak = 'linear-gradient(to right, #7DA6D4,  #B996E5)';

// based on the spec name
const specShell = '#2e86ab'; // '#0596FC';
const specStatemine = '#113911';
const specStatemint = '#86e62a';
const specWestmint = '#77bb77';

export { emptyColor };

// Alphabetical overrides based on the actual matched chain name
// NOTE: This is as retrieved via the system.chain RPC
export const chainColors: Record<string, string> = Object.entries({
  'acala mandala pc1': chainRoccoAcala,
  'acala mandala pc2': chainRoccoAcala,
  'Apron PC1': chainApron,
  'Ares PC1': chainRoccoAres,
  'Beast Developer': chainBeastEave,
  bifrost: chainRoccoBifrost,
  'Bifrost Asgard CC4': chainRoccoBifrost,
  'Bifrost PC1': chainRoccoBifrost,
  'Bit.Country Tewai Chain': chainBitCountry,
  ChainX: chainChainx,
  Clover: chainClover,
  'crust maxwell': chainCrust,
  'Crust PC1': chainCrust,
  'Crown Sterling': chainCrownSterling,
  'darwinia cc1': chainDarwinia,
  'Darwinia Crab': chainCrab,
  'Darwinia Crab Redirect': chainCrab,
  'Darwinia PC2': chainRoccoDarwinia,
  DataHighway: chainRoccoDataHighway,
  'DOTMog.com NET': chainDotMog,
  'Encointer Canary': nodeEncointerNotee,
  'Encointer PC1': nodeEncointerNotee,
  Equilibrium: chainEquilibrium,
  EquilibriumTestnet: chainGenshiro,
  'Fantour Development': chainFantour,
  Galital: chainGalital,
  Galois: chainGalois,
  'GamePower Network': chainGamePower,
  'Genshiro Rococo Testnet': chainGenshiro,
  'Halongbay PC1': chainPolkaFoundry,
  hanonycash: chainHanonycash,
  'HydraDX Hydrate': chainHydrate,
  'HydraDX Snakenet': chainSnakenet,
  'HydraDX Snakenet Gen2': chainSnakenet,
  'HydraDX Snakenet Gen3': chainSnakenet,
  Idavoll: chainIdavoll,
  IpseTestnet: chainIpse,
  'Jupiter A1': chainJupiter,
  'Jupiter PC1': chainJupiter,
  Karura: chainKarura,
  Khala: chainKhala,
  KILT: chainKilt,
  'KILT Local': chainKilt,
  'KILT Peregrine Testnet': chainKilt,
  'KILT Testnet': chainKilt,
  'KLUGDOSSIER.NET': chainKlug,
  Konomi: chainKonomi,
  Kpron: nodeKpron,
  Kulupu: chainKulupu,
  Kusama: chainKusama,
  'Kusama CC1': chainKusama,
  'Kusama CC2': chainKusama,
  'Kusama CC3': chainKusama,
  'Kylin Testnet': chainKylin,
  'laminar turbulence pc1': chainRococoLaminar,
  Litentry: chainLitentry,
  'Manta Testnet': chainManta,
  'MantaChain PC1': chainManta,
  Mars: nodeAres,
  'MathChain PC1': chainGalois,
  'Moonbase Alpha': nodeMoonbeam,
  'Moonbase Development Testnet': nodeMoonbeam,
  'Moonbase Stage': nodeMoonbeam,
  Moonriver: nodeMoonriver,
  Moonrock: chainMoonrock,
  Moonshadow: nodeMoonbeam,
  'mybank.network Testnet': chainMybank,
  'NFTMart Staging': chainNFTMart,
  'NFTMart Testnet': chainNFTMart,
  'OAK Testnet': chainOakTestnet,
  'OriginTrail Parachain': nodeOriginTrail,
  'OriginTrail Parachain Testnet': nodeOriginTrail,
  Pangolin: chainPangolin,
  'Parami PC2': chainParami,
  'Phala PC1': chainPhala,
  'Phala PoC 4': chainPhala,
  PHOENIX: chainPhoenix,
  Plasm: chainPlasm,
  'Plasm PC2': chainPlasm,
  PolkaBTC: chainPolkabtc,
  'PolkaBTC Staging': chainPolkabtc,
  'Polkadex Testnet': chainPolkadex,
  Polkadot: chainPolkadot,
  'Polkadot CC1': chainPolkadot,
  PolkaSmith: chainPolkaSmith,
  'Pontem Testnet': chainPontem,
  'Prism PC1': chainPrism,
  'Prism Testnet': chainPrism,
  'ReAlis Network': nodeRealis,
  'RioChain CC-1': chainRiochain,
  'Riochain Staging': chainRiochain,
  Rococo: chainRocco,
  Sakura: chainSakura,
  Shadow: chainShadow,
  sherpax: chainChainx,
  Shiden: chainShiden,
  'Shiden Shell': chainShiden,
  Statemine: specStatemine,
  'Statemine Test': specStatemine,
  Statemint: specStatemint,
  'Statemint Test': specStatemint,
  'Steam PC': chainRococoEave,
  'SubDAO PC1': chainSubDAO,
  subgame: nodeSubGame,
  'SubGame Gamma': nodeSubGame,
  'SubGame Staging': nodeSubGame,
  'Subsocial PC1': chainSubsocial,
  Tick: chainRoccoTick,
  Track: chainRoccoTrack,
  Trick: chainRoccoTrick,
  'TrustBase PC1': chainTrustBase,
  'uni arts staging network': chainUniarts,
  'UniArts Mainnet': chainUniarts,
  'Unique Node': chainUnique,
  UNIT: chainUnitv,
  'VLN PC': chainVln,
  Web3games: chainWeb3games,
  Westend: chainWestend,
  Westlake: chainWestlake,
  Westmint: specWestmint,
  'Westmint Test': specWestmint,
  Whala: chainWhala,
  WILT: chainKilt,
  'zcloak poc1': nodeZCloak,
  'Zenlink PC1': chainZenlink,
  'ZERO.IO': chainZero
}).reduce<Record<string, string>>((colors, [chain, color]) => ({
  ...colors,
  [sanitize(chain)]: color
}), {});

// Alphabetical overrides based on the actual software node type
// NOTE: This is as retrieved via the system.name RPC
export const nodeColors = Object.entries({
  'Apron Node': nodeApron,
  Basilisk: nodeBasilisk,
  'Bifrost Node': nodeBifrost,
  'Bit.Country Node': nodeBitCountry,
  'Canvas Node': nodeCanvas,
  'centrifuge chain': nodeCentrifuge,
  'Centrifuge Chain Node': nodeCentrifuge,
  'DOTMog Node': nodeDotMog,
  'edgeware node': nodeEdgeware,
  'Crown Sterling':chainCrownSterling,
  'Encointer Node': nodeEncointerNotee,
  'Encointer Node noTEE': nodeEncointerNotee,
  'Encointer Node TEE proxy': nodeEncointerTeeproxy,
  'Fantour Development': nodeFantour,
  Galital: nodeGalital,
  'Galital Parachain Collator': nodeGalital,
  'GamePower Node': nodeGamePower,
  GEEK: nodeGeek,
  'Integritee Collator': nodeIntegritee,
  IpseTestnet: nodeIpse,
  'Klug Dossier Node': nodeKlug,
  'Konomi Collator': nodeKonomi,
  'Kpron Collator': nodeKpron,
  'Kylin Collator': nodeKylin,
  'Litentry Collator': nodeLitentry,
  'Manta Collator': nodeManta,
  'Manta Node': nodeManta,
  'mybank.network node': nodeMybank,
  'NFTMart Staging': nodeNFTMart,
  'NFTMart Testnet': nodeNFTMart,
  'nodle chain node': nodeNodle,
  'OAK Testnet': nodeOakTestnet,
  'Opportunity Standalone Testnet': nodeOpportunity,
  'OriginTrail Parachain': nodeOriginTrail,
  Pangolin: nodePangolin,
  'Parami Collator': nodeParami,
  'Patract Node': nodeJupiter,
  'Polkadex Node': nodePolkadex,
  'Polymesh Node': nodePolymesh,
  Pontem: nodePontem,
  'Prism Collator': nodePrism,
  'Prism Node': nodePrism,
  'ReAlis Network': nodeRealis,
  'Rio Defi Chain Node': nodeRiochain,
  'Riochain Staging': nodeRiochain,
  'Shiden Collator': chainShiden,
  SORA: nodeSora,
  'Stafi node': nodeStafi,
  'Statemine Collator': specStatemint,
  'Statemint Collator': specStatemint,
  'SubDAO Collator': nodeSubDAO,
  subgame: nodeSubGame,
  'SubGame Gamma': nodeSubGame,
  'SubGame Staging': nodeSubGame,
  'subsocial node': nodeSubsocial,
  'subzero node': nodeZero,
  'Ternoa Node': nodeTernoa,
  'uni arts node': nodeUniarts,
  'UniArts Node': nodeUniarts,
  'Unique Node': nodeUnique,
  Web3games: nodeWeb3games,
  Westlake: nodeWestlake,
  'Westmint Collator': specWestmint,
  'zcloak node': nodeZCloak,
  'Zeitgeist Collator': nodeZeitgeist,
  'Zeitgeist Node': nodeZeitgeist,
  'Zenlink Collator': nodeZenlink
}).reduce<Record<string, string>>((colors, [node, color]) => ({
  ...colors,
  [sanitize(node)]: color
}), {});

// Alphabetical overrides based on the actual software node type
// NOTE: This is as retrieved via the system.name RPC
export const specColors = Object.entries({
  shell: specShell,
  statemine: specStatemine,
  statemint: specStatemint,
  westmint: specWestmint
}).reduce<Record<string, string>>((colors, [spec, color]) => ({
  ...colors,
  [sanitize(spec)]: color
}), {});

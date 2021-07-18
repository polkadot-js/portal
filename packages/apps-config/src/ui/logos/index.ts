// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint sort-keys: ["error", "asc", { caseSensitive: false }] */

// The mapping here is done on the actual chain name (system.chain RPC) or
// the actual RPC node it is corrected to (system.name RPC)

// anything for a specific chain, most would probably fit into the node category (but allow for chain-specific)
// alphabetical
import { sanitize } from '../util';
import chainAltair from './chains/altair.svg';
import chainDusty from './chains/dusty.png';
import chainEquilibrium from './chains/equilibrium.svg';
import chainGenshiro from './chains/genshiro.svg';
import chainHydrate from './chains/hydrate.png';
import chainKarura from './chains/karura.svg';
import chainKusama from './chains/kusama-128.gif';
import chainPolkaBTC from './chains/polkabtc.png';
import chainRococo from './chains/rococo.svg';
import chainRococoTick from './chains/rococo-tick.svg';
import chainRococoTrack from './chains/rococo-track.svg';
import chainRococoTrick from './chains/rococo-trick.svg';
import chainShiden from './chains/shiden.png';
import chainSnakenet from './chains/snakenet.svg';
import chainUnique from './chains/unique.svg';
import chainCrownSterling from './chains/crown-sterling.png';
import extensionPolkadotJs from './extensions/polkadot-js.svg';
import externalCommonwealth from './external/commonwealth.png';
import externalDotScanner from './external/dotscanner.png';
import externalPolkascan from './external/polkascan.png';
import externalPolkassembly from './external/polkassembly.png';
import externalPolkastats from './external/polkastats.png';
import externalSubscan from './external/subscan.svg';
import nodeAcala from './nodes/acala-circle.svg';
import nodeApron from './nodes/apron.png';
import nodeAres from './nodes/ares.svg';
import nodeBasilisk from './nodes/basilisk.png';
import nodeBeast from './nodes/beast.svg';
import nodeBifrost from './nodes/bifrost.svg';
import nodeBitCountry from './nodes/bitcountry.svg';
import nodeCalamari from './nodes/calamari.png';
import nodeCanvas from './nodes/canvas-2.png';
import nodeCentrifuge from './nodes/centrifuge.png';
import nodeChainx from './nodes/chainx.svg';
import nodeClover from './nodes/clover.svg';
import nodeCrab from './nodes/crab.svg';
import nodeCrust from './nodes/crust.svg';
import nodeDarwinia from './nodes/darwinia.png';
import nodeDataHighway from './nodes/datahighway.png';
import nodeDockMainnet from './nodes/dock-mainnet.png';
import nodeDockTestnet from './nodes/dock-testnet.png';
import nodeDotMog from './nodes/dotmog.svg';
import nodeEave from './nodes/eave.svg';
import nodeEdgeware from './nodes/edgeware-circle.svg';
import nodeEncointerNotee from './nodes/encointer-notee.svg';
import nodeEncointerTeeproxy from './nodes/encointer-teeproxy.svg';
import nodeFantour from './nodes/fantour.png';
import nodeGalital from './nodes/galital-logo.png';
import nodeGamePower from './nodes/gamepower.svg';
import nodeGeek from './nodes/geek.svg';
import nodeHanonycash from './nodes/hanonycash.svg';
import nodeIdavoll from './nodes/idavoll.png';
import nodeIntegritee from './nodes/integritee.svg';
import nodeIpse from './nodes/ipse.png';
import nodeJupiter from './nodes/jupiter.svg';
import nodeKhala from './nodes/khala.svg';
import nodeKilt from './nodes/kilt.png';
import nodeKlug from './nodes/klug.png';
import nodeKonomi from './nodes/konomi.png';
import nodeKulupu from './nodes/kulupu.svg';
import nodeKylin from './nodes/kylin.png';
import nodeLaminar from './nodes/laminar-circle.svg';
import nodeLitentry from './nodes/litentry.png';
import nodeLoomNetwork from './nodes/loom_network.png';
import nodeManta from './nodes/manta.png';
import nodeMath from './nodes/math.svg';
import moonbeam from './nodes/moonbeam.png';
import moonriver from './nodes/moonriver.svg';
import nodeMoonrock from './nodes/moonrock.png';
import moonshadow from './nodes/moonshadow.png';
import mybank from './nodes/mybank.png';
import nodeNFTMart from './nodes/nftmart.png';
import nodeNodle from './nodes/nodle.svg';
import oakTestnet from './nodes/oak-testnet.png';
import nodeOpportunity from './nodes/opportunity.png';
import nodeOriginTrail from './nodes/origintrail.png';
import nodePangolin from './nodes/pangolin.svg';
import nodeParami from './nodes/parami.png';
import nodePhala from './nodes/phala.svg';
import nodePhoenix from './nodes/phoenix.png';
import nodePlasm from './nodes/plasm.png';
import nodePolkaBTC from './nodes/polkabtc.png';
import nodePolkadex from './nodes/polkadex.svg';
import nodePolkadot from './nodes/polkadot-circle.svg';
import nodePolkadotJs from './nodes/polkadot-js.svg';
import nodePolkaFoundry from './nodes/polkafoundry.svg';
import nodePolkaSmith from './nodes/polkasmith.svg';
import nodePolymesh from './nodes/polymesh.svg';
import nodePontem from './nodes/pontem.svg';
import nodePrism from './nodes/prism.png';
import nodeRealis from './nodes/realis.png';
import nodeRiochain from './nodes/riochain.svg';
import nodeRobonomics from './nodes/robonomics.svg';
import nodeSakura from './nodes/sakura.svg';
import nodeShadow from './nodes/shadow.svg';
import nodeShell from './nodes/shell.svg';
import nodeSora from './nodes/sora-substrate.svg';
import nodeStafi from './nodes/stafi.png';
import nodeStatemine from './nodes/statemine.svg';
import nodeSubDAO from './nodes/subdao.png';
import nodeSubGame from './nodes/subgame.svg';
import nodeSubsocial from './nodes/subsocial.svg';
import nodeSubstrate from './nodes/substrate-hexagon.svg';
import nodeTernoa from './nodes/ternoa.svg';
import nodeTrustBase from './nodes/trustbase.png';
import nodeUniarts from './nodes/uniarts.png';
import nodeUnique from './nodes/unique.svg';
import nodeUnitv from './nodes/unitv.png';
import nodeVln from './nodes/valiu.png';
import nodeWeb3games from './nodes/web3games.svg';
import nodeWestend from './nodes/westend_colour.svg';
import nodeWestlake from './nodes/westlake.png';
import nodeWhala from './nodes/whala.svg';
import nodeZCloak from './nodes/zCloak.svg';
import nodeZeitgeist from './nodes/zeitgeist.png';
import nodeZenlink from './nodes/zenlink.svg';
import nodeZero from './nodes/zero.svg';
// last-resort fallback, just something empty
import emptyLogo from './empty.svg';

// Alphabetical overrides based on the actual matched chain name
// NOTE: This is as retrieved via system.chain RPC
export const chainLogos = Object.entries({
  Altair: chainAltair,
  'Apron PC1': nodeApron,
  'Ares PC1': nodeAres,
  'Beast Developer': nodeBeast,
  Bifrost: nodeBifrost,
  'Bifrost Asgard CC4': nodeBifrost,
  ChainX: nodeChainx,
  'Charcoal Testnet': nodeCentrifuge,
  'Crust PC1': nodeCrust,
  'Crown Sterling': chainCrownSterling,
  'darwinia crab': nodeCrab,
  'Darwinia Crab PC2': nodeCrab,
  'Darwinia PC2': nodeDarwinia,
  DataHighway: nodeDataHighway,
  Dusty: chainDusty,
  'Encointer Canary': nodeEncointerNotee,
  'Encointer PC1': nodeEncointerNotee,
  Equilibrium: chainEquilibrium,
  EquilibriumTestnet: chainEquilibrium,
  Galital: nodeGalital,
  Galois: nodeMath,
  'GamePower Network': nodeGamePower,
  GEEK: nodeGeek,
  'Genshiro Rococo Testnet': chainEquilibrium,
  'HydraDX Hydrate': chainHydrate,
  'HydraDX Snakenet': chainSnakenet,
  'HydraDX Snakenet Gen2': chainSnakenet,
  'HydraDX Snakenet Gen3': chainSnakenet,
  Idavoll: nodeIdavoll,
  IpseTestnet: nodeIpse,
  'Jupiter A1': nodeJupiter,
  'Jupiter PC1': nodeJupiter,
  Karura: chainKarura,
  KILT: nodeKilt,
  'KILT Local': nodeKilt,
  'KILT Peregrine Testnet': nodeKilt,
  'KILT Testnet': nodeKilt,
  KlugDossier: nodeKlug,
  Konomi: nodeKonomi,
  Kpron: nodeApron,
  Kusama: chainKusama, // new name after CC3
  'Kusama CC1': chainKusama,
  'Kusama CC2': chainKusama,
  'Kusama CC3': chainKusama,
  'Kylin Testnet': nodeKylin,
  Litentry: nodeLitentry,
  'Loom Network Local': nodeLoomNetwork,
  LoomNetwork: nodeLoomNetwork,
  'Manta Testnet': nodeManta,
  Mars: nodeAres,
  'crown-sterling': chainCrownSterling,
  'MathChain PC1': nodeMath,
  'Moonbase Alpha': moonbeam,
  'Moonbase Development Testnet': moonbeam,
  'Moonbase Stage': moonbeam,
  Moonriver: moonriver,
  Moonrock: nodeMoonrock,
  Moonshadow: moonshadow,
  'mybank.network PC1': mybank,
  'NFTMart Staging': nodeNFTMart,
  'NFTMart Testnet': nodeNFTMart,
  'OAK Testnet': oakTestnet,
  'OriginTrail Parachain': nodeOriginTrail,
  'OriginTrail Parachain Testnet': nodeOriginTrail,
  Pangolin: nodePangolin,
  'Parami PC2': nodeParami,
  'Phala PC1': nodePhala,
  'PHOENIX PC1': nodePhoenix,
  PolkaBTC: nodePolkaBTC,
  'PolkaBTC Staging': nodePolkaBTC,
  'Polkadex Testnet': nodePolkadex,
  'PolkaFoundry PC1': nodePolkaFoundry,
  'Pontem Testnet': nodePontem,
  'Prism PC1': nodePrism,
  'Prism Testnet': nodePrism,
  'ReAlis Network': nodeRealis,
  'RioChain CC-1': nodeRiochain,
  'RioChain Staging': nodeRiochain,
  Rococo: chainRococo,
  Shiden: chainShiden,
  'Shiden Shell': chainShiden,
  Statemine: nodeStatemine,
  'Statemine Test': nodeStatemine,
  Statemint: nodeStatemine,
  'Statemint Test': nodeStatemine,
  'Steam PC': nodeEave,
  'SubDAO PC1': nodeSubDAO,
  subgame: nodeSubGame,
  'SubGame Gamma': nodeSubGame,
  'SubGame Staging': nodeSubGame,
  Subsocial: nodeSubsocial,
  'Subsocial PC': nodeSubsocial,
  Tick: chainRococoTick,
  Track: chainRococoTrack,
  Trick: chainRococoTrick,
  'TrustBase PC1': nodeTrustBase,
  'uni arts staging network': nodeUniarts,
  'UniArts Mainnet': nodeUniarts,
  Unique: chainUnique,
  'Unit Network': nodeUnitv,
  Vln: nodeVln,
  'VLN PC': nodeVln,
  Web3games: nodeWeb3games,
  Westend: nodeWestend,
  Westlake: nodeWestlake,
  Westmint: nodeStatemine,
  'Westmint Test': nodeStatemine,
  WILT: nodeKilt,
  'zcloak poc1': nodeZCloak
}).reduce<Record<string, unknown>>((logos, [chain, logo]) => ({
  ...logos,
  [sanitize(chain)]: logo
}), {});

// Alphabetical overrides based on the actual software node type
// NOTE: This is as retrieved via system.name RPC
export const nodeLogos = Object.entries({
  'Acala Node': nodeAcala,
  'Apron Node': nodeApron,
  'Apron Parachain Collator': nodeApron,
  'Ares Node': nodeAres,
  'Ares Parachain Collator': nodeAres,
  Basilisk: nodeBasilisk,
  'Beast Node': nodeBeast,
  Bifrost: nodeBifrost,
  'Bifrost Node': nodeBifrost,
  'Bit Country Tewai Parachain Collator': nodeBitCountry,
  'Bit.Country': nodeBitCountry,
  'BitCountry Node': nodeBitCountry,
  'Calamari Parachain Collator': nodeCalamari,
  'Canvas Node': nodeCanvas,
  'centrifuge chain': nodeCentrifuge,
  'Centrifuge Chain Node': nodeCentrifuge,
  'ChainX Node': nodeChainx,
  'Clover Node': nodeClover,
  crust: nodeCrust,
  'Crust Collator': nodeCrust,
  'crown-sterling':chainCrownSterling,
  darwinia: nodeDarwinia,
  'darwinia crab': nodeCrab,
  'darwinia parachain': nodeDarwinia,
  'Darwinia Runtime Module Library': nodeDarwinia,
  DataHighway: nodeDataHighway,
  'DataHighway Node': nodeDataHighway,
  'DataHighway Parachain Collator': nodeDataHighway,
  'Dock Full Node': nodeDockMainnet,
  'DOTMog Node': nodeDotMog,
  'Eave Node': nodeEave,
  'Edgeware Node': nodeEdgeware,
  'Encointer Node': nodeEncointerNotee,
  'Encointer Node noTEE': nodeEncointerNotee,
  'Encointer Node TEE proxy': nodeEncointerTeeproxy,
  'Fantour Node': nodeFantour,
  'Galital Parachain Collator': nodeGalital,
  Galois: nodeMath,
  'GamePower Node': nodeGamePower,
  GEEK: nodeGeek,
  'Halongbay Parachain Collator': nodePolkaFoundry,
  hanonycash: nodeHanonycash,
  'Idavoll Node': nodeIdavoll,
  'Integritee Collator': nodeIntegritee,
  IpseTestnet: nodeIpse,
  Khala: nodeKhala,
  'Khala Node': nodeKhala,
  KILT: nodeKilt,
  'KILT Local': nodeKilt,
  'KILT Peregrine Testnet': nodeKilt,
  'Klug Dossier Node': nodeKlug,
  'Kpron Collator': nodeApron,
  kulupu: nodeKulupu,
  'Kylin Node': nodeKylin,
  'Laminar Node': nodeLaminar,
  Litentry: nodeLitentry,
  'Litentry Collator': nodeLitentry,
  'mandala node': nodeAcala,
  'Manta Node': nodeManta,
  'Manta Parachain Collator': nodeManta,
  Moonrock: nodeMoonrock,
  'mybank.network': mybank,
  'NFTMart Staging': nodeNFTMart,
  'NFTMart Testnet': nodeNFTMart,
  'node-template': nodeSubstrate,
  'Nodle Chain Node': nodeNodle,
  'OAK Testnet': oakTestnet,
  'Opportunity Standalone Testnet': nodeOpportunity,
  'OriginTrail Parachain': nodeOriginTrail,
  'OriginTrail Parachain Testnet': nodeOriginTrail,
  Pangolin: nodePangolin,
  Parami: nodeParami,
  'parity-polkadot': nodePolkadot,
  'Patract Node': nodeJupiter,
  'Phala Collator': nodePhala,
  'phala-substrate-node': nodePhala,
  'PHOENIX Collator': nodePhoenix,
  'PHOENIX Node': nodePhoenix,
  Plasm: nodePlasm,
  'Plasm Node': nodePlasm,
  'Plasm Parachain Collator': nodePlasm,
  'Polkadex Node': nodePolkadex,
  'polkadot-js': nodePolkadotJs,
  'PolkaFoundry Node': nodePolkaFoundry,
  'PolkaFoundry Parachain Collator': nodePolkaFoundry,
  'PolkaSmith Parachain Collator': nodePolkaSmith,
  Pontem: nodePontem,
  'Prism Collator': nodePrism,
  'Prism Node': nodePrism,
  'ReAlis Network': nodeRealis,
  'Rio Defi Chain Node': nodeRiochain,
  'RioChain Staging': nodeRiochain,
  robonomics: nodeRobonomics,
  Sakura: nodeSakura,
  Shadow: nodeShadow,
  sherpax: nodeChainx,
  'Shiden Collator': chainShiden,
  SORA: nodeSora,
  Stafi: nodeStafi,
  'Stafi Node': nodeStafi,
  'Statemine Collator': nodeStatemine,
  'Statemint Collator': nodeStatemine,
  'SubDAO Collator': nodeSubDAO,
  subgame: nodeSubGame,
  'SubGame Gamma': nodeSubGame,
  'SubGame Staging': nodeSubGame,
  'Subsocial Node': nodeSubsocial,
  'Subsocial PC': nodeSubsocial,
  'subsocial-node': nodeSubsocial,
  'substrate-node': nodeSubstrate,
  'subzero node': nodeZero,
  'Ternoa Node': nodeTernoa,
  'TrustBase Collator': nodeTrustBase,
  'TrustBase Node': nodeTrustBase,
  'uni arts node': nodeUniarts,
  'UniArts Node': nodeUniarts,
  'Unique Node': nodeUnique,
  'Unit Collator': nodeUnitv,
  'Unit Node': nodeUnitv,
  Vln: nodeVln,
  'VLN PC': nodeVln,
  Web3games: nodeWeb3games,
  Westend: nodeWestend,
  Westlake: nodeWestlake,
  'Westmint Collator': nodeStatemine,
  Whala: nodeWhala,
  'Whala Node': nodeWhala,
  WILT: nodeKilt,
  'zcloak node': nodeZCloak,
  'Zeitgeist Collator': nodeZeitgeist,
  'Zeitgeist Node': nodeZeitgeist,
  Zenlink: nodeZenlink,
  'Zenlink Collator': nodeZenlink
}).reduce<Record<string, unknown>>((logos, [node, logo]) => ({
  ...logos,
  [sanitize(node)]: logo
}), {});

// Alphabetical overrides based on the actual specName
export const specLogos = Object.entries({
  shell: nodeShell,
  statemine: nodeStatemine,
  statemint: nodeStatemine,
  westmint: nodeStatemine
}).reduce<Record<string, unknown>>((logos, [spec, logo]) => ({
  ...logos,
  [sanitize(spec)]: logo
}), {});

// Alphabetical overrides when we pass an explicit logo name
// NOTE: Matches with what is defined as "info" in settings/endpoints.ts
// (Generally would be the 'network' key in the known ss58 as per
// https://github.com/polkadot-js/common/blob/master/packages/networks/src/index.ts)
export const namedLogos: Record<string, unknown> = {
  acala: nodeAcala,
  alexander: nodePolkadot,
  altair: chainAltair,
  basilisk: nodeBasilisk,
  beast: nodeBeast,
  bifrost: nodeBifrost,
  bitcountry: nodeBitCountry,
  calamari: nodeCalamari,
  canvas: nodeCanvas,
  centrifuge: nodeCentrifuge,
  chainx: nodeChainx,
  charcoal: nodeCentrifuge,
  clover: nodeClover,
  crab: nodeCrab,
  crab_redirect: nodeCrab,
  'crown-sterling': chainCrownSterling,
  crust: nodeCrust,
  darwinia: nodeDarwinia,
  datahighway: nodeDataHighway,
  'dock-mainnet': nodeDockMainnet,
  'dock-testnet': nodeDockTestnet,
  dotmog: nodeDotMog,
  dusty: chainDusty,
  eave: nodeEave,
  edgeware: nodeEdgeware,
  empty: emptyLogo,
  encointer_canary: nodeEncointerNotee,
  encointer_cantillon: nodeEncointerTeeproxy,
  encointer_gesell: nodeEncointerNotee,
  equilibrium: chainEquilibrium,
  fantour: nodeFantour,
  galital: nodeGalital,
  galois: nodeMath,
  gamepower: nodeGamePower,
  geek: nodeGeek,
  genshiro: chainGenshiro,
  halongbay: nodePolkaFoundry,
  hanonycash: nodeHanonycash,
  idavoll: nodeIdavoll,
  integritee: nodeIntegritee,
  ipse: nodeIpse,
  jupiter: nodeJupiter,
  karura: chainKarura,
  khala: nodeKhala,
  kilt: nodeKilt,
  klugdossier: nodeKlug,
  kpron: nodeApron,
  kulupu: nodeKulupu,
  kusama: chainKusama,
  kylin: nodeKylin,
  laminar: nodeLaminar,
  litentry: nodeLitentry,
  loomNetwork: nodeLoomNetwork,
  manta: nodeManta,
  mars: nodeAres,
  moonbaseAlpha: moonbeam,
  moonriver: moonriver,
  moonrock: nodeMoonrock,
  moonshadow: moonshadow,
  mybank: mybank,
  nftmart: nodeNFTMart,
  nodle: nodeNodle,
  'oak-testnet': oakTestnet,
  opportunity: nodeOpportunity,
  'origintrail-parachain-testnet': nodeOriginTrail,
  pangolin: nodePangolin,
  phala: nodePhala,
  phoenix: nodePhoenix,
  plasm: nodePlasm,
  polkabtc: nodePolkaBTC,
  polkadex: nodePolkadex,
  polkadot: nodePolkadot,
  polkafoundry: nodePolkaFoundry,
  polkasmith: nodePolkaSmith,
  polymesh: nodePolymesh,
  pontem: nodePontem,
  prism: nodePrism,
  realis: nodeRealis,
  riochain: nodeRiochain,
  robonomics: nodeRobonomics,
  rocky: nodeCrust,
  rococo: chainRococo,
  rococoAcala: nodeAcala,
  rococoApron: nodeApron,
  rococoAres: nodeAres,
  rococoBifrost: nodeBifrost,
  rococoBitCountry: nodeBitCountry,
  rococoChainX: nodeChainx,
  rococoClover: nodeClover,
  rococoCrab: nodeCrab,
  rococoCrust: nodeCrust,
  rococoDarwinia: nodeDarwinia,
  rococoDataHighway: nodeDataHighway,
  rococoEave: nodeEave,
  rococoEncointer: nodeEncointerNotee,
  rococoGalital: nodeGalital,
  rococoGenshiro: chainGenshiro,
  rococoHydrate: chainHydrate,
  rococoIdavoll: nodeIdavoll,
  rococoJupiter: nodeJupiter,
  rococoKilt: nodeKilt,
  rococoKonomi: nodeKonomi,
  rococoKylin: nodeKylin,
  rococoLaminar: nodeLaminar,
  rococoLitentry: nodeLitentry,
  rococoLoomNetwork: nodeLoomNetwork,
  rococoManta: nodeManta,
  rococoMathChain: nodeMath,
  rococoMoonrock: nodeMoonrock,
  rococoOriginTrail: nodeOriginTrail,
  rococoParami: nodeParami,
  rococoPhala: nodePhala,
  rococoPhoenix: nodePhoenix,
  rococoPlasm: nodePlasm,
  rococoPolkabtc: chainPolkaBTC,
  rococoPolkaFoundry: nodePolkaFoundry,
  rococoPrism: nodePrism,
  rococoStatemint: nodeStatemine,
  rococoSubDAO: nodeSubDAO,
  rococoSubsocial: nodeSubsocial,
  rococoTick: chainRococoTick,
  rococoTrack: chainRococoTrack,
  rococoTrick: chainRococoTrick,
  rococoTrustBase: nodeTrustBase,
  rococoUnitv: nodeUnitv,
  rococoVln: nodeVln,
  rococoZeitgeist: nodeZeitgeist,
  rococoZenlink: nodeZenlink,
  sakura: nodeSakura,
  shadow: nodeShadow,
  shell: nodeShell,
  sherpax: nodeChainx,
  shibuya: chainShiden,
  shiden: chainShiden,
  snakenet: chainSnakenet,
  'sora-substrate': nodeSora,
  stafi: nodeStafi,
  statemine: nodeStatemine,
  statemint: nodeStatemine,
  subgame: nodeSubGame,
  'SubGame Gamma': nodeSubGame,
  'SubGame Staging': nodeSubGame,
  subsocial: nodeSubsocial,
  substrate: nodeSubstrate,
  'ternoa-chaos': nodeTernoa,
  uniarts: nodeUniarts,
  unique: nodeUnique,
  unitv: nodeUnitv,
  vln: nodeVln,
  web3games: nodeWeb3games,
  westend: nodeWestend,
  westlake: nodeWestlake,
  westmint: nodeStatemine,
  whala: nodeWhala,
  zCloak: nodeZCloak,
  zeitgeist: nodeZeitgeist,
  zero: nodeZero
};

// extension logos
export const extensionLogos: Record<string, unknown> = {
  'polkadot-js': extensionPolkadotJs
};

// external logos, i.e. for explorers
export const externalLogos: Record<string, unknown> = {
  commonwealth: externalCommonwealth,
  dotscanner: externalDotScanner,
  polkascan: externalPolkascan,
  polkassembly: externalPolkassembly,
  polkastats: externalPolkastats,
  subscan: externalSubscan
};

// empty logos
export const emptyLogos: Record<string, unknown> = {
  empty: emptyLogo
};

// preload all
[chainLogos, extensionLogos, externalLogos, namedLogos, nodeLogos, emptyLogos].forEach((imageSet): void => {
  Object.values(imageSet).forEach((src): void => {
    new Image().src = src as string;
  });
});

// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import acala from './acala';
import apron from './apron';
import aresParachain from './ares-parachain';
import beresheet from './beresheet';
import bifrost from './bifrost';
import bifrostAsgard from './bifrost-asgard';
import bifrostParachain from './bifrost-parachain';
import bitcountry from './bitcountry';
import bitcountryParachain from './bitcountry-rococo';
import canvas from './canvas';
import centrifugeChain from './centrifuge-chain';
import chainx from './chainx';
import clover from './clover';
import cloverRococo from './clover-rococo';
import crab from './crab';
import crownSterling from './crown-sterling';
import crust from './crust';
import testPara from './cumulus-test-parachain';
import darwinia from './darwinia';
import darwiniaParachain from './darwinia-parachain';
import datahighwayParachain from './datahighway';
import dockPoaMainnet from './dock-poa-mainnet';
import dockPoaTestnet from './dock-poa-testnet';
import dotmog from './dotmog';
import dusty from './dusty';
import eave from './eave';
import edgeware from './edgeware';
import encointerNodeNotee from './encointer-node-notee';
import encointerNodeTeeproxy from './encointer-node-teeproxy';
import encointerPara from './encointer-para';
import equilibrium from './equilibrium';
import fantour from './fantour';
import galital from './galital';
import galitalParachain from './galital-parachain';
import galois from './galois';
import gamepower from './gamepower';
import genshiro from './genshiro';
import hanonycash from './hanonycash';
import hydrate from './hydrate';
import idavoll from './idavoll';
import integritee from './integritee';
import ipse from './ipse';
import jupiter from './jupiter';
import jupiterRococo from './jupiter-rococo';
import kilt from './kilt';
import konomi from './konomi';
import kpron from './kpron';
import kulupu from './kulupu';
import kylin from './kylin';
import laminar from './laminar';
import litentry from './litentry';
import manta from './manta';
import moonbeam from './moonbeam';
import mybank from './mybank';
import neatcoin from './neatcoin';
import nftmart from './nftmart';
import nodle from './nodle';
import oakTestnet from './oak-testnet';
import opportunity from './opportunity';
import origintrail from './origintrail';
import pangolin from './pangolin';
import parami from './parami';
import phala from './phala';
import phalaParachain from './phala-parachain';
import phoenix from './phoenix';
import plasm from './plasm';
import plasmParachain from './plasm-parachain';
import polkabtc from './polkabtc';
import polkadex from './polkadex';
import polkafoundry from './polkafoundry';
import polymesh from './polymesh';
import pontem from './pontem';
import prism from './prism';
import realis from './realis';
import riochain from './riochain';
import robonomics from './robonomics';
import snowbridge from './snowbridge';
import soraSubstrate from './soraSubstrate';
import stafi from './stafi';
import subdao from './subdao';
import subgame from './subgame';
import subsocial from './subsocial';
import ternoa from './ternoa';
import trustbase from './trustbase';
import uart from './uart';
import unique from './unique';
import unitv from './unitv';
import vln from './vln';
import vlnrococo from './vln-rococo';
import vodka from './vodka';
import web3games from './web3games';
import westlake from './westlake';
import zCloak from './zCloak';
import zeitgeist from './zeitgeist';
import zenlink from './zenlink';
import zero from './zero';

// NOTE: The mapping is done from specName in state.getRuntimeVersion
const spec: Record<string, OverrideBundleDefinition> = {
  Crab: crab,
  Darwinia: darwinia,
  'Darwinia Crab PC2': darwiniaParachain,
  'Darwinia PC2': darwiniaParachain,
  Equilibrium: equilibrium,
  Genshiro: genshiro,
  Pangolin: pangolin,
  VLN: vln,
  'VLN-PC': vlnrococo,
  ...acala,
  apron,
  'ares-parachain': aresParachain,
  asgard: bifrostAsgard,
  basilisk: hydrate,
  beresheet,
  bifrost: bifrost,
  'bifrost-parachain': bifrostParachain,
  'bitcountry-node': bitcountry,
  'bitcountry-parachain': bitcountryParachain,
  'btc-parachain': polkabtc,
  canvas,
  'centrifuge-chain': centrifugeChain,
  chainx,
  'chainx-parachain': chainx,
  'crown-sterling': crownSterling,
  clover,
  'clover-rococo': cloverRococo,
  crust,
  'crust-parachain': crust,
  'cumulus-subsocial-parachain': subsocial,
  'cumulus-test-parachain': testPara,
  datahighway: westlake,
  'datahighway-parachain': datahighwayParachain,
  dawn: eave,
  'dev-parachain': zenlink,
  'dock-main-runtime': dockPoaMainnet,
  'dock-test-runtime': dockPoaTestnet,
  'dotmog-node': dotmog,
  dusty4: dusty,
  edgeware,
  'encointer-node-notee': encointerNodeNotee,
  'encointer-node-teeproxy': encointerNodeTeeproxy,
  'encointer-parachain': encointerPara,
  fantour,
  galital: galital,
  'galital-collator': galitalParachain,
  gamepower,
  'hack-hydra-dx': hydrate,
  halongbay: polkafoundry,
  hanonycash,
  'hydra-dx': hydrate,
  idavoll,
  'integritee-parachain': integritee,
  'ipse-node': ipse,
  'jupiter-prep': jupiter,
  'jupiter-rococo': jupiterRococo,
  khala: phalaParachain,
  'kilt-parachain': kilt,
  'kilt-spiritnet': kilt,
  konomi,
  kpron,
  kulupu,
  kylin,
  laminar,
  litentry,
  'manta-node': manta,
  'mashnet-node': kilt,
  'mathchain-galois': galois,
  moonbase: moonbeam,
  moonbeam,
  moonriver: moonbeam,
  moonshadow: moonbeam,
  'mybank.network Testnet': mybank,
  neatcoin,
  nft: unique,
  nftmart,
  'node-moonbeam': moonbeam,
  'node-polkadex': polkadex,
  'nodle-chain': nodle,
  'oak-testnet': oakTestnet,
  opportunity,
  'origintrail-parachain': origintrail,
  parami,
  'phala-collator': phalaParachain,
  'phala-node': phala,
  'phale-node': phala,
  'phoenix-node': phoenix,
  'phoenix-parachain': phoenix,
  plasm,
  'plasm-parachain': plasmParachain,
  polymesh,
  pontem,
  prism,
  realis,
  'riochain-runtime': riochain,
  robonomics,
  snowbridge,
  'sora-substrate': soraSubstrate,
  stafi,
  steam: eave,
  subdao,
  subgame,
  subsocial,
  subzero: zero,
  ternoa,
  trustbase,
  uart,
  'unit-node': unitv,
  'unit-parachain': unitv,
  vodka,
  'web3games-node': web3games,
  'zcloak-network': zCloak,
  zeitgeist: zeitgeist
};

export default spec;

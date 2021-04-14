// Copyright 2017-2020 @polkadot/app-custom-signature authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as ethUtils from 'ethereumjs-util';
import { publicKeyConvert } from 'secp256k1';

import { hexToU8a, isHex, u8aToHex } from '@polkadot/util';
import { blake2AsU8a, encodeAddress, isEthereumAddress } from '@polkadot/util-crypto';

/**
 * Converts ECDSA public key into a valid ss58 address for Substrate.
 * Note that this is different from the EVM-mapped Ethereum addresses.
 * @param publicKey a 33-byte compressed ECDSA public key in hex string
 * @param networkPrefix the ss58 format used to encode the resulting address
 */
export const ecdsaPubKeyToSs58 = (publicKey: string, networkPrefix?: number): string => {
  if (!isHex(publicKey)) {
    throw new Error('Public key is not 0x-prefixed');
  }

  if (hexToU8a(publicKey).length !== 33) {
    throw new Error(`Expected a 33 byte compressed public key, instead got ${publicKey}`);
  }

  const ss58PubKey = blake2AsU8a(hexToU8a(publicKey), 256);
  const ss58Address = encodeAddress(ss58PubKey, networkPrefix);

  return ss58Address;
};

/**
 * Recovers the compressed public key from an ECDSA signature signed by the `personal_sign` method.
 * @param address ethereum public address of the signer
 * @param msgString message string that was signed
 * @param rpcSig resulting signature in hex string
 */
export const recoverPublicKeyFromSig = (address: string, msgString: string, rpcSig: string): string => {
  // check if the message is hex encoded or not
  const encodingType = isHex(msgString) ? 'hex' : 'utf8';
  // message hashing is done here, which includes the message prefix
  const msgHash = ethUtils.hashPersonalMessage(Buffer.from(msgString, encodingType));

  const signature = ethUtils.fromRpcSig(rpcSig);

  if (!ethUtils.isValidSignature(signature.v, signature.r, signature.s)) {
    throw new Error('Invalid signature provided');
  }

  if (!isEthereumAddress(address)) {
    throw new Error('Invalid address provided');
  }

  const publicKey = ethUtils.ecrecover(msgHash, signature.v, signature.r, signature.s);
  const recoveredAddress = ethUtils.bufferToHex(ethUtils.pubToAddress(publicKey));

  if (recoveredAddress !== address) {
    throw new Error(`Expected ${address}, but recovered address is ${recoveredAddress}`);
  }

  // note: hex string from buffer is not 0x prefixed
  let prefixedPubKey = publicKey.toString('hex');

  // add a 04 prefix to the uncompressed public key if it hasn't been added
  if (publicKey.length === 64) {
    prefixedPubKey = '04' + prefixedPubKey;
  }

  // compress the public key
  const compressedKey = publicKeyConvert(Buffer.from(prefixedPubKey, 'hex'), true);

  return u8aToHex(compressedKey);
};

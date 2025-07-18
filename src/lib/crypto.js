import { ethers } from "ethers";
import { Keypair } from "@solana/web3.js";
import { Buffer } from "buffer";
import * as bip39 from "bip39";
import bs58 from "bs58";

if (typeof window !== "undefined" && !window.Buffer) {
  window.Buffer = Buffer;
}

export const generateMnemonic = () => {
  const wallet = ethers.Wallet.createRandom();
  return wallet.mnemonic.phrase;
};

export const deriveWallets = async (
  mnemonic,
  chain,
  count = 1,
  startIndex = 0
) => {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error("Invalid mnemonic phrase");
  }

  const wallets = [];
  const mnemonicInstance = ethers.Mnemonic.fromPhrase(mnemonic);

  for (let i = startIndex; i < startIndex + count; i++) {
    if (chain === "ethereum") {
      const path = `m/44'/60'/${i}'/0/0`;
      const wallet = ethers.HDNodeWallet.fromMnemonic(mnemonicInstance, path);
      wallets.push({
        id: `eth-${wallet.address.slice(-4)}-${i}`,
        publicKey: wallet.address,
        privateKey: wallet.privateKey,
        path,
      });
    } else {
      const path = `m/44'/501'/${i}'/0'`;
      const seed = mnemonicInstance.computeSeed();
      const derived = ethers.HDNodeWallet.fromSeed(seed).derivePath(path);
      const derivedPrivateKey = derived.privateKey.slice(2);
      const keypair = Keypair.fromSeed(Buffer.from(derivedPrivateKey, "hex"));
      wallets.push({
        id: `sol-${keypair.publicKey.toBase58().slice(-4)}-${i}`,
        publicKey: keypair.publicKey.toBase58(),
        privateKey: bs58.encode(keypair.secretKey),
        path,
      });
    }
  }

  return wallets;
};
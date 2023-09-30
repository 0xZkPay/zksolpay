import { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { sign } from '@noble/ed25519';
import { Elusiv, SEED_MESSAGE } from '@elusiv/sdk';

export const elusive_send = async (kp: Keypair, amount: number, recipient: PublicKey) => {
    const seed = await sign(
        Buffer.from(SEED_MESSAGE, 'utf-8'),
        kp.secretKey.slice(0, 32),
    );

    const elusiv = await Elusiv.getElusivInstance(seed, kp.publicKey, new Connection('https://api.devnet.solana.com'), 'devnet');
    const topupTxData = await elusiv.buildTopUpTx(amount - (0.01 * LAMPORTS_PER_SOL), 'LAMPORTS');
    topupTxData.tx.partialSign(kp);
    await elusiv.sendElusivTx(topupTxData);
    const sendTx = await elusiv.buildSendTx(amount - (0.01 * LAMPORTS_PER_SOL), recipient, 'LAMPORTS');
    await elusiv.sendElusivTx(sendTx);
}
import { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { sign } from '@noble/ed25519';
import { Elusiv, SEED_MESSAGE } from '@elusiv/sdk';
import { Vars } from './config';

export const elusive_send = async (kp: Keypair, amount: number, recipient: PublicKey) => {
    const seed = await sign(
        Buffer.from(SEED_MESSAGE, 'utf-8'),
        kp.secretKey.slice(0, 32),
    );

    const elusiv = await Elusiv.getElusivInstance(seed, kp.publicKey, new Connection('https://api.devnet.solana.com'), 'devnet');
    const topupTxData = await elusiv.buildTopUpTx((amount - (0.01 * LAMPORTS_PER_SOL)), 'LAMPORTS');
    topupTxData.tx.partialSign(kp);
    await elusiv.sendElusivTx(topupTxData);

    const percentage_of_fee = 0.5;

    let bal = amount - (0.05 * LAMPORTS_PER_SOL);
    let amount_to_send = bal - (bal / 100 * (percentage_of_fee))
    // console.log("sending to recipent", (amount_to_send) / LAMPORTS_PER_SOL);

    const sendToRecipentTx = await elusiv.buildSendTx((amount_to_send), recipient, 'LAMPORTS');
    await elusiv.sendElusivTx(sendToRecipentTx);
    amount_to_send = (bal / 100 * (percentage_of_fee))
    // console.log("sending to fee wallet", amount_to_send / LAMPORTS_PER_SOL);

    const sendFeeTx = await elusiv.buildSendTx((amount_to_send), new PublicKey(Vars.FEE_WALLET), 'LAMPORTS');
    await elusiv.sendElusivTx(sendFeeTx);

}

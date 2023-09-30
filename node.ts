// We sign using an external library here because there is no wallet connected. Usually you'd use the solana wallet adapter instead.
import { sign } from '@noble/ed25519';
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { Elusiv, SEED_MESSAGE } from '@elusiv/sdk';
import bs58 from 'bs58';
const SOLANA_KEY = process.env.SOLANA_KEY
if (!SOLANA_KEY) {
    console.error("SOLANA_KEY is empty or undefined");
    process.exit(1)
}
const SOLANA_KEY_ARRAY = JSON.parse(Buffer.from(SOLANA_KEY, "base64").toString()) as number[]
const priv_key = bs58.encode(SOLANA_KEY_ARRAY)
// console.log("priv key", priv_key);

const userKp = Keypair.fromSecretKey(Uint8Array.from(SOLANA_KEY_ARRAY));


const lab = async () => {
    // Generate the input seed. Remember, this is almost as important as the private key, so don't log this!
    // (Slice because in Solana's keypair type the first 32 bytes is the privkey and the last 32 is the pubkey)

    console.log("Creating seed");
    const seed = await sign(
        Buffer.from(SEED_MESSAGE, 'utf-8'),
        userKp.secretKey.slice(0, 32),
    );


    console.log("Creating elusiv instance");
    // Create the elusiv instance
    const elusiv = await Elusiv.getElusivInstance(seed, userKp.publicKey, new Connection('https://api.devnet.solana.com'), 'devnet');
    console.log("Create:Topping up");
    // Top up our private balance with 1 SOL (= 1_000_000_000 Lamports)
    const topupTxData = await elusiv.buildTopUpTx(10 * LAMPORTS_PER_SOL, 'LAMPORTS');
    // Sign it (only needed for topups, as we're topping up from our public key there)
    topupTxData.tx.partialSign(userKp);
    // Send it off

    console.log("Send:Topping up");
    const topupSig = await elusiv.sendElusivTx(topupTxData);

    console.log("Create:Half Sol");
    // Send half a SOL, privately 😎
    const recipient = new PublicKey("4bF1PRfE7aXgT7t2AmjyxWGvpwgk4kJF19KVLLmc5dNp");

    const sendTx = await elusiv.buildSendTx(2.2 * LAMPORTS_PER_SOL, recipient, 'LAMPORTS');
    // No need to sign as we prove ownership of the private funds using a zero knowledge proof

    console.log("Send:Half Sol");
    const sendSig = await elusiv.sendElusivTx(sendTx);

    console.log(`Performed topup with sig ${topupSig.signature} and send with sig ${sendSig.signature}`);
}

lab();
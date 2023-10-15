
import { RequestHandler } from 'express';
import bs58 from 'bs58';

import { Keypair } from "@solana/web3.js"
import { Payment } from '../../db/models/Payment';
import { Merchant } from '../../db/models/Merchant';
import { ApiResponse } from '../type';
import { Vars } from '../../lib/config';

type PostPayment = {
    amount_lamport: number,
    product_id: string,
    product_name: string
}

export const post_payment: RequestHandler = async (_req, _res) => {
    const body: PostPayment = _req.body;

    const api_key: string = _req.headers.api_key as string;
    const merchant = await Merchant.findOne({
        where: {
            api_key: api_key
        }
    })

    if (merchant) {
        const new_wallet = Keypair.generate();
        const wallet_addr = new_wallet.publicKey.toBase58()
        const wallet_key = bs58.encode(new_wallet.secretKey)
        try {
            await Payment.create({ merchant_id: merchant.id, receiving_addr: wallet_addr, receiving_priv_key: wallet_key, amount: body.amount_lamport, status: "pending", product_id: body.product_id, product_name: body.product_name })
        } catch (error) {
            _res.send(ApiResponse.eP("failed to create payment", { error }));
            return
        }
        _res.send(ApiResponse.s("receiving address generated", { addr: wallet_addr }));

        setTimeout(async () => {
            await Payment.update({ status: "cancelled" }, { where: { receiving_addr: wallet_addr, status: "pending" } })
        }, 1000 * 60 * +Vars.ORDER_EXPIRATION_DURATION);
    }

}


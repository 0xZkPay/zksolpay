
import { RequestHandler } from 'express';
import bs58 from 'bs58';

import { Keypair } from "@solana/web3.js"
import { Payment } from '../db/models/Payment';
import { AppUser } from '../db/models/User';
import { ApiResponse } from './type';

type PostPayment = {
    amount_lamport: number
}

export const payment: RequestHandler = async (_req, _res) => {
    const body: PostPayment = _req.body;

    const api_key: string = _req.headers.api_key as string;
    const app_user = await AppUser.findOne({
        where: {
            apiKey: api_key
        }
    })

    if (app_user) {
        const new_wallet = Keypair.generate();
        const wallet_addr = new_wallet.publicKey.toBase58()
        const wallet_key = bs58.encode(new_wallet.secretKey)

        await Payment.create({ owner: app_user.addr, pAddr: wallet_addr, privKey: wallet_key, amount: body.amount_lamport, status: "pending" })
        _res.send(ApiResponse.s("receiving address generated", { addr: wallet_addr }));
    }

}
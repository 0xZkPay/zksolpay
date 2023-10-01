
import { RequestHandler } from 'express';
import bs58 from 'bs58';

import sol, { Keypair, PublicKey } from "@solana/web3.js"
import { Payment } from '../../db/models/Payment';
import { AppUser } from '../../db/models/User';
import { ApiResponse } from '../type';
import { elusive_send } from '../../lib/elusiv';


type PostPaymentUpdate = {
    addr: string
}


export const payment_update: RequestHandler = async (_req, _res) => {
    const endpoint = 'https://api.devnet.solana.com';
    const solanaConnection = new sol.Connection(endpoint);

    const body: PostPaymentUpdate = _req.body;
    const api_key: string = _req.headers.api_key as string;
    const app_user = await AppUser.findOne({
        where: {
            api_key: api_key
        }
    })

    if (!app_user) {
        _res.send(ApiResponse.e("api key is invalid"))
        return
    }
    const payment_data = await Payment.findOne({ where: { receiving_addr: body.addr, owner: app_user.addr } })
    if (!payment_data) {
        _res.send(ApiResponse.e("payment address is invalid"))
        return
    }

    if (payment_data && payment_data.status == "success") {
        _res.send(ApiResponse.s("payment successfull"))
        return
    }

    const pubKey = new sol.PublicKey(payment_data.receiving_addr);

    let transactionList = await solanaConnection.getSignaturesForAddress(pubKey, { limit: 1 });
    if (transactionList.length == 0) {
        _res.send(ApiResponse.s("payment pending"));
        return;
    }
    try {
        const txn = await solanaConnection.getParsedTransaction(transactionList[0].signature, { maxSupportedTransactionVersion: 0 })

        const accounts_keys = txn?.transaction.message.accountKeys
        if (accounts_keys) {
            for (let i = 0; i < accounts_keys.length; i++) {
                const ak = accounts_keys[i];

                if (ak.pubkey.toBase58() === payment_data.receiving_addr) {
                    const pre = txn?.meta?.preBalances[i]
                    const post = txn?.meta?.postBalances[i]

                    // Sometimes the amount is greater by few decimals like 2.200000000000003 instead of 2.2
                    if (pre != null && post != null && (post - pre) >= payment_data.amount) {
                        await Payment.update({ status: "success" }, { where: { receiving_addr: body.addr } })
                        const priv_seed = bs58.decode(payment_data.receiving_priv_key)
                        elusive_send(Keypair.fromSecretKey(priv_seed), payment_data.amount, new PublicKey(app_user.addr))
                        _res.send(ApiResponse.s("payment successfull"))
                        return
                    }
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
    _res.send(ApiResponse.s("payment pending"))

}
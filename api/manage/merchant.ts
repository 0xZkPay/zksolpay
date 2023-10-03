
import { RequestHandler } from 'express';
import crypto from "crypto";
import { ApiResponse } from '../type';
import { AppUser } from '../../db/models/User';
import { USER_ADDR_LOCAL } from '../middleware/paseto';
import { Merchant } from '../../db/models/Merchant';

type PostMerchant = {
    name: string,
    type: string,
    payout_address: string,
    domain: string
}

export const merchant_post_handler: RequestHandler = async (_req, _res) => {
    const user_addr = _res.locals[USER_ADDR_LOCAL] as string;

    const body: PostMerchant = _req.body;
    try {
        const apiKey = "pay_api_" + crypto.randomUUID();
        const id = "merchant_" + crypto.randomUUID();
        await Merchant.create({
            id,
            api_key: apiKey,
            name: body.name,
            type: body.type,
            payout_addr: body.payout_address,
            domain: body.domain,
            user_addr: user_addr
        })
        _res.send(ApiResponse.s("merchant created", { apiKey, merchantId: id }))
    } catch (error) {
        console.log(error);
        _res.status(500).send(ApiResponse.e("internal server error"))
    }
}

export const merchant_get_handler: RequestHandler = async (_req, _res) => {
    const user_addr = _res.locals[USER_ADDR_LOCAL] as string;
    const id = _req.query.id as string | undefined;
    try {
        let where: any = { user_addr: user_addr };
        if (id) where.id = id
        const merchants = await Merchant.findAll({
            where
        })

        if (!merchants && !id) {
            _res.status(400).send(ApiResponse.e("merchant with specified id doesn't exist for user"))
            return;
        }
        _res.send(ApiResponse.s("merchants fetched", { merchants }))
    } catch (error) {
        console.log(error);
        _res.status(500).send(ApiResponse.e("internal server error"))
    }
}

type PatchMerchant = {
    id: string,
    name: string,
    type: string,
    payout_address: string,
    domain: string
}

export const merchant_patch_handler: RequestHandler = async (_req, _res) => {
    const user_addr = _res.locals[USER_ADDR_LOCAL] as string;
    const body: PatchMerchant = _req.body;
    try {

        const update_params = {
            name: body.name, type: body.type, payout_address: body.payout_address, domain: body.domain
        };
        await Merchant.update(update_params, {
            where: {
                id: body.id,
                user_addr: user_addr
            }
        })

        _res.send(ApiResponse.s("merchant updated"))
    } catch (error) {
        console.log(error);
        _res.status(500).send(ApiResponse.e("internal server error"))
    }
}


import { RequestHandler } from 'express';
import crypto from "crypto";
import { ApiResponse } from '../type';
import { AppUser } from '../../db/models/User';
import { USER_ADDR_LOCAL } from '../middleware/paseto';
import { Merchant } from '../../db/models/Merchant';

type PostApiKey = {
    id: string;
}

export const api_key_handler: RequestHandler = async (_req, _res) => {
    const body: PostApiKey = _req.body;
    const user_addr = _res.locals[USER_ADDR_LOCAL] as string;
    try {
        const apiKey = "pay_api_" + crypto.randomUUID();
        await Merchant.update({ api_key: apiKey }, { where: { user_addr: user_addr, id: body.id } })
        _res.send(ApiResponse.s("api key generated", { apiKey }))
    } catch (error) {
        console.log(error);
        _res.status(500).send(ApiResponse.e("internal server error"))
    }
}

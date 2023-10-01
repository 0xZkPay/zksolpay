
import { RequestHandler } from 'express';
import crypto from "crypto";
import { ApiResponse } from '../type';
import { AppUser } from '../../db/models/User';
import { USER_ADDR_LOCAL } from '../middleware/paseto';


export const api_key_handler: RequestHandler = async (_req, _res) => {
    const user_addr = _res.locals[USER_ADDR_LOCAL] as string;
    try {
        const apiKey = "pay_api_" + crypto.randomUUID();
        await AppUser.update({ api_key: apiKey }, { where: { addr: user_addr } })
        _res.send(ApiResponse.s("api key generated", { apiKey }))
    } catch (error) {
        console.log(error);
        _res.status(500).send(ApiResponse.e("internal server error"))
    }
}

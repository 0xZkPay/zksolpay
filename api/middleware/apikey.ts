import { RequestHandler } from "express"
import { ApiResponse } from "../type"
import { AppUser } from "../../db/models/User"
import { Merchant } from "../../db/models/Merchant"

const handler: RequestHandler = async (_req, _res, _next) => {
    const api_key = _req.headers.api_key
    if (!api_key) {
        _res.status(400).send(ApiResponse.e("api_key header is required and should be non empty"))
        return;
    }
    const app_user = await Merchant.findOne({ where: { api_key: api_key } })
    if (!app_user) {
        _res.status(400).send(ApiResponse.e("invalid api key"))
        return;
    }
    _next();
}

export const api_key_middleware = () => handler;
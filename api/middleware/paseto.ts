import Paseto from "../../lib/paseto"
import { RequestHandler } from "express"
import { ApiResponse } from "../type"
import { AppUser } from "../../db/models/User"

const handler: RequestHandler = async (_req, _res, _next) => {
    const auth_token = _req.headers.authorization
    if (!auth_token) {
        _res.status(400).send(ApiResponse.e("authorization header is required and should be non empty"))
        return;
    }
    const addr = await Paseto.get_payload<string>(auth_token);
    const app_user = await AppUser.findOne({ where: { addr } })
    if (!app_user) {
        _res.status(400).send(ApiResponse.e("user not found"))
        return;
    }
    _next();
}

export const paseto_middleware = () => handler;

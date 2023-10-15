import Paseto from "../../lib/paseto"
import { RequestHandler } from "express"
import { ApiResponse } from "../type"
import { AppUser } from "../../db/models/User"

export const USER_ADDR_LOCAL = "USER_ADDR";

const handler: RequestHandler = async (_req, _res, _next) => {
    let auth_token = _req.headers.authorization
    if (!auth_token) {
        _res.status(400).send(ApiResponse.e("authorization header is required and should be non empty"))
        return;
    }

    auth_token = auth_token.split(" ")[1];

    try {
        const addr = await Paseto.get_addr(auth_token);
        const app_user = await AppUser.findOne({ where: { addr: addr } })
        if (!app_user) {
            _res.status(400).send(ApiResponse.e("user not found"))
            return;
        }
        _res.locals[USER_ADDR_LOCAL] = app_user.addr;
        _next();
    } catch (error) {

        if (error == Paseto.ERR_TOKEN_EXPIRED)
            _res.status(401).send(ApiResponse.e("token expired"))
        else {
            console.log(error);
            _res.status(500).send(ApiResponse.e("internal server error"))
        }
    }
}

export const paseto_middleware = () => handler;

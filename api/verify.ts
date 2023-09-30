
import { Op, QueryTypes } from 'sequelize';
import { Flow } from '../db/models/Flow';
import { RequestHandler } from 'express';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import Paseto from '../lib/paseto';
import { ApiResponse } from './type';
import { Vars } from '../lib/config';
import { AppUser } from '../db/models/User';

type PostVerifyRequest = {
    flowid: string,
    public_key: string,
    signature: string
}

export const verify_handler: RequestHandler = async (_req, _res) => {
    const body: PostVerifyRequest = _req.body;

    const flow = await Flow.findOne({
        where: {
            flowId: body.flowid,
            userAddr: body.public_key,
            createdAt: {
                [Op.gt]: new Date((new Date().getTime()) - 10 * 60 * 1000)
            }
        },
    });

    if (!flow) {
        _res.status(400).send(ApiResponse.e("flowid is not valid"))
        return
    }

    const message = body.flowid + Vars.EULA;
    const verified = nacl
        .sign
        .detached
        .verify(
            new TextEncoder().encode(message),
            bs58.decode(body.signature),
            bs58.decode(body.public_key)
        )

    if (!verified) {
        _res.status(400).send(ApiResponse.e("signature is not valid"))
        return
    }
    await Flow.destroy({
        where: {
            flowId: body.flowid,
        },
    });
    const paseto = await Paseto.sign(body.public_key)

    const app_user = await AppUser.findOne({ where: { addr: body.public_key } }) as AppUser
    _res.send(ApiResponse.s("paseto generated", { paseto_token: paseto, api_key: app_user?.apiKey }));
}
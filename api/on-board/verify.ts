
import { Op } from 'sequelize';
import { RequestHandler } from 'express';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { Flow } from '../../db/models/Flow';
import { AppUser } from '../../db/models/User';
import { Vars } from '../../lib/config';
import Paseto from '../../lib/paseto';
import { ApiResponse } from '../type';


type PostVerifyRequest = {
    flowid: string,
    public_key: string,
    signature: string,
    name: string,
    city: string
}

export const verify_handler: RequestHandler = async (_req, _res) => {
    const body: PostVerifyRequest = _req.body;
    let signature_base58: Uint8Array;
    try {
        signature_base58 = bs58.decode(body.signature);
    } catch (error) {
        _res.status(500).send(ApiResponse.eP("failed to decode base58 signature", error))
        return;
    }
    const flow = await Flow.findOne({
        where: {
            flow_id: body.flowid,
            user_addr: body.public_key,
            created_at: {
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
            signature_base58,
            bs58.decode(flow.user_addr)
        )

    if (!verified) {
        _res.status(400).send(ApiResponse.e("signature is not valid"))
        return
    }
    await Flow.destroy({
        where: {
            flow_id: body.flowid,
        },
    });

    await AppUser.update({ city: body.city, name: body.name }, { where: { addr: flow.user_addr } })
    const paseto = await Paseto.sign(body.public_key)
    _res.send(ApiResponse.s("paseto generated", { paseto_token: paseto }));
}
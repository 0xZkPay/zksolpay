
import { sequelize } from '../../db/sequize';
import { QueryTypes } from 'sequelize';
import { Flow } from '../../db/models/Flow';
import { PublicKey, Keypair } from '@solana/web3.js';
import { RequestHandler } from 'express';
import crypto from "crypto";
import bs58 from 'bs58';
import { ApiResponse } from '../type';
import { Vars } from '../../lib/config';

type PostFlowIdRequest = {
    addr: string
}


export const flow_id_handler: RequestHandler = async (_req, _res) => {
    const body: PostFlowIdRequest = _req.body;
    try {
        const is_on_curve = PublicKey.isOnCurve(body.addr)
        if (!is_on_curve) {
            throw new Error("not on curve");
        }
    } catch (error) {
        _res.status(400).send(ApiResponse.e("wallet address is not valid"))
        return;
    }
    try {
        await sequelize.query(
            `INSERT INTO app_users (addr,created_at,updated_at)
                            VALUES(?,CURRENT_DATE,CURRENT_DATE) 
                         ON CONFLICT (addr) DO NOTHING;
                `,
            {
                replacements: [body.addr],
                type: QueryTypes.INSERT
            }
        );
        const flow_id = crypto.randomUUID();
        await Flow.create({ flow_id: flow_id, user_addr: body.addr })
        _res.send(ApiResponse.s("flow id generated", { flowId: flow_id, eula: Vars.EULA }))
    } catch (error) {
        console.log(error);
        _res.status(500).send(ApiResponse.e("internal server error"))
    }
}

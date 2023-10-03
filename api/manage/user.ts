
import { RequestHandler } from 'express';
import { ApiResponse } from '../type';
import { AppUser } from '../../db/models/User';
import { USER_ADDR_LOCAL } from '../middleware/paseto';

export const user_get_handler: RequestHandler = async (_req, _res) => {
    const user_addr = _res.locals[USER_ADDR_LOCAL] as string;
    try {
        const user = await AppUser.findOne({
            where: {
                addr: user_addr
            }
        })

        _res.send(ApiResponse.s("user fetched", { user }))
    } catch (error) {
        console.log(error);
        _res.status(500).send(ApiResponse.e("internal server error"))
    }
}

type PatchUser = {
    name: string,
    city: string,
}

export const user_patch_handler: RequestHandler = async (_req, _res) => {
    const user_addr = _res.locals[USER_ADDR_LOCAL] as string;
    const body: PatchUser = _req.body;
    try {

        const update_params = {
            name: body.name, city: body.city,
        };
        await AppUser.update(update_params, {
            where: {
                addr: user_addr
            }
        })

        _res.send(ApiResponse.s("user updated"))
    } catch (error) {
        console.log(error);
        _res.status(500).send(ApiResponse.e("internal server error"))
    }
}

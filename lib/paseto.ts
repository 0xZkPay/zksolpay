import { V4 } from "paseto"
import { KeyObject } from "crypto"
import bs58 from "bs58";
import { Vars } from "./config";

namespace Paseto {
    export const ERR_TOKEN_EXPIRED = new Error("token expired");

    let key: KeyObject;
    export const init = async () => {
        if (!Vars.PASETO_PV_KEY) {
            throw new Error("PASETO_PV_KEY required")
        }
        key = V4.bytesToKeyObject(Buffer.from(bs58.decode(Vars.PASETO_PV_KEY)))
        // key = await V4.generateKey("public");
        // console.log(bs58.encode(V4.keyObjectToBytes(key)));
    }

    type Payload = {
        addr: string,
        expiry: number
    }

    export const sign = async (addr: string) => {
        const days = 15;
        const date_now = new Date();
        const expiry = Math.floor(date_now.getTime() / 1000) + (60 * 60 * 24 * days)
        return V4.sign({ subarray: { addr, expiry } }, key)
    }
    export const get_addr = async (token: string): Promise<string> => {
        const payload = await V4.verify(token, key) as { subarray: Payload }
        const date_now = new Date();
        const time_now = Math.ceil(date_now.getTime() / 1000)
        if (payload.subarray.expiry > time_now)
            return payload.subarray.addr
        else
            throw ERR_TOKEN_EXPIRED;

    }

}


export default Paseto;
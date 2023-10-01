import { V4 } from "paseto"
import { KeyObject } from "crypto"
import bs58 from "bs58";
import { Vars } from "./config";

namespace Paseto {
    let key: KeyObject;
    export const init = async () => {
        if (!Vars.PASETO_PV_KEY) {
            throw new Error("PASETO_PV_KEY required")
        }
        key = V4.bytesToKeyObject(Buffer.from(bs58.decode(Vars.PASETO_PV_KEY)))
        // key = await V4.generateKey("public");
        // console.log(bs58.encode(V4.keyObjectToBytes(key)));
    }

    export const sign = async (addr: string) => {
        return V4.sign({ subarray: addr }, key)
    }
    export const get_payload = async <T>(token: string) => {
        return await V4.verify(token, key) as { subarray: T }
    }

}


export default Paseto;
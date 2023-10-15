import dotenv from "dotenv";
dotenv.config();
import { AppUser } from "../db/models/User";
import { Flow } from "../db/models/Flow";
import { Payment } from "../db/models/Payment";
import { Merchant } from "../db/models/Merchant";



const sync = async () => {
    await AppUser.sync()
    await Flow.sync()
    await Merchant.sync()
    await Payment.sync()
    console.log("All models were synchronized successfully.");
}

sync();
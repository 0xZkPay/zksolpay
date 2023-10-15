import { RequestHandler } from "express";
import { Merchant } from "../../db/models/Merchant";
import { Payment } from "../../db/models/Payment";
import { USER_ADDR_LOCAL } from "../middleware/paseto";
import { ApiResponse } from "../type";

export const get_payments: RequestHandler = async (_req, _res) => {
    const merchant_id = _req.query.id as string | undefined;


    if (!merchant_id) {
        _res.send(ApiResponse.e("id is required"));
        return
    }
    const payments = await Payment.findAll({
        where: {
            merchant_id: merchant_id
        }
    })

    if (payments) {
        const _payments: Partial<Payment>[] = payments.map(e => {
            return {
                receiving_addr: e.receiving_addr, amount: e.amount, status: e.status, created_at: e.created_at, product_id: e.product_id, product_name: e.product_name
            }
        })
        _res.send(ApiResponse.s("payments fetched", { payments: _payments }));
    }
}
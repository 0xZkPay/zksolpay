import dotenv from "dotenv"
dotenv.config();
import express from 'express';
import { sequelize } from './db/sequize';
import { flow_id_handler } from './api/on-board/flowid';
import { verify_handler } from './api/on-board/verify';
import Paseto from "./lib/paseto";
import { post_payment } from "./api/core/payment";
import { payment_update } from "./api/core/payment_update";
import { ApiResponse } from "./api/type";
import { api_key_middleware } from "./api/middleware/apikey";
import { api_key_handler } from "./api/manage/api_key";
import { paseto_middleware } from "./api/middleware/paseto";
import { get_payments } from "./api/manage/get_payments";
import { user_get_handler, user_patch_handler } from "./api/manage/user";
import { merchant_get_handler, merchant_patch_handler, merchant_post_handler } from "./api/manage/merchant";

const app: express.Application = express();

app.use(express.json());
const port: number = 3000;

app.get('/', (_req, _res) => {
    _res.send(ApiResponse.s("Server OK"));
});

app.post('/onboard/flowid', flow_id_handler);
app.post('/onboard/verify', verify_handler);

app.use("/core", api_key_middleware());
app.post('/core/payment', post_payment);
app.post('/core/update-payment', payment_update);

app.use("/manage", paseto_middleware());
app.get('/manage/user', user_get_handler);
app.patch('/manage/user', user_patch_handler);
app.post('/manage/merchant', merchant_post_handler);
app.patch('/manage/merchant', merchant_patch_handler);
app.get('/manage/merchant', merchant_get_handler);


app.post('/manage/api-key', api_key_handler);
app.get('/manage/payments', get_payments);

const start = async () => {
    await Paseto.init();
    app.listen(port, () => {
        console.log(`TypeScript with Express
            http://localhost:${port}/`);
    });
}

start();
import dotenv from "dotenv"
dotenv.config();
import express from 'express';
import { sequelize } from './db/sequize';
import { flow_id_handler } from './api/flowid';
import { verify_handler } from './api/verify';
import Paseto from "./lib/paseto";
import { payment } from "./api/payment";
import { payment_update } from "./api/payment_update";
import { ApiResponse } from "./api/type";

const app: express.Application = express();

app.use(express.json());
const port: number = 3000;

app.get('/', (_req, _res) => {
    _res.send(ApiResponse.s("Server OK"));
});

app.post('/flowid', flow_id_handler);
app.post('/verify', verify_handler);
app.post('/new-payment', payment);
app.post('/update-payment', payment_update);


const start = async () => {
    await Paseto.init();
    console.log("All models were synchronized successfully.");
    app.listen(port, () => {
        console.log(`TypeScript with Express
            http://localhost:${port}/`);
    });
}

start();
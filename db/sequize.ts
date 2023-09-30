import { Sequelize } from "sequelize";
import { Vars } from "../lib/config";

const { PORT, HOSTNAME, PASSWORD, USER, DB_NAME } = Vars.DB;
const postgres_uri = `postgres://${USER}:${PASSWORD}@${HOSTNAME}:${PORT}/${DB_NAME}`

export const sequelize = new Sequelize(postgres_uri);

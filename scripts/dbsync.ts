import { sequelize } from "../db/sequize";

sequelize.sync({ force: true }).catch(e => {
    console.log("failed to sync", e);
});

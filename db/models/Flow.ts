import { AppUser } from "./User";

import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../sequize";
export class Flow extends Model<InferAttributes<Flow>, InferCreationAttributes<Flow>> {
    declare user_addr: string;
    declare flow_id: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

Flow.init({
    user_addr: {
        type: DataTypes.STRING,
        references: {
            model: AppUser,
            key: 'addr',
        },
        primaryKey: true
    },
    flow_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
}, { sequelize, tableName: 'flows', underscored: true })


import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../sequize";
import { AppUser } from "./User";


export class Merchant extends Model<InferAttributes<Merchant>, InferCreationAttributes<Merchant>> {
    declare name: string;
    declare type: string;
    declare payout_addr: string;
    declare domain: string;
    declare api_key: string;
    declare user_addr: string;
    declare id: string;
}


Merchant.init({
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    payout_addr: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    domain: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    api_key: {
        type: DataTypes.STRING,
        unique: true
    },
    user_addr: {
        type: DataTypes.STRING,
        references: { model: AppUser, key: "addr" },
    }
}, {
    sequelize, tableName: "merchants", underscored: true
});

import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../sequize";
import { Merchant } from "./Merchant";

export class Payment extends Model<InferAttributes<Payment>, InferCreationAttributes<Payment>> {
    declare receiving_addr: string;
    declare receiving_priv_key: string;
    declare merchant_id: string;
    declare amount: number;
    declare status: string;
    declare product_id: string;
    declare product_name: string;
    declare created_at?: CreationOptional<Date>;
    declare tx_hash: CreationOptional<string>;
}

Payment.init({
    receiving_addr: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    receiving_priv_key: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    merchant_id: {
        type: DataTypes.STRING,
        references: {
            model: Merchant,
            key: 'id',
        },
    },
    amount: {
        type: DataTypes.INTEGER,
    },
    status: {
        type: DataTypes.STRING,
    },
    product_id: { type: DataTypes.STRING, allowNull: false },
    product_name: { type: DataTypes.STRING, allowNull: false },
    tx_hash: {
        type: DataTypes.STRING,
    },
}, {
    sequelize, tableName: 'payments', underscored: true
});

import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../sequize";
import { AppUser } from "./User";

export class Payment extends Model<InferAttributes<Payment>, InferCreationAttributes<Payment>> {
    declare receiving_addr: string;
    declare receiving_priv_key: string;
    declare owner: string;
    declare amount: number;
    declare status: string;
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
    owner: {
        type: DataTypes.STRING,
        references: {
            model: AppUser,
            key: 'addr',
        },
        primaryKey: true,
    },
    amount: {
        type: DataTypes.INTEGER,
    },
    status: {
        type: DataTypes.STRING,
    }
}, {
    sequelize, tableName: 'payments', underscored: true
});

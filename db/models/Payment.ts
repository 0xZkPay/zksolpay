import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../sequize";
import { AppUser } from "./User";

export class Payment extends Model<InferAttributes<Payment>, InferCreationAttributes<Payment>> {
    declare pAddr: string;
    declare privKey: string;
    declare owner: string;
    declare amount: number;
    declare status: string;
}

Payment.init({
    pAddr: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    privKey: {
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
    sequelize, tableName: 'payments'
});

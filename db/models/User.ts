import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../sequize";


export class AppUser extends Model<InferAttributes<AppUser>, InferCreationAttributes<AppUser>> {
    declare addr: string;
    declare walletKey: string;
    declare walletAddr: string;
    declare apiKey: string;
}


AppUser.init({
    addr: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    walletKey: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    walletAddr: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apiKey: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize, tableName: "app_users"
});

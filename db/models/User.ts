import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../sequize";


export class AppUser extends Model<InferAttributes<AppUser>, InferCreationAttributes<AppUser>> {
    declare addr: string;
    declare wallet_key: string;
    declare wallet_addr: string;
    declare api_key: string;
}


AppUser.init({
    addr: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    wallet_key: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    wallet_addr: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    api_key: {
        type: DataTypes.STRING,
        unique: true
    }
}, {
    sequelize, tableName: "app_users", underscored: true
});

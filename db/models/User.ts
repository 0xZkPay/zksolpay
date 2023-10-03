import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../sequize";

export class AppUser extends Model<InferAttributes<AppUser>, InferCreationAttributes<AppUser>> {
    declare name: string;
    declare city: string;
    declare addr: string;
}

AppUser.init({
    addr: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    city: {
        type: DataTypes.STRING,
    },

}, {
    sequelize, tableName: "app_users", underscored: true
});

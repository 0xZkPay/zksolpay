import { AppUser } from "./User";

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequize";
class FlowT extends Model { }

export const Flow = sequelize.define<FlowT>('flows', {
    userAddr: {
        type: DataTypes.STRING,
        references: {
            model: AppUser,
            key: 'addr',
        },
        primaryKey: true
    },
    flowId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    }
});

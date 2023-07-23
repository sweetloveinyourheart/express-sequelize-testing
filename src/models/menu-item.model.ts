import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize';
import sequelize from '../database/connection';
import { Restaurant } from './restaurant.model';

export class MenuItem extends Model<InferAttributes<MenuItem>, InferCreationAttributes<MenuItem>> {
    declare id: CreationOptional<number>
    declare restaurant_id: ForeignKey<Restaurant['id']>
    declare name: string
    declare description: string
    declare price: number
    declare restaurant: NonAttribute<Restaurant>
}

MenuItem.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'MenuItem' // We need to choose the model name
});

// MenuItem.belongsTo(Restaurant, {
//     targetKey: 'id',
//     foreignKey: 'restaurant_id',
//     as: 'restaurant'
// })
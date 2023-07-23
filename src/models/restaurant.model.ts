import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize';
import sequelize from '../database/connection';
import { MenuItem } from './menu-item.model';
import { Order } from './order.model';

export enum CuisineType {
    VietnamFood = "Vietnam Food",
    ItalianFood = 'Italian Food',
    SeaFood = "Sea Food",
    BBQ = "BBQ"
}

export class Restaurant extends Model<InferAttributes<Restaurant>, InferCreationAttributes<Restaurant>> {
    declare id: CreationOptional<number>
    declare name: string
    declare cuisine_type: CuisineType
    declare address: string
    declare phone_number: string
    declare opening_hours: string
    declare menu_items: NonAttribute<MenuItem[]>
    declare orders: NonAttribute<Order[]>
}

Restaurant.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cuisine_type: {
        type: DataTypes.ENUM,
        values: Object.values(CuisineType),
        allowNull: false
    },
    opening_hours: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Restaurant' // We need to choose the model name
});

Restaurant.hasMany(MenuItem, {
    sourceKey: 'id',
    foreignKey: 'restaurant_id',
    as: 'menu_items'
})
Restaurant.hasMany(Order, {
    sourceKey: 'id',
    foreignKey: 'restaurant_id',
    as: 'orders'
})
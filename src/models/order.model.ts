import { DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize';
import sequelize from '../database/connection';
import { Restaurant } from './restaurant.model';
import { User } from './user.model';

enum DeliveryStatus {
    Pending = 'pending',
    Preparing = 'preparing',
    Delivered = 'delivered'
}

export class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
    declare id: number
    declare order_date: Date
    declare delivery_address: string
    declare delivery_status: DeliveryStatus
    declare total_amount: number

    declare restaurant_id: ForeignKey<Restaurant['id']>
    declare user_id: ForeignKey<User['id']>
    declare restaurant: NonAttribute<Restaurant>
    declare user: NonAttribute<User>
}

Order.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    order_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    delivery_address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    delivery_status: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: Object.values(DeliveryStatus)
    },
    total_amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Order' // We need to choose the model name
});

// Order.belongsTo(User, {
//     foreignKey: 'user_id',
//     targetKey: 'id',
//     as: 'user'
// })

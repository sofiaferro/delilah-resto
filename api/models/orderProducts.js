

module.exports = (sequelize, type) => {
    const OrderProducts = sequelize.define('orderProducts', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        productId: {
            type: type.INTEGER,
            allowNull: false,
            foreignKey: true
        },
        quantity: {
            type: type.INTEGER,
            allowNull: false,
            validate: {
                notNull: {
                    msg: '¡Este campo no puede estar vacío!'
                },
                notEmpty: {
                    msg: '¡Este campo no puede estar vacío!'
                }
            }
        },
        orderId: {
            type: type.INTEGER,
            foreignKey: true,
            allowNull: false
        }
    });
return OrderProducts

};
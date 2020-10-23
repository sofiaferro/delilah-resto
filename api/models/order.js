

module.exports = (sequelize, type) => {
    const Order = sequelize.define('order', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        status: {
            type: type.ENUM('Nuevo',
                'Confirmado',
                'Preparando',
                'Enviando',
                'Entregado',
                'Cancelado'),
            defaultValue: 'Nuevo',
        },
        paymentMethod: {
            type: type.ENUM('Efectivo',
                'Tarjeta de crédito',
                'Tarjeta de débito',
                'Mercado Pago'),
            defaultValue: 'Efectivo',
        },
        totalPrice: {
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
        userId: {
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
        }
    });

    return Order

};
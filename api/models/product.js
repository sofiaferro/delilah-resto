

module.exports = (sequelize, type) => {

    const Product = sequelize.define('product', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: type.STRING,
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
        description: {
            type: type.STRING,
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
        price: {
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

    return Product
};
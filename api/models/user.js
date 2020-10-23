const bcrypt = require('bcrypt');

module.exports = (sequelize, type) => {
    const User = sequelize.define('user', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        role: {
            type: type.ENUM('admin', 'customer'),
            defaultValue: 'customer'
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
        username: {
            type: type.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: '¡Este campo no puede estar vacío!'
                },
                notEmpty: {
                    msg: '¡Este campo no puede estar vacío!'
                }
            },
            unique: {
                args: true,
                msg: 'El nombre de usuario que elegiste no está disponible. Ingresá un nuevo nombre de usuario.'
            }
        },
        password: {
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
        email: {
            type: type.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: 'Ya existe una cuenta asociada a este correo electrónico. Ingresá un nuevo correo electrónico.'
            },
            validate: {
                isEmail: {
                    msg: 'Ingresá un correo electrónico válido.'
                }
            }
        },
        phone: {
            type: type.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: 'Ya existe una cuenta asociada a este número telefónico. Ingresá un nuevo número.'
            }
        },
        address: {
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
        }

    }, {
        instanceMethods: {
            generateHash(password) {
                return bcrypt.hash(password, bcrypt.genSaltSync(8));
            },
            validPassword(password) {
                return bcrypt.compare(password, this.password);
            }
        }
    });

    return User
};
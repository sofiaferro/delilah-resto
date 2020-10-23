const Sequelize = require('sequelize');
const ProductModel = require('./api/models/product');
const UserModel = require('./api/models/user');
const OrderModel = require('./api/models/order');
const OrderProductsModel = require('./api/models/orderProducts');

//conexión con la base de datos
const sequelize = new Sequelize('HppTkE87JZ', 'HppTkE87JZ', 'uA4Bvkhl0Z', {
    host: 'remotemysql.com',
    dialect: 'mysql',
    username: process.env.DB_USER,
    password: process.env.DB_PASS
});

//modelos para productos, usuarios y órdenes
const Product = ProductModel(sequelize, Sequelize);
const User = UserModel(sequelize, Sequelize);
const Order = OrderModel(sequelize, Sequelize);
const OrderProducts = OrderProductsModel(sequelize, Sequelize);

User.hasMany(Order);
Order.belongsTo(User);
Order.belongsToMany(Product, {
    through: OrderProducts,
    foreignKey: 'orderId',
    otherKey: 'productId'
});
Product.belongsToMany(Order, {
    through: OrderProducts,
    foreignKey: 'productId',
    otherKey: 'orderId'
});

//sincronización con la base de datos
sequelize.sync({ force: false })
    .then(() => {
        console.log('Base de datos para Delilah sincronizada');
    }).catch((error) => {
        console.log('No se puede conectar con la base de datos', error);
    });

module.exports = { Product, User, Order, OrderProducts }
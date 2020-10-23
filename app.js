const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const Sequelize = require('sequelize');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

//importar rutas
const authRoutes = require('./api/routes/auth');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');
const db = require('./db')

dotenv.config();

//body parser middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//cors handling
app.use(cors());

//cors handling
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, PUT, PATCH, POST, DELETE');
        return res.status(200).json({});
    }
    next();
});

//middlewares de rutas
app.use('/products', productRoutes);
app.use('/user', authRoutes);
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);

//si hay un error en los otros modulos lo atrapa acá
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

//tira el mismo código del error o tira 500
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
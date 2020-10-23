const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const { Order } = require('../../db');
const { Product } = require('../../db');
const { OrderProducts } = require('../../db');
const verifyToken = require('../verification/verifyToken');
const verifyRole = require('../verification/verifyRole');

//public routes
router.post('/create', verifyToken, async (req, res, next) => {
    try {

        //set userId
        const id = await req.user.id

        //get order with product details
        const productsArray = await req.body.products;
        const pricesArray = [];

        for (let i = 0; i < productsArray.length; i++) {
            const product = productsArray[i];
            const { productId, quantity } = product;
            const productDetails = await Product.findOne({
                where: { id: productId },
            });

            if (!productDetails) {
                return res.status(404).json({ message: 'Producto inexistente. Por favor, elija otro producto' });
            }
            const totalProductAmount = await productDetails.price * quantity;
            pricesArray.push(totalProductAmount);
        }

        const total = await pricesArray.reduce((x, y) => {
            return x + y
        });

        //create the order
        const newOrder = await Order.create({
            totalPrice: total,
            userId: id,
        }).then(data => {
            const newOrder = {
                message: 'Nueva orden creada',
                data
            };
            res.status(200).json(newOrder);
            return data
        }).catch(error => {
            res.status(500).json({
                error: error
            });
        });

        const orderId = await newOrder.dataValues.id

        for (let i = 0; i < productsArray.length; i++) {
            let product = productsArray[i];
            const { productId, quantity } = product;
            await OrderProducts.create({
                orderId: orderId,
                productId: productId,
                quantity: quantity
            });
        }


    } catch (error) {
        console.log(error)
    }
});

//admin routes
router.get('/', verifyRole, (req, res, next) => {
    Order.findAll({
        include: [{
            model: Product,
            attributes: { exclude: ['orderProducts', 'createdAt', 'updatedAt'] }
        }],
        attributes: { exclude: ['createdAt', 'updatedAt'] }
    }).then(data => {
        const response = {
            totalOrders: data.length,
            orders: data
        };

        res.status(200).json(response);
    }).catch(error => {
        console.log(error)
    });
})

router.get('/:orderId', verifyRole, (req, res, next) => {
    const id = req.params.orderId
    Order.findOne({
        where: { id: id }
    }).then((data) => {
        res.status(200).json({
            message: 'Información de la orden ' + id,
            order: data,
            getTotalOrders: {
                type: 'GET',
                url: 'http://localhost:3000/orders/'
            }
        });
    }).catch(error => {
        res.status(500).json({
            error: error
        });
    });
});


router.patch('/:orderId', verifyRole, (req, res, next) => {
    const id = req.params.orderId
    Order.update(req.body, {
        where: { id: id }
    }).then(() => {
        res.status(200).json({
            message: 'Orden actualizada',
            getUpdatedOrder: {
                type: 'GET',
                url: 'http://localhost:3000/orders/' + id
            },
            getTotalOrders: {
                type: 'GET',
                url: 'http://localhost:3000/orders/'
            }
        });
    }).catch(error => {
        res.status(500).json({
            error: error
        });
    });
});

router.delete('/:orderId', verifyRole, (req, res, next) => {
    const id = req.params.orderId
    Order.destroy({
        where: { id: id }
    }).then(() => {
        res.status(200).json({
            message: 'Orden eliminada',
            getTotalOrders: {
                type: 'GET',
                url: 'http://localhost:3000/orders/'
            }
        });
    }).catch(error => {
        res.status(500).json({
            error: error
        });
    });
});


module.exports = router;
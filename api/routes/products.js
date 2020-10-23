const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const { Product } = require('../../db');
const verifyToken = require('../verification/verifyToken');
const verifyRole = require('../verification/verifyRole');

//public route
router.get('/', verifyToken, (req, res, next) => {
    Product.findAll()
        .then((data) => {
            const response = {
                totalProducts: data.length,
                products: data.map(data => {
                    return {
                        id: data.id,
                        name: data.name,
                        price: data.price,
                        getProduct: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + data.id
                        }
                    }
                })
            };
            res.status(200).json(response);
        }).catch(error => {
            res.status(500).json({
                error: error
            });
        });
});

//admin routes
router.post('/', verifyRole, (req, res, next) => {
    Product.create(req.body)
        .then(data => {
            const response = {
                message: 'Nuevo producto creado',
                product: {
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt,
                },
                getAllProducts: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/'
                }
            };
            res.status(200).json(response);
        }).catch(error => {
            res.status(500).json({
                error: error
            });
        });
});

router.get('/:productId', verifyRole, (req, res, next) => {
    const id = req.params.productId
    Product.findOne({
        where: { id: id }
    }).then((data) => {
        res.status(200).json({
            message: 'Información del producto ' + id,
            product: {
                id: data.id,
                name: data.name,
                description: data.description,
                price: data.price,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            },
            getTotalProducts: {
                type: 'GET',
                url: 'http://localhost:3000/products/'
            }
        });
    }).catch(error => {
        res.status(500).json({
            error: error
        });
    });
});

router.patch('/:productId', verifyRole, (req, res, next) => {
    const id = req.params.productId
    Product.update(req.body, {
        where: { id: id }
    }).then(() => {
        res.status(200).json({
            message: 'Producto actualizado',
            getUpdatedProduct: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + id
            },
            getTotalProducts: {
                type: 'GET',
                url: 'http://localhost:3000/products/'
            }
        });
    }).catch(error => {
        res.status(500).json({
            error: error
        });
    });
});

router.delete('/:productId', verifyRole, (req, res, next) => {
    const id = req.params.productId
    Product.destroy({
        where: { id: id }
    }).then(() => {
        res.status(200).json({
            message: 'Producto eliminado',
            getTotalProducts: {
                type: 'GET',
                url: 'http://localhost:3000/products/'
            }
        });
    }).catch(error => {
        res.status(500).json({
            error: error
        });
    });
});

module.exports = router;
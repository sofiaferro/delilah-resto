const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const { User } = require('../../db');
const { Order } = require('../../db');
const verifyRole = require('../verification/verifyRole');

//admin route
router.get('/', verifyRole, (req, res, next) => {
    User.findAll()
    .then((data) => {
            const response = {
                totalUsers: data.length,
                users: data.map(data => {
                    return {
                        id: data.id,
                        name: data.name,
                        username: data.username,
                        getUser: {
                            type: 'GET',
                            url: 'http://localhost:3000/users/' + data.id
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
})

router.get('/:userId', verifyRole, (req, res, next) => {
    const id = req.params.userId
    User.findOne({
        where: { id: id }
    }).then((user) => {
        res.status(200).json({
            message: 'Información del usuario ' + id,
             user: {
                id: user.id,
                role: user.role,
                name: user.name,
                username: user.username,
                email: user.email,
                phone: user.phone,
                address: user.address,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt, 
            }, 
            getTotalUsers: {
                type: 'GET',
                url: 'http://localhost:3000/users/'
            }
        });
    }).catch(error => {
        console.log(error)
        res.status(500).json({
            error: error
        });
    });
});


module.exports = router;
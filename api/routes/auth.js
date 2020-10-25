const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const { User } = require('../../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_TOKEN = "secret"

//public routes
router.post('/register', async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    User.create({

        name: req.body.name,
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address

    }).then(data => {

        const response = {
            message: 'Nuevo usuario creado',
            user: {
                id: data.id,
                name: data.name,
                username: data.username,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            }
        }
        res.status(201).json(response);
    }).catch(error => {
        res.status(500).json({
            error: error.errors[0].message
        })
    });
});

router.post('/login', (req, res) => {
    const validUsername = req.body.username
    User.findOne({ where: { username: validUsername } }).then(async (user) => {
        if (!user) {
            return res.status(500).json({
                error: 'Usuario no encontrado'
            });
        }

        const validPass = await bcrypt.compare(req.body.password, user.dataValues.password);

        if (!validPass) {
            return res.status(500).json({
                error: 'Contraseña incorrecta'
            });
        } else {
            //create and asign token
            const token = jwt.sign({ id: user.dataValues.id, role: user.dataValues.role }, JWT_TOKEN);
            return res.header('auth-token', token).json({
                message: '¡Bienvenid@ ' + user.dataValues.username + '!',
                getTotalProducts: {
                    method: 'GET',
                    url: 'http://localhost:3000/products'
                }
            })
        }

    }).catch(error => {
        return res.status(500).json(
            console.log(error)
        )
    });

});

module.exports = router;
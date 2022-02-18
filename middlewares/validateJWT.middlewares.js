const { request, response } = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken');



const validateJWT = async(req = request, res = response, next) => {
    const token = req.header('x-cargofive-key');
    if (!token) {
        return res.status(401).json({
            msg: 'The token is required'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const user = await prisma.user.findFirst({
            where: {
                id: uid
            }
        });

        if (!user) {
            return res.status(401).json({
                msg: 'The token is invalid'
            })
        }

        if (!user.status) {
            return res.status(401).json({
                msg: 'The token is invalid'
            })
        }

        req.user = user;

        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({
            msg: 'The token is invalid'
        });
    }
}


module.exports = {
    validateJWT
}
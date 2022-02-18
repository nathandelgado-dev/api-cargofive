const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
// const {User} = require('../models');
const {
    createJWT,
    sendServerError,
    encryptPass,
    deleteOldArticles,
    updateArticles
} = require('../helpers')
const prisma = new PrismaClient()

const getAllUsers = async(req, res) => {
    try {
        const activeUsers = await prisma.user.findMany({
            where:{
                status: true
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        });
                
        res.status(200).json({
            ok: true,
            amount: activeUsers.length,
            users: activeUsers
        });        
    } catch (err) {
        sendServerError(err, res);
    }
}

const getUser = async(req, res) => {
    try {
        const {id} = req.params;
    
        const user = await prisma.user.findUnique({
            where:{ id },
            select: {
                id: true,
                name: true,
                email: true
            }
        });
            
        res.status(200).json({
            ok: true,
            user
        });        
    } catch (err) {
        sendServerError(err, res);
    }
}

const userSignup = async(req, res) => {
    try {
        const { email, pass, name } = req.body;
    
        const newUser = {
            email,
            pass,
            name,
            createdAt: new Date(),
        };
    
        //Crypt the pass
        newUser.pass = encryptPass(pass)

        const savedUser = await prisma.user.create({
            data: newUser
        });

        res.status(201)
            .json({
                ok: true,
                msg: `User ${savedUser.email} created`
            });

    } catch (err) {
        sendServerError(err, res);
    }
}

const userSignin = async(req, res) => {
    try {
        const { email, pass } = req.body;

        //is exist user and is active 
        const user = await prisma.user.findFirst({
            where: {
                email: email,
                status: true
            }
        });
        if (!user || !user.status) {
            return res.status(400).json({
                ok: false,
                msg: "The email or passsword is wrong"
            });
        }

        //Verify pass
        const validPass = bcryptjs.compareSync(pass, user.pass);
        if (!validPass) {
            return res.status(400).json({
                ok: false,
                msg: "The email or passsword is wrong"
            });
        }

        //Delete old articles and get news
        deleteOldArticles(user.id);
        updateArticles(user.id);

        //Create JWT
        const token = await createJWT(user.id);

        res.status(200).json({
            ok: true,
            token      
        });
    } catch (error) {
        sendServerError(err, res);
    }
}

const updateUser = async(req, res) => {
    try {
        const {id} = req.params;
        const {email, pass, name} = req.body;
        const userByJWT = req.user;

        if(userByJWT.id !== id){
            return res.status(401).json({
                ok: false,
                msg: 'Only you can modify your own account'
            });
        }
        
        if(!email && !pass && !name) {
            return res.status(400).json({
                ok: false,
                msg: 'Should exist email, name or pass in the request body'
            });
        }

        const user = await prisma.user.findFirst({
            where: {id: id}
        });

        const updateUser = {
            email: email || user.email,
            pass: pass || user.pass,
            name: name || user.name,
            // updatedAt: new Date()
        }
        
        //Crypt the pass
        if(pass){
            updateUser.pass = encryptPass(pass);
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: updateUser
        })

        res.status(201).json({
            ok: true,
            msg: `User ${updatedUser.email} updated`
        });        
    } catch (err) {
        sendServerError(err, res);
    }
}

const deleteUser = async(req, res) => {
    try {
        const {id} = req.params;
        const user = req.user;

        if(user.id !== id) {
            return res.status(401).json({
                ok: false,
                msg: 'Only you can delete your own account'
            });
        } 
    
        // const deletedUser = await User.findByIdAndUpdate({ _id: id }, { status: false });
        const deletedUser = await prisma.user.update({
            where: { id },
            data: { status: false }            
        })

        res.status(200).json({
            ok: true,
            msg: `User ${deletedUser.email} deleted`
        });        
    } catch (err) {
        sendServerError(err, res);
    }
}

module.exports = {
    getAllUsers,
    getUser,
    userSignup,
    userSignin,
    updateUser,
    deleteUser
}
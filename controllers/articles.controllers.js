const { request, response } = require('express');
const { PrismaClient } = require('@prisma/client');
const {
    found,
    notFound,
    regexUpperGlobal,
    sendServerError,
    scrapingGetArticles,
} = require('../helpers');
const prisma = new PrismaClient()

const getAllArticles = async(req , res) => {
    try {
        const {id} = req.user;
        const articles = await prisma.post.findMany({
            where:{
                userId: id,
                status: true
            },
            select:{
                id: true,
                title: true,
                author: true,
                description: true,
                category: true,
                source: true,
                publishedAt: true                
            }
        });
                
        if(!articles || articles.length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'There are not articles'
            }); 
        }
    
        res.status(200).json({
            ok: true,
            amount: articles.length,
            articles: articles
        });        
    } catch (err) {
        sendServerError(err, res);
    }
}

const getArticle = async(req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const uid = user.id;
    
        const ArticleSearched = await prisma.post.findFirst({
            where: {
                id,
                userId: uid,
                status: true
            },
            select:{
                id: true,
                title: true,
                author: true,
                description: true,
                category: true,
                source: true,
                publishedAt: true                
            }
        });
                
        if(!ArticleSearched) {
            return res.status(400).json({
                ok: false,
                msg: 'The article not exist or is inactive'
            });
        }
    
        res.status(200).json({
            ok: true,
            article: ArticleSearched
        });        
    } catch (err) {
        sendServerError(err, res);
    }
}

const deleteArticle = async(req, res) => {
    try {
        const {id} = req.params;
        const user = req.user;
        const uid = user.id;
    
        const article = await prisma.post.findFirst({
            where: {
                id: id,
                userId: uid,
                status: true
            }
        });

        if(!article) {
            return res.status(400).json({
                ok: false,
                msg: 'The article not exist or is inactive'
            });
        }
    
        const deletedArticle = await prisma.post.update({
            where: { id },
            data: { status: false }
        });
    
        res.status(200).json({
            ok: true,
            msg: `Deleted ${deletedArticle.title} article`
        });        
    } catch (err) {
        sendServerError(err, res);
    }
}

const queriesOfArticles = async(req, res) => {
    try {
        const {category , author } = req.query;
        const user = req.user;
        const uid = user.id;
        let articles = null;
 
        if(author && category) {
            articles = await prisma.post.findMany({
                where: {
                    AND: [
                        {userId: uid},
                        {status: true},
                        {author: {
                            contains: author,
                            mode: 'insensitive'
                        }},
                        {category: {
                            has: category
                        }}
                    ]  
                },
                select: {
                    title: true,
                    description: true,
                    author: true,
                    publishedAt: true,  
                    category: true,
                    source: true  
                }
            }); 
    
            notFound(articles, res);    
            found(articles, res);
        }                 
        
        if(author) {
            articles = await prisma.post.findMany({
                where: {
                    AND: [
                        {userId: uid},
                        {status: true},
                        {author: {
                            contains: author,
                            mode: 'insensitive'
                        }}
                    ]                                       
                },
                select: {
                    title: true,
                    description: true,
                    author: true,
                    publishedAt: true,  
                    category: true,
                    source: true  
                }
            });
                    
            notFound(articles, res);    
            found(articles, res);
        }
        
        if(category) {
            articles = await prisma.post.findMany({
                where: {
                    AND: [
                        {userId: uid},
                        {status: true},
                        {category: {
                            has: category
                        }}
                    ]  
                },
                select: {
                    title: true,
                    description: true,
                    author: true,
                    publishedAt: true,  
                    category: true,
                    source: true
                }
            });
                    
            notFound(articles, res);    
            found(articles, res);
        }        
    } catch (err) {
        sendServerError(err, res);
    }
}

module.exports = {
    deleteArticle,
    getAllArticles,
    getArticle,
    queriesOfArticles,
}
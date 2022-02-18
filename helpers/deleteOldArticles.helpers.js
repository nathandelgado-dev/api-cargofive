const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const {
    scrapingGetArticles
} = require('./scraping.helpers');


const deleteOldArticles = async(uid) =>{
    const deleteArticles = await prisma.post.deleteMany({
        where: { userId: uid }
    });

    if(!deleteArticles || deleteArticles.count === 0) {
        return false
    }
    return true
}

const updateArticles = async(id) => {
 //Scraping and order data
   const postsInterLogics = await scrapingGetArticles('https://cargofive.com/category/international-logistics/', 3);
   const postsInnovation = await scrapingGetArticles('https://cargofive.com/category/innovation/', 3);
   const concatPost = postsInterLogics.concat(postsInnovation);

   for(let article of concatPost) {
       article.createdAt = new Date();
       article.userId = id;
   }

 //save in DB
   const savedArticles = await prisma.post.createMany({
       data: concatPost
   });

   if(!savedArticles || savedArticles.count === 0){
       return false;
   }
   return true;
}

module.exports = {
    deleteOldArticles,
    updateArticles
}   
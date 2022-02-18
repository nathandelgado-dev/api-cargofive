const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

const isExistEmail = async(email = '') => {
    const searchEmail = await prisma.user.findFirst({
        where: {
            email
        }
    });
    if (searchEmail) throw new Error('This email was registered');
}

const notExistUser = async(id = '') => {
    const searchUser = await prisma.user.findFirst({ where: { id }});
    if (!searchUser) throw new Error('This user not exist');
}

const isExistArticleId = async(id) => {
    const searchArticle = await prisma.post.findUnique({ where: {id} });
    if (!searchArticle) throw new Error('These id article not exist');
}


module.exports = {
    isExistEmail,
    notExistUser,
    isExistArticleId,
}
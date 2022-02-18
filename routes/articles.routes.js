const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const {
    deleteArticle,
    getAllArticles,
    getArticle,
    queriesOfArticles,
} = require('../controllers');
const { isExistArticleId } = require('../helpers');
const { validateErrors, validateJWT } = require('../middlewares');

router.get('/query', [
    validateJWT,
    check('author').if(check('author').exists().isString()),
    check('category').if(check('category').exists().isString()),
    validateErrors
], queriesOfArticles);

router.get('/', [
    validateJWT,
    validateErrors
], getAllArticles);

router.get('/:id', [
    validateJWT,
    check('id', 'The value is required').not().isEmpty(),
    check('id', 'The value is not id Valid').isMongoId(),
    check('id').custom(isExistArticleId),
    validateErrors
], getArticle);

router.delete('/:id', [
    validateJWT,
    check('id', 'The value is required').not().isEmpty(),
    check('id', 'The value is not id Valid').isMongoId(),
    check('id').custom(isExistArticleId),
    validateErrors
], deleteArticle);

module.exports = router;
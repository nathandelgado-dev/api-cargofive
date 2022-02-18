const { Router } = require('express');
const {check} = require('express-validator');
const {
    isExistEmail,
    notExistUser
} = require('../helpers');
const {
    validateErrors,
    validateJWT
} = require('../middlewares');
const {
    getAllUsers,
    getUser,
    deleteUser,
    updateUser,
    userSignin,
    userSignup
} = require('../controllers');
const router = Router();

router.get('/', [
    validateJWT,
    validateErrors
], getAllUsers);

router.get('/:id', [
    check('id', 'id user invalid').isMongoId(),
    validateJWT,
    validateErrors
], getUser);

router.post('/signup', [
    check('email', 'The value is required').not().isEmpty(),
    check('name', 'The value is required').not().isEmpty(),
    check('pass', 'The value is required').not().isEmpty(),
    check('name', 'The value is string required').isString(),
    check('pass', 'The value require min 8 caracters').isLength({ min: 8 }),
    check('email', 'The value of email is invalid').isEmail(),
    check('email').custom(isExistEmail),
    validateErrors
], userSignup);

router.post('/signin', [
    check('email', 'The email is required').not().isEmpty(),
    check('pass', 'The password is required').not().isEmpty(),
    check('pass', 'The value require min 8 caracters').isLength({ min: 8 }),
    check('email', 'The value of email is invalid').isEmail(),
    validateErrors
], userSignin);

router.put('/:id', [
    validateJWT,
    check('email', 'Not valid email').if(check('email').exists()).isEmail(),
    check('name', 'The value is string required').if(check('name').exists()).isString(),
    check('pass', 'The value require min 8 caracters').if(check('pass').exists()).isLength({ min: 8 }),
    validateErrors
], updateUser);

router.delete('/:id', [
    validateJWT,
    check('id').custom(notExistUser),
    validateErrors
], deleteUser);

module.exports = router;
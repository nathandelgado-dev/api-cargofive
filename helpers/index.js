const createJWT = require('./createJWT.helpers');
const validateInDB = require('./validateInDB.helpers');
const catchServerError = require('./catchServerError.helpers');
const encryptPass = require('./encryptPass.helpers');
const regexUpperGlobal = require('./regexUpperGlobal.helpers');
const resArticleControllers = require('./resArticleControllers.helpers');
const scraping = require('./scraping.helpers');
const deleteOldArticles = require('./deleteOldArticles.helpers'); 

module.exports = {
    ...createJWT,
    ...validateInDB,
    ...catchServerError,
    ...encryptPass,
    ...regexUpperGlobal,
    ...resArticleControllers,
    ...scraping,
    ...deleteOldArticles
}
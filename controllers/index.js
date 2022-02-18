const controllerUsers = require('./users.controllers');
const controllerArticles = require('./articles.controllers');
const controllerNotFound = require('./notFound.controllers');

module.exports = {
    ...controllerUsers,
    ...controllerArticles,
    ...controllerNotFound
}
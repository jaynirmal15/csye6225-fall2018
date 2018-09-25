'use strict';
module.exports = function(app) {

    let loginRoutes = require('./routes/api-route');
    loginRoutes(app);
}
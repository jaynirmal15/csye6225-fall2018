'use strict';
module.exports = function (app) {
    var cloudController = require('../controller/cloud-controller');
   

  // send-mail
   app.route('/time').post(cloudController.login);
    app.route('/register').post(cloudController.createuser);

}
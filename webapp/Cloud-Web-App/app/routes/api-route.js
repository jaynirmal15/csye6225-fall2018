'use strict';
module.exports = function (app) {
    var cloudController = require('../controller/cloud-controller');
   

  // send-mail
   app.route('/time').get(cloudController.login);
    app.route('/register').post(cloudController.createuser);

    app.route('/tbt').get(cloudController.checklogin);

}
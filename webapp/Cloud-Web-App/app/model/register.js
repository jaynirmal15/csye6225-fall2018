module.exports = (sequelize, Sequelize) => {
	const Register = sequelize.define('register', {
	  user_name: {
			type: Sequelize.STRING
	  },
      password: {
        type: Sequelize.STRING
    }
	});
	
	return Register;
}
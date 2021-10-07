const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
      if (!email) {
        return done(null, false, 'Необходимо указать E-mail');
      };

      if (!password) {
        return done(null, false, 'Необходимо указать пароль');
      };

      try {
        const findUser = await User.findOne({ email });

        if (!findUser){
          return done(null, false, 'Нет такого пользователя');
        };

        const isPassValid = await findUser.checkPassword(password);

        if (isPassValid){
          done(null, findUser); 
        } else {
          done(null, false, 'Неверный пароль');
        };        
      } catch (error) {
        done(error);
      };
    },
);

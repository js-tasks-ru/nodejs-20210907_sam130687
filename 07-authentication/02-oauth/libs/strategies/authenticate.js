const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) {
    return done(null, false, 'Не указан email');
  };

  try {
    const findUser = await User.findOne({ email });

    if (findUser){
      done(null, findUser); 
    } else
    {
      try {
        const newUser = await User.create({email, displayName});  
        return done(null, newUser);         
      } catch (error) {
        return done(error, false, error.message);
      };
    }; 
      
  } catch (error) {
    done(error);
  };
};

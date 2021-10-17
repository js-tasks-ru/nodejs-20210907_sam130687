const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
    const token = uuid();
    const email = ctx.request.body.email;
    const displayName = ctx.request.body.displayName;
    const pass = ctx.request.body.password;

    let findUser = await User.findOne({email : email});

    if (findUser){
        ctx.status = 400;
        ctx.body ={errors : {email : 'Такой email уже существует'}};
        return;
    };
    
    const user = new User({
        email : email,
        displayName : displayName,
        verificationToken : token,
    });      

    await user.setPassword(pass);
    await user.save();    

    await sendMail({
               template: 'confirmation',
               locals: {token: token},
               to: email,
               subject: 'Подтвердите почту',
             });    

    ctx.status = 200;
    ctx.body = { 
        status: 'ok',
    };         
};

module.exports.confirm = async (ctx, next) => {
    const verificationToken = ctx.request.body.verificationToken;

    if (!verificationToken){
        ctx.status = 400;
        ctx.body = {errors : {token : 'Отсутствует token'}};
        return;
    };

    const user = await User.findOne({verificationToken : verificationToken});

    if (!user){
        ctx.status = 400;
        ctx.body = {error : 'Ссылка подтверждения недействительна или устарела'};
        return;
    };

    const token = uuid();
    user.verificationToken = undefined;
    user.token = token; 
    await user.save();

    ctx.status = 200;
    ctx.body = { token : token };       
};

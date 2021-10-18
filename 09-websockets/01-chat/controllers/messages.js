const Message = require('../models/Message');

module.exports.messageList = async function messages(ctx, next) {
  const messages = await Message.find({chat: ctx.user}).limit(20);
  ctx.body = {};

  if (messages) {
    const resultBody = messages.map((message) => {
      return {
        date: message.date,
        text: message.text,
        id: message._id,
        user: message.user
      };  
    }); 

    ctx.status = 200;
    ctx.body = {messages: resultBody};  
  };   
};

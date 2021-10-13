const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');

function formatOrder(order) {
    return {
      id: order._id,
      user: order.user,
      product: order.product,
      phone: order.phone,
      address: order.address
    }
  };

module.exports.checkout = async function checkout(ctx, next) {
    const product = ctx.request.body.product;
    const phone = ctx.request.body.phone;
    const address = ctx.request.body.address;

    const order = await new Order({
        user : ctx.user._id,
        product: product,
        phone: phone,
        address: address,
    });

    await order.save();

    await sendMail({
        template: 'order-confirmation',
        locals: {
            id: order._id,
            product: order.product
        },
        to: ctx.user.email,
        subject: 'Order confirmation',
      });  
      
    ctx.status = 200;
    ctx.body = { 
        order: order._id,
    };     
};  

module.exports.getOrdersList = async function ordersList(ctx, next) {
    ctx.body = {};

    const orders = await Order.find({user : ctx.user._id}).populate('product');
    if (orders) {
      const resultBody = orders.map(ordersItem => {
        return formatOrder(ordersItem);  
      }); 

      ctx.status = 200;
      ctx.body = {orders: resultBody};  
    }; 
};

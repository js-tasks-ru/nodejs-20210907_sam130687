const ObjectId = require('mongoose').Types.ObjectId;
const Product = require('../models/Product');

function formatProduct(product) {
  return {
    id: product._id,
    title: product.title,
    price: product.price,
    images: product.images,
    category: product.category,
    description: product.description,
    subcategory: product.subcategory
  }
};

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  ctx.body = {};

  const products = await Product.find({subcategory : subcategory});
  if (products) {
    const resultBody = products.map(productItem => {
      return formatProduct(productItem);  
    }); 

    ctx.body = {products: resultBody};  
  };  
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find({});

  ctx.body = {};

  if (products) {
    const resultBody = products.map(productItem => {
      return formatProduct(productItem);  
    });   
    
    ctx.body = {products: resultBody};
  };  
};

module.exports.productById = async function productById(ctx, next) {
  const productId = ctx.params.id;

  if (!ObjectId.isValid(productId)) {
    ctx.status = 400;
    return;
  };

  const findProduct = await Product.findOne({_id : productId});

  if (!findProduct) {
    ctx.status = 404;
    return;
  };  
      
  ctx.body = {product : formatProduct(findProduct)};
};


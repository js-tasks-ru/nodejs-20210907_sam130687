const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const category = await Category.find({});

  if (!category) {
    ctx.throw(404, 'Category empty');
  };

  const resultBody = category.map(categoryItem => {
    const resultCategory = {
      id : categoryItem._id,
      title : categoryItem.title
    };
    
    if (categoryItem.subcategories) {
      resultCategory.subcategories = categoryItem.subcategories.map(
        (subCategoryItem) => ({
            id : subCategoryItem._id,
            title : subCategoryItem.title
          })
        );
    };

    return resultCategory;  
  });

  ctx.body = {categories: resultBody};
};

const mongoose = require('mongoose');
const { stringify } = require('uuid');
const connection = require('../libs/connection');

const subCategorySchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    }
});

const categorySchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    subcategories : [subCategorySchema]
});

module.exports = connection.model('Category', categorySchema);


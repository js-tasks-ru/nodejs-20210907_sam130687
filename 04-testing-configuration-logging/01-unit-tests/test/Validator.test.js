const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {

  function makeTest(validator, obj) {      
    it(obj.describe, function() {
      let objtype = {};
      objtype[obj.field] = obj.name;

      const errors = validator.validate(objtype);

      expect(errors).to.have.length(obj.length);
      if (errors.length > 1){
        expect(errors[0]).to.have.property('field').and.to.be.equal(obj.field);
        expect(errors[0]).to.have.property('error').and.to.be.equal(obj.error);
      };
    });
  };

  let testData = [
    {
      describe : 'Validator(type)',
      validate : {
                    name: {
                      type: 'string',
                      min: 10,
                      max: 20,
                    }
                  },
      data : [
        {
          describe : 'валидатор проверяет тип переданного значения чтобы в Swith стоял требуемый а не переданный', 
          name : 100,
          length : 1,
          field : 'name',
          error : ''
        }
      ]            
    },
    {
      describe : 'Validator(string)',
      validate : {
                    name: {
                      type: 'string',
                      min: 10,
                      max: 20,
                    }
                  },
      data : [
        {
          describe : 'валидатор проверяет строковые поля, длина меньше Min', 
          name : 'lalala',
          length : 1,
          field : 'name',
          error : 'too short, expect 10, got 6'
        }, {
          describe : 'валидатор проверяет строковые поля, нормальный объект', 
          name : 'Hello world',
          length : 0,
          field : 'name',
          error : ''
        }, {
          describe : 'валидатор проверяет строковые поля, длина больше Max', 
          name : 'Hello world ya JAvaTest',
          length : 1,
          field : 'name',
          error : 'too long, expect 20, got 23'
        }, {
          describe : 'валидатор проверяет строковые поля, пришло число', 
          name : 123435,
          length : 1,
          field : 'name',
          error : 'expect string, got number'
        }
      ]            
    },
    {
      describe : 'Validator(numbers)',
      validate : {
                    age: {
                      type: 'number',
                      min: 18,
                      max: 27,
                    }
                  },
      data : [
        {
          describe : 'валидатор проверяет числовые поля, длина меньше Min', 
          name : 5,
          length : 1,
          field : 'age',
          error : 'too little, expect 18, got 5'
        }, {
          describe : 'валидатор проверяет числовые поля, нормальный объект', 
          name : 25,
          length : 0,
          field : 'age',
          error : ''
        }, {
          describe : 'валидатор проверяет числовые поля, длина больше Max', 
          name : 150,
          length : 1,
          field : 'age',
          error : 'too big, expect 27, got 150'
        }, {
          describe : 'валидатор проверяет строковые поля, пришло число', 
          name : 'lalalalldldlfd',
          length : 1,
          field : 'age',
          error : 'expect number, got string'
        }
      ]            
    }
  ];

  for (var y = 0; y < testData.length; y++)
  {
    describe(testData[y].describe, () => {
      const validator = new Validator(testData[y].validate);

      for (var x = 0; x < testData[y].data.length; x++) {
        makeTest(validator, testData[y].data[x]);
      };
    });
  };
});
module.exports = class Validator {
  constructor(rules) {
    this.rules = rules;
  }

  validate(obj) {
    const errors = [];

    for (const field of Object.keys(this.rules)) {
      const rules = this.rules[field];

      const value = obj[field];
      const type = typeof value;

      function throwError(errText) {
        errors.push({field:field, error: errText});
        return errors;        
      };

      if (type !== rules.type) {
        throwError(`expect ${rules.type}, got ${type}`);
      }

      switch (rules.type) { 
        case 'string':
          if (value.length < rules.min) {
            throwError(`too short, expect ${rules.min}, got ${value.length}`);
          }
          if (value.length > rules.max) {
            throwError(`too long, expect ${rules.max}, got ${value.length}`);
          }
          break;
        case 'number':
          if (value < rules.min) {
            throwError(`too little, expect ${rules.min}, got ${value}`);
          }
          if (value > rules.max) {
            throwError(`too big, expect ${rules.max}, got ${value}`);
          }
          break;
      }
    }
    return errors;
  }
};

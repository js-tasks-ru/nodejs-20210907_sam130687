function sum(a, b) {
  if (isNumber(a) && (isNumber(b)))
    {
      return a + b;
    }  
  else
    {
      throw new TypeError(`Arguments not number a = ${a}, b = ${b}`); 
    }
};

function isNumber(n){
  return Number(n)=== n;
};

module.exports = sum;
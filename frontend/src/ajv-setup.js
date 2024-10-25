const Ajv = require('ajv');
const formats = require('ajv-formats');

const ajv = new Ajv({
  allErrors: true,
  formats: {
    date: true,
    time: true,
    'date-time': true
  }
});

formats(ajv);

module.exports = ajv;
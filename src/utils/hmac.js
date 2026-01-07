const { createHmac } = require('crypto');


exports.hmacProcess = (value, key) => {
  const result = createHmac('sha256', key).update(value).digest('hex');
  return result;
}
let ts = () => `${new Date().toISOString()} - `;

let log = {
  request: req => {
    console.log(ts() + req.method + ' ' + req.baseUrl + req.path);
  },
  message: req => {
    return `${req.method} ${req.baseUrl}${req.path}`;
  }
};

module.exports = log;

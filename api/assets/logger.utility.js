let ts = () => `${new Date().toISOString()} - `;

let logger = {
  request: req => {
    let message = '';
    if (Object.keys(req.body).length !== 0) {
      message = ':{' + Object.keys(req.body) + '}';
    }
    console.log(ts() + req.method + ' ' + req.baseUrl + req.path + message);
  },
  message: req => {
    return `${req.method} ${req.baseUrl}${req.path}`;
  },
  reportError: err => {
    console.log(ts() + 'WARNING! ' + err.message);
  }
};

module.exports = logger;

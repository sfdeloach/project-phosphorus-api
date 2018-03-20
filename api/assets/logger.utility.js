let ts = () => `${new Date().toISOString()} - `;

let logger = {
  startup: () => {
    console.log(`\x1b[34m${ts()}\x1b[0mPhosphorus API listening on port 3000!`);
  },
  request: req => {
    let message = '';
    if (Object.keys(req.body).length !== 0) {
      message = ':{' + Object.keys(req.body) + '}';
    }
    console.log(`\x1b[34m${ts()}\x1b[0m\x1b[32m${req.method}\x1b[0m ` + req.baseUrl + req.path + message);
  },
  message: req => {
    return `${req.method} ${req.baseUrl}${req.path}`;
  },
  reportError: err => {
    console.log(`\x1b[31m${ts()}WARNING ${err.message}\x1b[0m`);
  }
};

module.exports = logger;

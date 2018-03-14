let ts = () => `${new Date().toISOString()} - `;

let log = {
  request: req => {
    let message = '';
    if (Object.keys(req.body).length !== 0) {
      message = ' (*)';
    }
    console.log(ts() + req.method + ' ' + req.baseUrl + req.path + message);
  },
  message: req => {
    return `${req.method} ${req.baseUrl}${req.path}`;
  },
  reportError: err => {
    console.log(ts() + 'WARNING! ' + err);
  }
};

module.exports = log;

let ts = () => `${new Date().toISOString()} - `;

let log = {
  request: req => {
    console.log(ts() + req.method + ' ' + req.baseUrl + req.path);
  },
  error: err => {
    console.error(ts() + err.message);
    console.dir(err);
  }
};

module.exports = log;

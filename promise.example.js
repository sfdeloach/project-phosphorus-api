// Simulates an existing callback type function
let request = (seconds, callback) => {
  const startTime = new Date();
  while (new Date() - startTime <= seconds * 1000) {}

  callback(null, 'response', 'data');
};

// Promise wrapper function
function getData() {
  return new Promise((resolve, reject) => {
    // call asynch here
    request(2.5, (err, res, data) => {
        if (err) reject(err);
        else resolve(data);
    });
  });
}

// Cleaner code
getData(
).then(
  data => console.log(data)
).then(
  () => {
    request(2.5);
    console.log('second request');
  }
).catch(
  err => {
    console.log('oops, we have an error!');
    console.error(err);
  }
);

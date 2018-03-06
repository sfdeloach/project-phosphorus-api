class ErrorJSONResponse {
  constructor(command, error, keg) {
    this.message = `an error occurred during ${command}`;
    this.error = error;
    this.keg = keg;
  }
}

module.exports = ErrorJSONResponse;

class ErrorJSONResponse {
  constructor(command, error, keg) {
    this.message = `an problem occurred during ${command}`;
    this.error = error.message;
    this.keg = keg;
  }
}

module.exports = ErrorJSONResponse;

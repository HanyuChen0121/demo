// customErrors.js
class CustomError extends Error {
    constructor(message) {
      super(message);
      this.name = this.constructor.name;
    }
  }
  
  class NetworkError extends CustomError {
    constructor(message) {
      super(message);
    }
  }
  
  class AuthError extends CustomError {
    constructor(message) {
      super(message);
    }
  }
  
  class DatabaseError extends CustomError {
    constructor(message) {
      super(message);
    }
  }
  
  export { CustomError, NetworkError, AuthError, DatabaseError };
  
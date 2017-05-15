const assert = require('assert');

const userModel = require('../../src/models/user');

let validationMethod = null;
userModel({
  define: (name, table, opts) => {
    validationMethod = opts.classMethods.isValid;
  }
}, {});

describe('Running tests for validation method in user model', () => {
  it('returns flase if input is null', () => {
    assert(validationMethod(null) === false);
  });

  it('returns false if inputs are missing', () => {
    let user = {
      username: '',
      password: '',
      displayName: '',
      bioDescription: '',
      email: ''
    };

    for (let key in user) {
      if (Math.random() < 0.5)
        delete user[key];
    }

    assert(validationMethod(user) === false);
  });
})

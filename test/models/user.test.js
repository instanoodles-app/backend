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

  it('returns false if inputs are the wrong type', () => {
    let types = [1, {}, [], () => { }];
    let user = {
      username: '',
      password: '',
      displayName: '',
      bioDescription: '',
      email: ''
    };

    for (let key in user) {
      user[key] = types[Math.floor(Math.random() * types.length)];
    }

    assert(validationMethod(user) === false);
  });

  it('returns false if the email format is invalid', () => {
    let user = {
      username: '',
      password: '',
      displayName: '',
      bioDescription: '',
      email: '1234'
    };
    assert(validationMethod(user) === false);
  });

  it('returns false if the username is more than 64 bytes', () => {
    let user = {
      username: require('crypto').randomBytes(128).toString('hex'),
      password: '',
      displayName: '',
      bioDescription: '',
      email: 'asd@asd.com'
    };
    assert(validationMethod(user) === false);
  });

  it('returns false if the username is less than 4 bytes', () => {
    let user = {
      username: '',
      password: '',
      displayName: '',
      bioDescription: '',
      email: 'asd@asd.com'
    };
    assert(validationMethod(user) === false);
  });

  it('returns false if the password is less than 8 bytes', () => {
    let user = {
      username: 'asdasd',
      password: '',
      displayName: '',
      bioDescription: '',
      email: 'asd@asd.com'
    };
    assert(validationMethod(user) === false);
  });

  it('returns false if the password is more than 255 bytes', () => {
    let user = {
      username: 'asdasd',
      password: require('crypto').randomBytes(256).toString('hex'),
      displayName: '',
      bioDescription: '',
      email: 'asd@asd.com'
    };
    assert(validationMethod(user) === false);
  });
});

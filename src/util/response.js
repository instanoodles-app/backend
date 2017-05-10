module.exports = function (code, data, res) {
  let body = {
    status: null,
    code,
    data
  };
  switch (code) {
    case 401:
      body.status = 'Unauthorized';
      break;
    case 500:
      body.status = 'Internal server error';
      break;
    case 404:
      body.status = 'Not found';
      break;
    case 400:
      body.status = 'Bad request';
      break;
    case 403:
      body.status = 'Forbidden';
      break;
    case 200:
      body.status = 'Success';
  }

  res.status(body.code);
  res.json(body);
}
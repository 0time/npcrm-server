const keys = ['jsonResponse', 'response', 'responseText'];

module.exports = result => {
  let response = null;
  let key = null;

  if (Array.isArray(result)) {
    return result;
  }

  for (let i = 0; i < keys.length; ++i) {
    key = keys[i];
    response = result[key];

    if (response) {
      if (key === 'jsonResponse') {
        return JSON.stringify(response);
      } else {
        return response;
      }
    }
  }

  throw new Error('a valid response was not found');
};

/* global fetch */
export function callApi(url, obj = {}) {
  const options = {
    ...obj,
  };

  return fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        return response.text()
          .then(text => Promise.reject(text));
      }
      return response.json();
    })
    .catch((err) => { throw err; });
}

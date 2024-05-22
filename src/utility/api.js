const isDev = process.env.NODE_ENV === 'development';
const dataAPI = isDev ? 'http://localhost:8000' : 'https://monneey-fe846abf0722.herokuapp.com';

function headers() {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    // ...(auth.token && { Authorization: `Bearer ${auth.token}` }),
  };
}

export function get(url) {
  return fetch(dataAPI + url, {
    method: 'GET',
    headers: headers(),
  })
    .then((res) => res.json())
    .then((data) => {
      return {
        success: true,
        data: data,
      };
    })
    .catch((error) => {
      console.error('Get ' + url + ' fail', error);
      return {
        success: false,
        data: null,
        error: error.name,
        message: error.message,
      };
    });
}

export function post(url, payload) {
  return fetch(dataAPI + url, {
    method: 'POST',
    headers: headers(),
    body: payload,
  })
    .then((res) => res.json())
    .then((data) => {
      return {
        success: true,
        data: data,
      };
    })
    .catch((error) => {
      console.error('Post ' + url + ' fail', payload, error);
      return {
        success: false,
        data: null,
        error: error.name,
        message: error.message,
      };
    });
}

const index = {
  get,
  post,
  domain: dataAPI,
};

export default index;

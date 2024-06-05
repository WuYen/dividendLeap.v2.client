const isDev = process.env.NODE_ENV === 'development';
const dataAPI = isDev ? 'http://localhost:8000' : 'https://monneey-fe846abf0722.herokuapp.com';

function headers() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export function get(url) {
  return fetch(dataAPI + url, {
    method: 'GET',
    headers: headers(),
  })
    .then((res) => res.json())
    .then((payload) => {
      console.info(`get:${url}`, payload);
      return payload;
    });
}

export function post(url, payload) {
  return fetch(dataAPI + url, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  })
    .then((res) => res.json())
    .then((payload) => {
      console.info(`post:${url}`, payload);
      return payload;
    });
}

const index = {
  get,
  post,
  domain: dataAPI,
};

export default index;

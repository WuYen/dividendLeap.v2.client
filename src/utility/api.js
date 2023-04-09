const isDev = process.env.NODE_ENV === 'development';
const dataAPI = isDev ? 'http://localhost:8000' : 'https://jolly-bee-garment.cyclic.app';

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
    .catch((error) => {
      console.log('error', error);
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
    .catch((error) => {
      console.log('error', error);
    });
}

const index = {
  get,
  post,
};

export default index;

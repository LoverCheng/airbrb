/**
 * @module http
 * @category Utils
 * @subcategory http
 */
// import { BACKEND_PORT } from '../config.json'
import config from '../config.json'

const BACKEND_PORT = config.BACKEND_PORT;

const getDefaultOptions = () => {
  const token = localStorage.getItem('token');
  const defaultOptions = token
    ? {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    : {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };
  return defaultOptions;
};
/**
 * Get the data from the backend
 * @param {string} path
 * @param {object} body
 * @param {string} method_
 * @returns {Promise}
 */
const BaseApiCall = (path, body, method_ = 'GET') => {
  return new Promise((resolve, reject) => {
    if (!navigator.onLine) {
      // Try to retrieve data from IndexedDB here and resolve
      // Or, show a fallback message to the user that they are offline
      resolve('You are currently offline, and data is loaded from the cache.');
    } else {
      fetch(`http://localhost:${BACKEND_PORT}/` + path, {
        ...getDefaultOptions(),
        method: method_,
        body: JSON.stringify(body),
      })
      // response still a promise
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          console.log('reject');
          reject(error);
        });
    }
  });
};

// encapsulate the Call function
/**
 * @param {string} path
 * @param {object} body
 * @returns
 */
const apiCallGet = (path, body) => {
  return BaseApiCall(path, body, 'GET');
};

/**
 * @param {string} path
 * @param {object} body
 * @returns
 */
const apiCallPost = (path, body) => {
  return BaseApiCall(path, body, 'POST');
};

const apiCallPut = (path, body) => {
  return BaseApiCall(path, body, 'PUT');
};

const apiCallDelete = (path, body) => {
  return BaseApiCall(path, body, 'DELETE');
};

const http = {
  get: apiCallGet,
  post: apiCallPost,
  put: apiCallPut,
  delete: apiCallDelete,
};
export default http;

/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
import kyOriginal from 'ky-universal';

export const DEFAULT_HEADERS = {
  Accept: 'application/ld+json, application/json'
};

const ky = kyOriginal.create({headers: DEFAULT_HEADERS});

const proxyMethods = new Set([
  'get', 'post', 'push', 'patch', 'head', 'delete'
]);

export const httpClient = new Proxy(ky, {
  apply: _handleResponse,
  get(target, propKey) {
    const propValue = target[propKey];

    // only intercept particular methods
    if(!proxyMethods.has(propKey)) {
      return propValue;
    }
    return async function() {
      return _handleResponse(propValue, this, arguments);
    };
  }
});

async function _handleResponse(target, thisArg, args) {
  let response;
  try {
    response = await target.apply(thisArg, args);
  } catch(e) {
    return _handleError(e);
  }
  const {parseBody = true} = args[1] || {};
  if(parseBody) {
    // a 204 will not include a content-type header
    const contentType = response.headers.get('content-type');
    if(contentType && contentType.includes('json')) {
      response.data = await response.json();
    }
  }
  return response;
}

async function _handleError(e) {
  // handle network errors that do not have a response
  if(!e.response) {
    if(e.message === 'Failed to fetch') {
      e.message = `${e.message}. Possible CORS error.`;
    }
    throw e;
  }

  // always move status up to the root of e
  e.status = e.response.status;

  const contentType = e.response.headers.get('content-type');
  if(contentType && contentType.includes('json')) {
    const errorBody = await e.response.json();
    // the HTTPError received from ky has a generic message based on status
    // use that if the JSON body does not include a message
    e.message = errorBody.message || e.message;
    e.data = errorBody;
  }
  throw e;
}

export default {
  httpClient,
  ky: kyOriginal,
  DEFAULT_HEADERS,
};

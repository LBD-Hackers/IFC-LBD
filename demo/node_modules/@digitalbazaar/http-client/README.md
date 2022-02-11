# http-client
An opinionated, isomorphic HTTP client.

### Usage

#### Import httpClient
```js
import {httpClient} from '@digitalbazaar/http-client';
```

#### GET a JSON response in the browser
```js
try {
  result = await httpClient.get('http://httpbin.org/json');
  return result.data;
} catch(e) {
  // status is HTTP status code
  // data is JSON error from the server
  const {data, status} = e;
  throw e;
}
```

#### GET a JSON response in Node with a HTTP Agent
```js
import https from 'https';
// use an agent to avoid self-signed certificate errors
const agent = new https.Agent({rejectUnauthorized: false});
try {
  result = await httpClient.get('http://httpbin.org/json', {agent});
  return result.data;
} catch(e) {
  // status is HTTP status code
  // data is JSON error from the server if available
  const {data, status} = e;
  throw e;
}
```

#### GET HTML by overriding default headers
```js
const headers = {Accept: 'text/html'};
try {
  result = await httpClient.get('http://httpbin.org/json', {headers});
  // see: https://developer.mozilla.org/en-US/docs/Web/API/Body#Methods
  return result.response.text();
} catch(e) {
  // status is HTTP status code
  // any message from the server can be parsed from the response if present
  const {response, status} = e;
  throw e;
}
```

#### POST a JSON payload
```js
try {
  result = await httpClient.post('http://httpbin.org/json', {
    // `json` is the payload or body of the POST request
    json: {some: 'data'}
  });
  return result.data;
} catch(e) {
  // status is HTTP status code
  // data is JSON error from the server
  const {data, status} = e;
  throw e;
}
```

#### POST a JSON payload in Node with a HTTP Agent
```js
import https from 'https';
// use an agent to avoid self-signed certificate errors
const agent = new https.Agent({rejectUnauthorized: false});
try {
  result = await httpClient.post('http://httpbin.org/json', {
    agent,
    // `json` is the payload or body of the POST request
    json: {some: 'data'}
  });
  return result.data;
} catch(e) {
  // status is HTTP status code
  // data is JSON error from the server
  const {data, status} = e;
  throw e;
}
```

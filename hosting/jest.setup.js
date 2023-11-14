// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

import 'whatwg-fetch';
import {initializeFirebaseApp} from "./utils/initializeFirebaseApp";

global.fetch = require('jest-fetch-mock');

fetch.mockResponse(JSON.stringify({testing: true})); // mock every fetchCall in all tests with this default value

initializeFirebaseApp()
import { snakeCase } from 'lodash';

import switchCase from './switchCase';

const toSnakeCase = (obj) => switchCase(obj, snakeCase);

export default toSnakeCase;

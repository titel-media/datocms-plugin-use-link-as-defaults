import { camelCase } from 'lodash';

import switchCase from './switchCase';

const toCamelCase = (obj) => switchCase(obj, camelCase);

export default toCamelCase;

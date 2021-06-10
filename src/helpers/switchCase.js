import { entries, isArray, isString } from 'lodash';

function switchCase(obj, fn) {
  if (isString(obj)) return fn(obj);
  if (isArray(obj)) return obj.map((item) => switchCase(item, fn));
  return entries(obj).reduce((acc, [k, v]) => ({ ...acc, [fn(k)]: v }), {});
}

export default switchCase;

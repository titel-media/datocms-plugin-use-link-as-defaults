import { useReducer } from 'react';
import { isArray, isFunction } from 'lodash';

const useReducerWithMiddleware = (reducer, initialState, fns) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const dispatchWithMiddleware = (action) => {
    if (isFunction(fns)) {
      fns(action);
    } else if (isArray(fns)) {
      fns.forEach((fn) => fn(action));
    }

    dispatch(action);
  };

  return [state, dispatchWithMiddleware];
};

export default useReducerWithMiddleware;

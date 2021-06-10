import { noop } from 'lodash';

export const getLoggerMiddleware = (devMode) =>
  devMode
    ? (action) => {
        /* eslint-disable no-console */
        console.groupCollapsed(`action ${action.type}`);
        console.log({ action });
        console.groupEnd();
        /* eslint-enable no-console */
      }
    : noop;

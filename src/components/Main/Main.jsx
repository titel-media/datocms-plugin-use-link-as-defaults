import React, { useEffect } from 'react';
import { arrayOf, bool, shape, string } from 'prop-types';
import { get, isEmpty } from 'lodash';

import connectToDatoCms from '@root/hoc/connectToDatoCms';
import { STATES, ACTIONS } from '@root/redux/constants';
import { fillEmptyFields, initializeSourceAndTarget, clearFields, toggleFieldsVisibilty } from '@root/helpers';
import { getLoggerMiddleware } from '@root/redux/middleware';
import { usePrevious, useReducerWithMiddleware } from '@root/hooks';
import {
  clearAll,
  deselectId,
  emptyFields,
  fieldsFilled,
  initializeView,
  resetFields,
  selectId,
  startFillingFields,
} from '@root/redux/actions';

import './Main.scss';

const initialState = {
  client: null,
  config: null,
  hasContent: false,
  loading: true,
  plugin: null,
  source: null,
  systemState: STATES.LAUNCH,
  target: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.INITIALIZE_CONFIG:
      return initializeView(state, action);
    case ACTIONS.SELECT:
      return selectId(state, action);
    case ACTIONS.DESELECT:
      return deselectId(state);
    case ACTIONS.START_DESELECTION:
      return emptyFields(state, true);
    case ACTIONS.FILL_FIELDS:
      return startFillingFields(state, action);
    case ACTIONS.FIELDS_FILLED:
      return fieldsFilled(state);
    case ACTIONS.RESET_FIELDS:
      return resetFields(state);
    case ACTIONS.EMPTY_FIELDS:
      return emptyFields(state, false);
    case ACTIONS.CLEAR_ALL:
      return clearAll(state, false);
    default:
      return state;
  }
};

// eslint-disable-next-line max-lines-per-function
const Main = ({ config, client, devMode, text, plugin }) => {
  Main.devMode = devMode;
  const selectedId = plugin.getFieldValue(plugin.fieldPath);

  const hasContent = !isEmpty(selectedId);
  const [state, dispatch] = useReducerWithMiddleware(
    reducer,
    { ...initialState, loading: hasContent, hasContent },
    getLoggerMiddleware(devMode),
  );

  const currentSystemState = state.systemState;
  const previousSystemState = usePrevious(state.systemState);

  const onResetClick = () => {
    dispatch({
      type: ACTIONS.RESET_FIELDS,
    });
  };

  const onClearClick = () => {
    dispatch({
      type: ACTIONS.EMPTY_FIELDS,
    });
  };

  useEffect(() => {
    dispatch({
      type: ACTIONS.INITIALIZE_CONFIG,
      plugin,
      client,
      config,
    });

    const listener = plugin.addFieldChangeListener(plugin.fieldPath, (newId) => {
      dispatch({
        type: !isEmpty(newId) ? ACTIONS.SELECT : ACTIONS.CLEAR_ALL,
        selectedId: newId,
      });
    });

    return () => {
      listener.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (currentSystemState !== previousSystemState) {
      switch (currentSystemState) {
        case STATES.READY:
          if (selectedId) {
            dispatch({
              type: ACTIONS.SELECT,
              selectedId,
            });
          } else {
            clearFields(state);
          }
          break;
        case STATES.SELECTED:
          initializeSourceAndTarget(state).then((data) => {
            dispatch({
              ...data,
              type: ACTIONS.FILL_FIELDS,
            });
          });
          break;
        case STATES.START_FIELDS_FILLED:
          fillEmptyFields(state).then(() => {
            dispatch({
              type: ACTIONS.FIELDS_FILLED,
            });
          });
          break;
        case STATES.EMPTY_FIELDS:
          clearFields(state).then(() => {
            dispatch({
              type: ACTIONS.FIELDS_FILLED,
            });
          });
          break;
        case STATES.CLEAR_ALL:
          clearFields(state).then(() => {
            dispatch({
              type: ACTIONS.DESELECT,
            });
          });
          break;
        default:
          break;
      }
    }
  }, [currentSystemState, previousSystemState, state]);

  useEffect(() => {
    if (currentSystemState === STATES.LAUNCH) return;

    // will show
    if (!state.loading && state.hasContent) {
      toggleFieldsVisibilty(state, true);
    }

    // will hide
    if (!state.loading && !state.hasContent) {
      toggleFieldsVisibilty(state, false);
    }
  }, [state.loading, state.hasContent, currentSystemState, hasContent]);

  return (
    <div className="container">
      <div className="status">
        {isEmpty(selectedId) && !state.loading && <p>{text.nothingSet}</p>}
        {state.loading && (
          <div className="loading">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}
      </div>
      <div className="controls">
        <button
          className="DatoCMS-button DatoCMS-button--micro"
          disabled={currentSystemState !== STATES.DONE_FIELDS_FILLED}
          onClick={onResetClick}
        >
          {text.resetButton}
        </button>
        <button
          className="DatoCMS-button DatoCMS-button--micro"
          disabled={currentSystemState !== STATES.DONE_FIELDS_FILLED}
          onClick={onClearClick}
        >
          {text.clearButton}
        </button>
      </div>
    </div>
  );
};

Main.log = (...args) => {
  if (Main.devMode) {
    console.log(...args); // eslint-disable-line no-console
  }
};

Main.propTypes = {
  client: shape({}).isRequired,
  config: shape({
    fields: arrayOf(string).isRequired,
    assign: shape({}),
  }).isRequired,
  devMode: bool,
  text: shape({
    resetButton: string,
    clearButton: string,
    nothingSet: string,
  }),
  plugin: shape({}).isRequired,
};

Main.defaultProps = {
  devMode: false,
};

const defaultText = {
  clearButton: 'Clear all fields',
  nothingSet: 'Select a reference above.',
  resetButton: 'Reset empty fields',
};

export default connectToDatoCms((plugin) => ({
  devMode: plugin.parameters.global.developmentMode,
  text: {
    clearButton: get(plugin.parameters.global, `textClearButton`) || defaultText.clearButton,
    nothingSet: get(plugin.parameters.global, `textNothingSet`) || defaultText.nothingSet,
    resetButton: get(plugin.parameters.global, `textResetButton`) || defaultText.resetButton,
  },
  config: JSON.parse(plugin.parameters.instance.config),
}))(Main);

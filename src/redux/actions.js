/* eslint-disable no-param-reassign */

import produce from 'immer';

import { STATES } from '@root/redux/constants';

export const initializeView = produce((draft, { plugin, client, config }) => {
  draft.plugin = plugin;
  draft.client = client;
  draft.config = config;
  draft.systemState = STATES.READY;
});

export const selectId = produce((draft, { selectedId }) => {
  draft.selectedId = selectedId;
  draft.loading = true;
  draft.systemState = STATES.SELECTED;
  draft.hasContent = Boolean(selectedId);
});

export const deselectId = produce((draft) => {
  draft.selectedId = null;
  draft.loading = false;
  draft.hasContent = false;
  draft.source = null;
  draft.target = null;
  draft.systemState = STATES.READY;
});

export const startFillingFields = produce((draft, { source, target }) => {
  draft.source = source;
  draft.target = target;
  draft.loading = true;
  draft.systemState = STATES.START_FIELDS_FILLED;
});

export const resetFields = produce((draft) => {
  draft.loading = true;
  draft.systemState = STATES.START_FIELDS_FILLED;
});

export const clearAll = produce((draft) => {
  draft.loading = true;
  draft.systemState = STATES.CLEAR_ALL;
});

export const emptyFields = produce((draft) => {
  draft.loading = true;
  draft.systemState = STATES.EMPTY_FIELDS;
});

export const fieldsFilled = produce((draft) => {
  draft.loading = false;
  draft.systemState = STATES.DONE_FIELDS_FILLED;
});

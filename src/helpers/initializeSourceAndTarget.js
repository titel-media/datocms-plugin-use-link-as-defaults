import { entries, find, get, isEmpty, isString, map } from 'lodash';

import { toCamelCase, toSnakeCase } from '@root/helpers';

function getFieldAttributesForModel(plugin, model) {
  return model.map((data) => plugin.fields[isString(data) ? data : data.id].attributes);
}

const getValueAndType = async (plugin, client, item, path) => {
  const [fieldName, ...subPath] = path.split('.');
  if (isEmpty(subPath)) {
    const [simpleFieldName, ...restPath] = path.split('[');
    const p = !isEmpty(restPath) ? `[${restPath.join('')}` : '';
    const allFields = await client.fields.all(item.itemType);
    return [
      get(item, `${toCamelCase(simpleFieldName)}${p}`) || get(item, `${toSnakeCase(simpleFieldName)}${p}`),
      toCamelCase(find(allFields, { apiKey: simpleFieldName })),
    ];
  }

  const id = get(item, fieldName);
  const found = await client.items.find(id);

  return getValueAndType(plugin, client, found, subPath.join('.'));
};

const initializeSourceAndTarget = async ({ client, config, plugin, selectedId }) => {
  const data = { source: {}, target: {} };
  const item = await client.items.find(selectedId);
  const itemType = await client.itemTypes.find(item.itemType);

  const configForSelectedItemType = get(config, `assign.${itemType.apiKey}`);

  data.source.model = toCamelCase(itemType);
  data.source.fields = {};
  data.source.values = {};
  data.target.model = toCamelCase(await client.itemTypes.find(plugin.itemType.id));
  data.target.fields = {};

  const targetFields = toCamelCase(getFieldAttributesForModel(plugin, plugin.itemType.relationships.fields.data));
  await Promise.all(
    map(entries(configForSelectedItemType), async ([to, from]) => {
      const [value, entityType] = await getValueAndType(plugin, client, item, from);
      data.source.fields[to] = entityType;
      data.source.values[to] = value;
      data.target.fields[to] = targetFields.find(({ apiKey }) => apiKey === to);
    }),
  );

  return Promise.resolve(data);
};

export default initializeSourceAndTarget;
